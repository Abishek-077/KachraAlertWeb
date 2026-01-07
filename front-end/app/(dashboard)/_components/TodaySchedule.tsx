import { format } from "date-fns";

import type { ScheduleItem } from "../../../lib/types";
import Badge from "./Badge";
import Card, { CardBody, CardHeader } from "./Card";

function toneForStatus(status: ScheduleItem["status"]) {
  if (status === "Completed") return "emerald";
  if (status === "Missed") return "red";
  return "slate";
}

export default function TodaySchedule({ items }: { items: ScheduleItem[] }) {
  return (
    <Card>
      <CardHeader title="Today’s schedule" subtitle={format(new Date(), "EEEE, MMM d")} />
      <CardBody>
        <div className="space-y-3">
          {items.map((i) => (
            <div
              key={i.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4"
            >
              <div>
                <div className="font-semibold">{i.waste}</div>
                <div className="text-sm text-slate-500">{i.timeLabel}</div>
              </div>
              <Badge tone={toneForStatus(i.status)}>{i.status}</Badge>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
