import { CreditCard, Receipt, CheckCircle2 } from "lucide-react";

import { invoices } from "../../../lib/demo-data";
import Badge from "../_components/Badge";
import Button from "../_components/Button";
import Card, { CardBody, CardHeader } from "../_components/Card";

export default function PaymentsPage() {
  const due = invoices.find((i) => i.status !== "Paid");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Payments"
          subtitle="View your monthly fees and invoices"
          right={<Button disabled>Pay now</Button>}
        />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500">Current status</div>
                  <div className="mt-1 text-2xl font-extrabold">{due ? "Due" : "Paid"}</div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {due ? `Pay ${due.period} invoice to avoid late fees.` : "Thanks! You’re all set."}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500">Amount due</div>
                  <div className="mt-1 text-2xl font-extrabold">{due ? `NPR ${due.amountNPR}` : "NPR 0"}</div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <CreditCard size={18} />
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-600">Supports digital payments (integrate later).</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500">Receipts</div>
                  <div className="mt-1 text-2xl font-extrabold">3</div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <Receipt size={18} />
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-600">Download invoices & receipts (coming soon).</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Invoices" subtitle="History" />
        <CardBody>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-600">
                <tr>
                  <th className="px-4 py-3">Period</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-t border-slate-200 bg-white">
                    <td className="px-4 py-3 font-semibold">{inv.period}</td>
                    <td className="px-4 py-3">NPR {inv.amountNPR}</td>
                    <td className="px-4 py-3">
                      <Badge tone={inv.status === "Paid" ? "emerald" : inv.status === "Overdue" ? "red" : "amber"}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {inv.status === "Paid" ? (
                        <Button variant="secondary" disabled>Receipt</Button>
                      ) : (
                        <Button disabled>Pay</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Next: connect payment gateway (Khalti / eSewa) and auto-update invoice status.
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
