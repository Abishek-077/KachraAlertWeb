"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { io, type Socket } from "socket.io-client";
import { MessageSquareReply, Pencil, Send, Trash2, X } from "lucide-react";

import Card, { CardBody, CardHeader } from "./Card";
import Button from "./Button";
import Input from "./Input";
import { apiDelete, apiGet, apiGetBlob, apiPatch, apiPost, baseUrl } from "@/app/lib/api";
import { useAuth } from "@/app/lib/auth-context";

type ChatContact = {
  id: string;
  name: string;
  accountType: "resident" | "admin_driver";
  profileImageUrl: string | null;
};

type ChatReplyPreview = {
  messageId: string;
  senderId: string;
  senderName: string;
  body: string;
};

type ChatMessage = {
  id: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  senderProfileImageUrl: string | null;
  recipientName: string;
  recipientProfileImageUrl: string | null;
  body: string;
  createdAt: string;
  readAt: string | null;
  editedAt: string | null;
  deletedAt: string | null;
  isDeleted: boolean;
  replyTo: ChatReplyPreview | null;
};

type SendMessageAck = {
  success: boolean;
  data?: ChatMessage;
  error?: string;
};

const avatarObjectUrlCache = new Map<string, string>();
const avatarPendingCache = new Map<string, Promise<string>>();

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "U";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function upsertMessage(items: ChatMessage[], incoming: ChatMessage) {
  const next = [...items];
  const index = next.findIndex((item) => item.id === incoming.id);
  if (index >= 0) {
    next[index] = incoming;
  } else {
    next.push(incoming);
  }
  return next.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

function roleLabel(accountType: ChatContact["accountType"]) {
  return accountType === "admin_driver" ? "Admin / Driver" : "Resident";
}

function ChatAvatar({
  name,
  profileImageUrl,
  className = "h-8 w-8 text-xs"
}: {
  name: string;
  profileImageUrl: string | null;
  className?: string;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profileImageUrl ? avatarObjectUrlCache.get(profileImageUrl) ?? null : null
  );

  useEffect(() => {
    if (!profileImageUrl) {
      setAvatarUrl(null);
      return;
    }
    const cached = avatarObjectUrlCache.get(profileImageUrl);
    if (cached) {
      setAvatarUrl(cached);
      return;
    }

    let isActive = true;
    const pending = avatarPendingCache.get(profileImageUrl);
    const loadPromise =
      pending ??
      apiGetBlob(profileImageUrl).then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        avatarObjectUrlCache.set(profileImageUrl, objectUrl);
        avatarPendingCache.delete(profileImageUrl);
        return objectUrl;
      });
    if (!pending) {
      avatarPendingCache.set(profileImageUrl, loadPromise);
    }

    void loadPromise
      .then((objectUrl) => {
        if (isActive) {
          setAvatarUrl(objectUrl);
        }
      })
      .catch(() => {
        avatarPendingCache.delete(profileImageUrl);
        if (isActive) {
          setAvatarUrl(null);
        }
      });

    return () => {
      isActive = false;
    };
  }, [profileImageUrl]);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 font-semibold text-slate-600 ${className}`}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}

export default function MessagesClient() {
  const { user, accessToken, loading: authLoading } = useAuth();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const activeContactRef = useRef<string | null>(null);
  const userIdRef = useRef<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activeContactRef.current = activeContactId;
  }, [activeContactId]);

  useEffect(() => {
    userIdRef.current = user?.id ?? null;
  }, [user?.id]);

  useEffect(() => {
    if (authLoading) return;
    if (!accessToken) {
      setContacts([]);
      setActiveContactId(null);
      setContactsLoading(false);
      return;
    }

    const loadContacts = async () => {
      setContactsLoading(true);
      setErrorMessage(null);
      try {
        const response = await apiGet<ChatContact[]>("/api/v1/messages/contacts");
        const nextContacts = response.data ?? [];
        setContacts(nextContacts);
        setActiveContactId((current) => {
          if (current && nextContacts.some((contact) => contact.id === current)) {
            return current;
          }
          return nextContacts[0]?.id ?? null;
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load contacts";
        setErrorMessage(message);
      } finally {
        setContactsLoading(false);
      }
    };

    void loadContacts();
  }, [accessToken, authLoading]);

  useEffect(() => {
    setReplyTo(null);
    setEditingMessageId(null);
    setDraft("");
  }, [activeContactId]);

  useEffect(() => {
    if (!accessToken || !activeContactId) {
      setMessages([]);
      return;
    }

    const loadConversation = async () => {
      setMessagesLoading(true);
      setErrorMessage(null);
      try {
        const response = await apiGet<ChatMessage[]>(`/api/v1/messages/${activeContactId}`);
        setMessages(response.data ?? []);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load conversation";
        setErrorMessage(message);
      } finally {
        setMessagesLoading(false);
      }
    };

    void loadConversation();
  }, [accessToken, activeContactId]);

  useEffect(() => {
    if (!accessToken || !baseUrl) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socket = io(baseUrl, {
      auth: { token: accessToken },
      transports: ["websocket"]
    });
    socketRef.current = socket;

    const handleIncomingMessage = (incoming: ChatMessage) => {
      const currentUserId = userIdRef.current;
      const currentContactId = activeContactRef.current;
      if (!currentUserId || !currentContactId) return;
      const participants = [incoming.senderId, incoming.recipientId];
      if (!participants.includes(currentUserId)) return;
      if (!participants.includes(currentContactId)) return;
      setMessages((prev) => upsertMessage(prev, incoming));
    };

    socket.on("messages:new", handleIncomingMessage);
    socket.on("messages:updated", handleIncomingMessage);

    return () => {
      socket.disconnect();
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [accessToken]);

  useEffect(() => {
    if (!messages.length) return;
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeContact = useMemo(
    () => contacts.find((contact) => contact.id === activeContactId) ?? null,
    [contacts, activeContactId]
  );

  const sendWithSocket = useCallback(
    (recipientId: string, body: string, replyToMessageId?: string) => {
      const socket = socketRef.current;
      if (!socket || !socket.connected) {
        return Promise.reject(new Error("Socket is not connected"));
      }

      return new Promise<ChatMessage>((resolve, reject) => {
        const timeout = window.setTimeout(() => {
          reject(new Error("Socket timeout"));
        }, 6000);

        socket.emit("messages:send", { recipientId, body, replyToMessageId }, (ack?: SendMessageAck) => {
          window.clearTimeout(timeout);
          if (ack?.success && ack.data) {
            resolve(ack.data);
            return;
          }
          reject(new Error(ack?.error ?? "Unable to send message"));
        });
      });
    },
    []
  );

  const onSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || !activeContactId || sending) return;

    const editingId = editingMessageId;
    const replyMessageId = replyTo?.id;

    setSending(true);
    setErrorMessage(null);
    setDraft("");

    try {
      let message: ChatMessage;
      if (editingId) {
        const response = await apiPatch<ChatMessage>(`/api/v1/messages/${activeContactId}/${editingId}`, {
          body: text
        });
        if (!response.data) {
          throw new Error("Unable to update message");
        }
        message = response.data;
        setEditingMessageId(null);
      } else {
        try {
          message = await sendWithSocket(activeContactId, text, replyMessageId);
        } catch {
          const response = await apiPost<ChatMessage>(`/api/v1/messages/${activeContactId}`, {
            body: text,
            ...(replyMessageId ? { replyToMessageId: replyMessageId } : {})
          });
          if (!response.data) {
            throw new Error("Unable to send message");
          }
          message = response.data;
        }
      }
      setMessages((prev) => upsertMessage(prev, message));
      setReplyTo(null);
    } catch (error) {
      setDraft(text);
      const message = error instanceof Error ? error.message : "Unable to send message";
      setErrorMessage(message);
    } finally {
      setSending(false);
    }
  }, [activeContactId, draft, editingMessageId, replyTo?.id, sendWithSocket, sending]);

  const onDelete = useCallback(
    async (message: ChatMessage) => {
      if (!activeContactId || deletingId) return;
      setDeletingId(message.id);
      setErrorMessage(null);
      try {
        const response = await apiDelete<ChatMessage>(`/api/v1/messages/${activeContactId}/${message.id}`);
        if (response.data) {
          setMessages((prev) => upsertMessage(prev, response.data!));
        }
      } catch (error) {
        const messageText = error instanceof Error ? error.message : "Unable to delete message";
        setErrorMessage(messageText);
      } finally {
        setDeletingId(null);
      }
    },
    [activeContactId, deletingId]
  );

  if (contactsLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="h-[72vh]">
        <CardHeader title="Chats" subtitle={`${contacts.length} contacts`} />
        <CardBody>
          <div className="space-y-2">
            {errorMessage ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                {errorMessage}
              </div>
            ) : null}
            {contacts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                No contacts available yet.
              </div>
            ) : null}
            {contacts.map((contact) => {
              const active = contact.id === activeContactId;
              return (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => setActiveContactId(contact.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ChatAvatar
                      name={contact.name}
                      profileImageUrl={contact.profileImageUrl}
                      className="h-9 w-9 text-sm"
                    />
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-900">{contact.name}</div>
                      <div className="text-xs text-slate-500">{roleLabel(contact.accountType)}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Card className="flex h-[72vh] flex-col">
        <CardHeader
          title={activeContact ? activeContact.name : "Messages"}
          subtitle={activeContact ? roleLabel(activeContact.accountType) : "Select a contact to start chatting"}
          right={
            activeContact ? (
              <ChatAvatar name={activeContact.name} profileImageUrl={activeContact.profileImageUrl} />
            ) : null
          }
        />
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!activeContact ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
              Select a contact from the left panel.
            </div>
          ) : messagesLoading ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
              Loading conversation...
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
              No messages yet. Send the first one.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const mine = message.senderId === user?.id;
                const messageText = message.isDeleted ? "This message was deleted." : message.body;
                const canEdit = mine && !message.isDeleted;
                const canDelete = mine && !message.isDeleted;
                const senderName = message.senderName || "Unknown user";
                const senderAvatar = message.senderProfileImageUrl;
                return (
                  <div key={message.id} className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}>
                    {!mine ? <ChatAvatar name={senderName} profileImageUrl={senderAvatar} /> : null}
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${
                        mine ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <div className={`mb-1 text-[11px] font-semibold ${mine ? "text-emerald-100" : "text-slate-500"}`}>
                        {senderName}
                      </div>
                      {message.replyTo ? (
                        <div
                          className={`mb-2 rounded-xl border px-3 py-2 text-xs ${
                            mine
                              ? "border-emerald-300 bg-emerald-600/40 text-emerald-50"
                              : "border-slate-300 bg-white/70 text-slate-600"
                          }`}
                        >
                          <div className="font-semibold">{message.replyTo.senderName}</div>
                          <div className="truncate">{message.replyTo.body}</div>
                        </div>
                      ) : null}
                      <div className={message.isDeleted ? "italic opacity-80" : ""}>{messageText}</div>
                      <div className={`mt-1 text-xs ${mine ? "text-emerald-100" : "text-slate-500"}`}>
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        {message.editedAt && !message.isDeleted ? " • edited" : ""}
                      </div>
                      <div className={`mt-2 flex flex-wrap gap-3 text-xs ${mine ? "text-emerald-50" : "text-slate-500"}`}>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 hover:underline"
                          onClick={() => {
                            setEditingMessageId(null);
                            setReplyTo(message);
                            setDraft("");
                          }}
                          disabled={sending}
                        >
                          <MessageSquareReply size={12} /> Reply
                        </button>
                        {canEdit ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 hover:underline"
                            onClick={() => {
                              setReplyTo(null);
                              setEditingMessageId(message.id);
                              setDraft(message.body);
                            }}
                            disabled={sending}
                          >
                            <Pencil size={12} /> Edit
                          </button>
                        ) : null}
                        {canDelete ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 hover:underline"
                            onClick={() => void onDelete(message)}
                            disabled={deletingId === message.id}
                          >
                            <Trash2 size={12} /> {deletingId === message.id ? "Deleting..." : "Delete"}
                          </button>
                        ) : null}
                      </div>
                    </div>
                    {mine ? <ChatAvatar name={senderName} profileImageUrl={senderAvatar} /> : null}
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>
          )}
        </div>
        <div className="border-t border-slate-100 px-6 py-4">
          {replyTo && !editingMessageId ? (
            <div className="mb-2 flex items-start justify-between gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800">
              <div className="min-w-0">
                <div className="font-semibold">Replying to {replyTo.senderName}</div>
                <div className="truncate">{replyTo.isDeleted ? "This message was deleted." : replyTo.body}</div>
              </div>
              <button
                type="button"
                className="inline-flex items-center text-blue-700 hover:text-blue-900"
                onClick={() => setReplyTo(null)}
              >
                <X size={14} />
              </button>
            </div>
          ) : null}
          {editingMessageId ? (
            <div className="mb-2 flex items-start justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <div>
                <div className="font-semibold">Editing message</div>
                <div>Update text and click Save.</div>
              </div>
              <button
                type="button"
                className="inline-flex items-center text-amber-700 hover:text-amber-900"
                onClick={() => {
                  setEditingMessageId(null);
                  setDraft("");
                }}
              >
                <X size={14} />
              </button>
            </div>
          ) : null}
          {errorMessage ? (
            <div className="mb-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              {errorMessage}
            </div>
          ) : null}
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void onSend();
            }}
          >
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={
                activeContact
                  ? editingMessageId
                    ? "Edit your message"
                    : `Message ${activeContact.name}`
                  : "Select a contact first"
              }
              disabled={!activeContact || sending}
            />
            <Button type="submit" disabled={!activeContact || sending || draft.trim().length === 0}>
              <Send size={16} />
              {editingMessageId ? "Save" : "Send"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
