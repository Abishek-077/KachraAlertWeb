"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Info, Siren, Check, Filter } from "lucide-react";

import type { AlertItem } from "../../../lib/types";
import Badge from "./Badge";
import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";

function tone(sev: AlertItem["severity"]) {
  if (sev === "urgent") return "red";
  if (sev === "warning") return "amber";
  return "blue";
}

function icon(sev: AlertItem["severity"]) {
  if (sev === "urgent") return <Siren size={16} />;
  if (sev === "warning") return <AlertTriangle size={16} />;
  return <Info size={16} />;
}

export default function AlertsCenter({ initial }: { initial: AlertItem[] }) {
  const [items, setItems] = useState(initial);
  const unread = useMemo(() => items.filter((i) => !i.read).length, [items]);

  return (
    <Card>
      <CardHeader
        title="Alerts Center"
        subtitle={`${unread} unread`}
        right={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => console.log("Filters coming soon")}> <Filter size={16} /> Filter</Button>
            <Button
              onClick={() => setItems(items.map((i) => ({ ...i, read: true })))}
              disabled={unread === 0}
            >
              <Check size={16} /> Mark all read
            </Button>
          </div>
        }
      />
      <CardBody>
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={tone(a.severity)}>
                      <span className="inline-flex items-center gap-2">
                        {icon(a.severity)}
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
                <Button
                  variant="secondary"
                  onClick={() => setItems(items.map((i) => (i.id === a.id ? { ...i, read: true } : i)))}
                  disabled={a.read}
                >
                  <Check size={16} /> {a.read ? "Read" : "Mark read"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
