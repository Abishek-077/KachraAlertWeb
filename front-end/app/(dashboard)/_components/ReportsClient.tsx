"use client";

import { useMemo, useState, useEffect } from "react";
import { Plus, Paperclip, X } from "lucide-react";

import type { ReportItem } from "../../../lib/types";
import Badge from "./Badge";
import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";
import Input from "./Input";
import Modal from "./Modal";
import { apiDelete, apiGet, apiPatch, apiPost, baseUrl } from "@/app/lib/api";

function statusTone(s: ReportItem["status"]) {
  if (s === "Resolved") return "emerald";
  if (s === "In Progress") return "amber";
  return "slate";
}

export default function ReportsClient({ initial }: { initial: ReportItem[] }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<ReportItem[]>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<{
    name: string;
    mimeType: string;
    dataBase64: string;
  } | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [attachmentLoading, setAttachmentLoading] = useState(false);

  type ReportApi = {
    id: string;
    title: string;
    category: ReportItem["category"];
    priority: ReportItem["priority"];
    status: ReportItem["status"];
    createdAt: string;
    attachments?: {
      id: string;
      originalName: string;
      mimeType: string;
      size: number;
      uploadedAt: string;
      url: string;
    }[];
  };

  const canCreate = useMemo(() => title.trim().length >= 6, [title]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await apiGet<ReportApi[]>("/api/v1/reports");
        const mapped =
          response.data?.map((report) => ({
            id: report.id,
            title: report.title,
            category: report.category,
            priority: report.priority,
            status: report.status,
            createdISO: report.createdAt,
            attachments: report.attachments ?? []
          })) ?? [];
        setItems(mapped);
      } catch (error) {
        console.error(error);
      }
    };
    loadReports();
  }, []);

  return (
    <>
      <Card>
        <CardHeader
          title="Reports"
          subtitle="Submit and track complaints (missed pickup, overflow, billing)"
          right={
            <Button onClick={() => setOpen(true)}>
              <Plus size={16} /> New report
            </Button>
          }
        />
        <CardBody>
          <div className="space-y-3">
            {items.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4"
              >
                <div className="min-w-0">
                  <div className="truncate font-extrabold">{r.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <Badge tone="slate">{r.category}</Badge>
                    <Badge tone={r.priority === "High" ? "red" : r.priority === "Medium" ? "amber" : "blue"}>
                      {r.priority}
                    </Badge>
                  </div>
                  {r.attachments && r.attachments.length > 0 ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold uppercase tracking-wide text-slate-400">Attachments</span>
                      {r.attachments.map((attachmentItem) => (
                        <a
                          key={attachmentItem.id}
                          href={`${baseUrl}${attachmentItem.url}`}
                          className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                        >
                          {attachmentItem.originalName}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      if (updatingId) return;
                      const nextStatus = r.status === "Resolved" ? "Open" : "Resolved";
                      setUpdatingId(r.id);
                      try {
                        await apiPatch(`/api/v1/reports/${r.id}`, { status: nextStatus });
                        setItems((prev) => prev.map((item) => (item.id === r.id ? { ...item, status: nextStatus } : item)));
                      } catch (error) {
                        console.error(error);
                      } finally {
                        setUpdatingId(null);
                      }
                    }}
                    disabled={updatingId === r.id}
                  >
                    {r.status === "Resolved" ? "Reopen" : "Resolve"}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={async () => {
                      if (deletingId) return;
                      setDeletingId(r.id);
                      try {
                        await apiDelete(`/api/v1/reports/${r.id}`);
                        setItems((prev) => prev.filter((item) => item.id !== r.id));
                      } catch (error) {
                        console.error(error);
                      } finally {
                        setDeletingId(null);
                      }
                    }}
                    disabled={deletingId === r.id}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Attach a photo or file when creating a report and download it later.
          </div>
        </CardBody>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create a report"
        description="Tell us what happened — we’ll route it to the right team."
      >
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm font-semibold text-slate-700">Title</div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Missed pickup near Block A" />
            <div className="mt-1 text-xs text-slate-500">Minimum 6 characters.</div>
          </div>

          <button
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            type="button"
            onClick={() => {
              const input = document.getElementById("report-attachment-input");
              if (input instanceof HTMLInputElement) {
                input.click();
              }
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Paperclip size={16} /> Add photo / file
            </span>
            <span className="text-xs text-slate-500">
              {attachmentLoading ? "Uploading..." : attachmentName ? "Attached" : "Optional"}
            </span>
          </button>
          <input
            id="report-attachment-input"
            type="file"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              if (!file) {
                setAttachment(null);
                setAttachmentName(null);
                return;
              }
              setAttachmentLoading(true);
              setAttachmentName(file.name);
              const reader = new FileReader();
              reader.onload = () => {
                const result = typeof reader.result === "string" ? reader.result : "";
                const base64 = result.includes(",") ? result.split(",")[1] : result;
                setAttachment({
                  name: file.name,
                  mimeType: file.type || "application/octet-stream",
                  dataBase64: base64
                });
                setAttachmentLoading(false);
              };
              reader.onerror = () => {
                console.error("Failed to read attachment");
                setAttachment(null);
                setAttachmentName(null);
                setAttachmentLoading(false);
              };
              reader.readAsDataURL(file);
            }}
          />
          {attachmentName ? (
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
              <span className="truncate">{attachmentName}</span>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"
                onClick={() => {
                  setAttachment(null);
                  setAttachmentName(null);
                  const input = document.getElementById("report-attachment-input");
                  if (input instanceof HTMLInputElement) {
                    input.value = "";
                  }
                }}
              >
                <X size={14} /> Remove
              </button>
            </div>
          ) : null}

          <div className="flex gap-2">
            <Button
              variant="secondary"
              type="button"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1"
              disabled={!canCreate || submitting || attachmentLoading}
              onClick={async () => {
                if (!canCreate || submitting || attachmentLoading) return;
                setSubmitting(true);
                try {
                  const response = await apiPost<ReportApi>("/api/v1/reports", {
                    title: title.trim(),
                    category: "Other",
                    priority: "Medium",
                    ...(attachment ? { attachment } : {})
                  });
                  if (response.data) {
                    const next: ReportItem = {
                      id: response.data.id,
                      title: response.data.title,
                      category: response.data.category,
                      createdISO: response.data.createdAt,
                      status: response.data.status,
                      priority: response.data.priority,
                      attachments: response.data.attachments ?? []
                    };
                    setItems((prev) => [next, ...prev]);
                  }
                  setTitle("");
                  setAttachment(null);
                  setAttachmentName(null);
                  setOpen(false);
                } catch (error) {
                  console.error(error);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              Create report
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
