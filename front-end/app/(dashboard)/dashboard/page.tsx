import Link from "next/link";
import { CheckCircle2, CreditCard, Bell, BadgeCheck } from "lucide-react";

import { alerts, reports, scheduleToday, weeklyPickups, invoices } from "../../../lib/demo-data";
import AlertsPanel from "../_components/AlertsPanel";
import WeeklyPickupsChart from "../_components/Charts";
import NextCollectionCard from "../_components/NextCollectionCard";
import StatCard from "../_components/StatCard";
import TodaySchedule from "../_components/TodaySchedule";
import Card, { CardBody, CardHeader } from "../_components/Card";
import Badge from "../_components/Badge";
import Button from "../_components/Button";

export default function DashboardPage() {
  const dueInvoice = invoices.find((i) => i.status !== "Paid");

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-7">
        <div className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome back 👋</div>
        <div className="mt-2 text-slate-600">
          Your next collection is in <span className="font-semibold">4 hours 30 minutes</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/reports"><Button>Report an issue</Button></Link>
          <Link href="/schedule"><Button variant="secondary">View schedule</Button></Link>
          <Link href="/payments"><Button variant="secondary">Pay now</Button></Link>
        </div>
      </div>

      <NextCollectionCard />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Pickups this month" value="12" icon={<CheckCircle2 size={18} />} hint="On-time: 91%" />
        <StatCard
          title="Payment status"
          value={dueInvoice ? "Due" : "Paid"}
          icon={<CreditCard size={18} />}
          hint={dueInvoice ? `${dueInvoice.period} • NPR ${dueInvoice.amountNPR}` : "All clear"}
        />
        <StatCard title="Unread alerts" value={String(alerts.filter((a) => !a.read).length)} icon={<Bell size={18} />} hint="Tap bell to view" />
        <StatCard title="Complaints resolved" value="8" icon={<BadgeCheck size={18} />} hint="Last 30 days" />
      </div>

      {/* Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklyPickupsChart data={weeklyPickups} />
        </div>
        <div>
          <TodaySchedule items={scheduleToday} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Recent reports"
              subtitle="Track issues you’ve submitted"
              right={<Link href="/reports"><Button variant="secondary">New report</Button></Link>}
            />
            <CardBody>
              <div className="space-y-3">
                {reports.slice(0, 4).map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                    <div className="min-w-0">
                      <div className="font-extrabold truncate">{r.title}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <Badge tone="slate">{r.category}</Badge>
                        <Badge tone={r.priority === "High" ? "red" : r.priority === "Medium" ? "amber" : "blue"}>{r.priority}</Badge>
                      </div>
                    </div>
                    <Badge tone={r.status === "Resolved" ? "emerald" : r.status === "In Progress" ? "amber" : "slate"}>{r.status}</Badge>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
        <div>
          <AlertsPanel items={alerts} />
        </div>
      </div>
    </div>
  );
}
