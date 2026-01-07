import { addDays, format } from "date-fns";
import { CalendarDays, Filter, Clock } from "lucide-react";

import { scheduleToday } from "../../../lib/demo-data";
import Badge from "../_components/Badge";
import Button from "../_components/Button";
import Card, { CardBody, CardHeader } from "../_components/Card";

export default function SchedulePage() {
  const start = new Date();
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Collection schedule"
          subtitle="Weekly overview and upcoming pickups"
          right={
            <div className="flex items-center gap-2">
              <Button variant="secondary">
                <Filter size={16} /> Filters
              </Button>
              <Button>
                <CalendarDays size={16} /> Add reminder
              </Button>
            </div>
          }
        />
        <CardBody>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {days.map((d) => (
              <div key={d.toISOString()} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold text-slate-500">{format(d, "EEE")}</div>
                <div className="mt-1 text-lg font-extrabold">{format(d, "d")}</div>
                <div className="mt-3 space-y-2">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2">
                    <div className="text-xs font-semibold text-slate-600">Biodegradable</div>
                    <div className="mt-1 inline-flex items-center gap-2 text-xs text-slate-600">
                      <Clock size={14} className="text-emerald-700" /> 5:00 PM
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="text-xs font-semibold text-slate-600">Dry Waste</div>
                    <div className="mt-1 inline-flex items-center gap-2 text-xs text-slate-600">
                      <Clock size={14} className="text-slate-600" /> 8:00 PM
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Today" subtitle="Detailed list" />
        <CardBody>
          <div className="space-y-3">
            {scheduleToday.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4">
                <div>
                  <div className="font-extrabold">{i.waste}</div>
                  <div className="text-sm text-slate-500">{i.timeLabel}</div>
                </div>
                <Badge tone="slate">{i.status}</Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
