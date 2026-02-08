"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { io, type Socket } from "socket.io-client";
import { Send } from "lucide-react";

import Card, { CardBody, CardHeader } from "./Card";
import Button from "./Button";
import Input from "./Input";
import { apiGet, apiPost, baseUrl } from "@/app/lib/api";
import { useAuth } from "@/app/lib/auth-context";

type ChatContact = {
  id: string;
  name: string;
  accountType: "resident" | "admin_driver";
  profileImageUrl: string | null;
};

type ChatMessage = {
  id: string;
  senderId: string;
  recipientId: string;
  body: string;
  createdAt: string;
  readAt: string | null;
};

type SendMessageAck = {
  success: boolean;
  data?: ChatMessage;
  error?: string;
};

function upsertMessage(items: ChatMessage[], incoming: ChatMessage) {
  if (items.some((item) => item.id === incoming.id)) {
    return items;
  }
  return [...items, incoming].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

function roleLabel(accountType: ChatContact["accountType"]) {
  return accountType === "admin_driver" ? "Admin / Driver" : "Resident";
}

export default function MessagesClient() {
  const { user, accessToken, loading: authLoading } = useAuth();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
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

    socket.on("messages:new", (incoming: ChatMessage) => {
      const currentUserId = userIdRef.current;
      const currentContactId = activeContactRef.current;
      if (!currentUserId || !currentContactId) return;
      const participants = [incoming.senderId, incoming.recipientId];
      if (!participants.includes(currentUserId)) return;
      if (!participants.includes(currentContactId)) return;
      setMessages((prev) => upsertMessage(prev, incoming));
    });

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
    [contacts, activeContactId],
  );

  const sendWithSocket = useCallback((recipientId: string, body: string) => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      return Promise.reject(new Error("Socket is not connected"));
    }

    return new Promise<ChatMessage>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        reject(new Error("Socket timeout"));
      }, 6000);

      socket.emit("messages:send", { recipientId, body }, (ack?: SendMessageAck) => {
        window.clearTimeout(timeout);
        if (ack?.success && ack.data) {
          resolve(ack.data);
          return;
        }
        reject(new Error(ack?.error ?? "Unable to send message"));
      });
    });
  }, []);

  const onSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || !activeContactId || sending) return;

    setSending(true);
    setErrorMessage(null);
    setDraft("");

    try {
      let message: ChatMessage;
      try {
        message = await sendWithSocket(activeContactId, text);
      } catch {
        const response = await apiPost<ChatMessage>(`/api/v1/messages/${activeContactId}`, { body: text });
        if (!response.data) {
          throw new Error("Unable to send message");
        }
        message = response.data;
      }
      setMessages((prev) => upsertMessage(prev, message));
    } catch (error) {
      setDraft(text);
      const message = error instanceof Error ? error.message : "Unable to send message";
      setErrorMessage(message);
    } finally {
      setSending(false);
    }
  }, [activeContactId, draft, sending, sendWithSocket]);

  if (contactsLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
      <Card className="h-[70vh]">
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
                  <div className="font-semibold text-slate-900">{contact.name}</div>
                  <div className="text-xs text-slate-500">{roleLabel(contact.accountType)}</div>
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Card className="flex h-[70vh] flex-col">
        <CardHeader
          title={activeContact ? activeContact.name : "Messages"}
          subtitle={activeContact ? roleLabel(activeContact.accountType) : "Select a contact to start chatting"}
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
            <div className="space-y-3">
              {messages.map((message) => {
                const mine = message.senderId === user?.id;
                return (
                  <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                        mine ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <div>{message.body}</div>
                      <div className={`mt-1 text-xs ${mine ? "text-emerald-100" : "text-slate-500"}`}>
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>
          )}
        </div>
        <div className="border-t border-slate-100 px-6 py-4">
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
              placeholder={activeContact ? `Message ${activeContact.name}` : "Select a contact first"}
              disabled={!activeContact || sending}
            />
            <Button type="submit" disabled={!activeContact || sending || draft.trim().length === 0}>
              <Send size={16} />
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
