"use client";

import { useMemo, useState, useEffect } from "react";
import { Plus, Paperclip } from "lucide-react";

import type { ReportItem } from "../../../lib/types";
import Badge from "./Badge";
import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";
import Input from "./Input";
import Modal from "./Modal";
import { apiGet, apiPost } from "@/app/lib/api";

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

  type ReportApi = {
    id: string;
    title: string;
    category: ReportItem["category"];
    priority: ReportItem["priority"];
    status: ReportItem["status"];
    createdAt: string;
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
            createdISO: report.createdAt
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
                </div>
                <Badge tone={statusTone(r.status)}>{r.status}</Badge>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Attachments are coming soon.
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
            onClick={() => console.log("Add attachment")}
            type="button"
          >
            <span className="inline-flex items-center gap-2">
              <Paperclip size={16} /> Add photo / file
            </span>
            <span className="text-xs text-slate-500">(coming soon)</span>
          </button>

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
              disabled={!canCreate || submitting}
              onClick={async () => {
                if (!canCreate || submitting) return;
                setSubmitting(true);
                try {
                  const response = await apiPost<ReportApi>("/api/v1/reports", {
                    title: title.trim(),
                    category: "Other",
                    priority: "Medium"
                  });
                  if (response.data) {
                    const next: ReportItem = {
                      id: response.data.id,
                      title: response.data.title,
                      category: response.data.category,
                      createdISO: response.data.createdAt,
                      status: response.data.status,
                      priority: response.data.priority
                    };
                    setItems((prev) => [next, ...prev]);
                  }
                  setTitle("");
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
