"use client";

import { CalendarDays, Clock, Bell, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";

export default function NextCollectionCard() {
  const router = useRouter();
  const [note, setNote] = useState<string | null>(null);
  return (
    <Card className="overflow-hidden">
      <div className="border-l-4 border-emerald-500">
        <CardHeader
          title="Next Collection"
          subtitle="Get ready — we’ll notify you before pickup"
          right={
          <Button variant="secondary" onClick={() => router.push("/schedule")}>View schedule</Button>
          }
        />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={18} className="text-emerald-600" /> Today
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock size={18} className="text-emerald-600" /> 5:00 PM
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-600" /> Ward 10, Kathmandu
                </span>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <div className="text-xs font-semibold text-slate-500">Time remaining</div>
                <div className="mt-1 text-2xl font-extrabold text-emerald-700">4 hours 30 minutes</div>
                <div className="mt-1 text-xs text-slate-600">
                  Tip: Keep segregated waste ready near your pickup point.
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-extrabold">Quick actions</div>
              <div className="mt-3 grid gap-3">
                <Button onClick={() => setNote("Reminder set (demo)")}> <Bell size={16} /> Set reminder</Button>
                <Button variant="secondary" onClick={() => router.push("/reports")}>Report an issue</Button>
              </div>
              {note && (
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                  {note}
                </div>
              )}
              <div className="mt-4 text-xs text-slate-500">
                Reminders will appear in your alerts and (later) push notifications.
              </div>
            </div>
          </div>
        </CardBody>
      </div>
    </Card>
  );
}
