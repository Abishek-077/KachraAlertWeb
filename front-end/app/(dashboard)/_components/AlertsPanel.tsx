"use client";

import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Info, Siren, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import Badge from "./Badge";
import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";
import { useAlerts } from "@/app/lib/alerts-context";

function iconForSeverity(sev: "info" | "warning" | "urgent") {
  if (sev === "urgent") return <Siren size={16} />;
  if (sev === "warning") return <AlertTriangle size={16} />;
  return <Info size={16} />;
}

function toneForSeverity(sev: "info" | "warning" | "urgent") {
  if (sev === "urgent") return "red";
  if (sev === "warning") return "amber";
  return "blue";
}

export default function AlertsPanel() {
  const router = useRouter();
  const { alerts, markRead } = useAlerts();
  const unread = useMemo(() => alerts.filter((i) => !i.read).length, [alerts]);
  return (
    <Card>
      <CardHeader
        title="Alerts"
        subtitle={`Latest updates and reminders • ${unread} unread`}
        right={
          <Button variant="secondary" onClick={() => router.push("/alerts")}>View all</Button>
        }
      />
      <CardBody>
        <div className="space-y-3">
          {alerts.slice(0, 3).map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={toneForSeverity(a.severity)}>
                      <span className="inline-flex items-center gap-2">
                        {iconForSeverity(a.severity)}
                        {a.severity.toUpperCase()}
                      </span>
                    </Badge>
                    {!a.read ? <Badge tone="slate">NEW</Badge> : null}
                  </div>
                  <div className="mt-2 font-extrabold">{a.title}</div>
                  <div className="mt-1 text-sm text-slate-600">{a.body}</div>
                  <div className="mt-2 text-xs text-slate-500">
                    {formatDistanceToNow(new Date(a.createdISO), { addSuffix: true })}
                  </div>
                </div>
                <button
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() =>
                    void markRead(a.id)
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    <Check size={16} /> Mark read
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
