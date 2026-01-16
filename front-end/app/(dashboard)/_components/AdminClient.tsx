"use client";

import { useEffect, useMemo, useState } from "react";
import { Megaphone, Truck, CheckCircle2, XCircle } from "lucide-react";

import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";
import Input from "./Input";
import Badge from "./Badge";
import { apiDelete, apiGet, apiPost } from "@/app/lib/api";
import type { AlertItem } from "../../../lib/types";

type QueueItem = {
  id: string;
  area: string;
  route: string;
  eta: string;
  status: "Queued" | "In Progress" | "Done";
};

export default function AdminClient() {
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: "q_1", area: "Ward 10", route: "Route A", eta: "5:10 PM", status: "Queued" },
    { id: "q_2", area: "Ward 11", route: "Route B", eta: "5:35 PM", status: "In Progress" },
    { id: "q_3", area: "Ward 9", route: "Route C", eta: "6:00 PM", status: "Queued" },
  ]);

  type AlertApi = {
    id: string;
    title: string;
    body: string;
    severity: AlertItem["severity"];
    createdAt: string;
    read: boolean;
  };

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const response = await apiGet<AlertApi[]>("/api/v1/alerts");
        const mapped =
          response.data?.map((alert) => ({
            id: alert.id,
            title: alert.title,
            body: alert.body,
            createdISO: alert.createdAt,
            severity: alert.severity,
            read: alert.read
          })) ?? [];
        setAlerts(mapped);
      } catch (error) {
        console.error(error);
      }
    };
    loadAlerts();
  }, []);

  const doneCount = useMemo(() => queue.filter((q) => q.status === "Done").length, [queue]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Admin Panel"
          subtitle="Manage collections, drivers, and broadcast alerts"
        />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-semibold text-slate-500">Active routes</div>
              <div className="mt-1 text-2xl font-extrabold">2</div>
              <div className="mt-2 text-sm text-slate-600">Routes currently running</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-semibold text-slate-500">Queue size</div>
              <div className="mt-1 text-2xl font-extrabold">{queue.length}</div>
              <div className="mt-2 text-sm text-slate-600">Areas scheduled today</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-semibold text-slate-500">Completed</div>
              <div className="mt-1 text-2xl font-extrabold">{doneCount}</div>
              <div className="mt-2 text-sm text-slate-600">Finished pickups</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Collection queue" subtitle="Update status as trucks move" />
            <CardBody>
              <div className="space-y-3">
                {queue.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="slate">{q.area}</Badge>
                        <Badge tone="blue">{q.route}</Badge>
                        <Badge tone={q.status === "Done" ? "emerald" : q.status === "In Progress" ? "amber" : "slate"}>
                          {q.status}
                        </Badge>
                      </div>
                      <div className="mt-2 font-extrabold truncate">ETA: {q.eta}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          setQueue(queue.map((i) => (i.id === q.id ? { ...i, status: "In Progress" } : i)))
                        }
                        disabled={q.status !== "Queued"}
                      >
                        <Truck size={16} /> Start
                      </Button>
                      <Button
                        onClick={() => setQueue(queue.map((i) => (i.id === q.id ? { ...i, status: "Done" } : i)))}
                        disabled={q.status === "Done"}
                      >
                        <CheckCircle2 size={16} /> Done
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => setQueue(queue.filter((i) => i.id !== q.id))}
                      >
                        <XCircle size={16} /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div>
          <div className="space-y-4">
            <Card>
              <CardHeader title="Broadcast alert" subtitle="Send message to residents" />
              <CardBody>
                <div className="space-y-3">
                  <Input
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="e.g., Collection delayed by 30 minutes"
                  />
                  <Button
                    onClick={async () => {
                      if (!msg.trim()) return;
                      setSending(true);
                      setNotice(null);
                      try {
                        const response = await apiPost<AlertApi>("/api/v1/alerts/broadcast", {
                          title: msg.trim(),
                          body: msg.trim(),
                          severity: "info"
                        });
                        if (response.data) {
                          setAlerts((prev) => [
                            {
                              id: response.data.id,
                              title: response.data.title,
                              body: response.data.body,
                              createdISO: response.data.createdAt,
                              severity: response.data.severity,
                              read: response.data.read
                            },
                            ...prev
                          ]);
                        }
                        setMsg("");
                        setNotice("Broadcast sent.");
                      } catch (error) {
                        setNotice((error as Error).message ?? "Failed to broadcast.");
                      } finally {
                        setSending(false);
                      }
                    }}
                    disabled={sending || !msg.trim()}
                  >
                    <Megaphone size={16} /> Send
                  </Button>
                  {notice ? <div className="text-xs text-slate-500">{notice}</div> : null}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Broadcast history" subtitle="Manage sent alerts" />
              <CardBody>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-extrabold">{alert.title}</div>
                          <div className="mt-1 text-sm text-slate-600">{alert.body}</div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={alert.severity === "urgent" ? "red" : alert.severity === "warning" ? "amber" : "blue"}>
                            {alert.severity}
                          </Badge>
                          <Button
                            variant="secondary"
                            onClick={async () => {
                              if (updatingId) return;
                              setUpdatingId(alert.id);
                              try {
                                await apiPost(`/api/v1/alerts/${alert.id}/read`);
                                setAlerts((prev) =>
                                  prev.map((item) => (item.id === alert.id ? { ...item, read: true } : item))
                                );
                              } catch (error) {
                                console.error(error);
                              } finally {
                                setUpdatingId(null);
                              }
                            }}
                            disabled={alert.read || updatingId === alert.id}
                          >
                            Mark read
                          </Button>
                          <Button
                            variant="danger"
                            onClick={async () => {
                              if (deletingId) return;
                              setDeletingId(alert.id);
                              try {
                                await apiDelete(`/api/v1/alerts/${alert.id}`);
                                setAlerts((prev) => prev.filter((item) => item.id !== alert.id));
                              } catch (error) {
                                console.error(error);
                              } finally {
                                setDeletingId(null);
                              }
                            }}
                            disabled={deletingId === alert.id}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
                      No broadcasts yet.
                    </div>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
