"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, Receipt, CheckCircle2 } from "lucide-react";

import Badge from "./Badge";
import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";
import { apiGet, apiPost } from "@/app/lib/api";
import type { InvoiceItem } from "../../../lib/types";

type InvoiceApi = {
  id: string;
  period: string;
  amountNPR: number;
  status: "Paid" | "Due" | "Overdue";
  issuedAt: string;
  dueAt: string;
};

export default function PaymentsClient() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await apiGet<InvoiceApi[]>("/api/v1/invoices");
        const mapped =
          response.data?.map((inv) => ({
            id: inv.id,
            period: inv.period,
            amountNPR: inv.amountNPR,
            status: inv.status,
            issuedISO: inv.issuedAt
          })) ?? [];
        setInvoices(mapped);
      } catch (error) {
        console.error(error);
      }
    };
    loadInvoices();
  }, []);

  const due = useMemo(() => invoices.find((i) => i.status !== "Paid"), [invoices]);

  const handlePay = async (invoiceId: string, amountNPR: number) => {
    setPayingId(invoiceId);
    try {
      const response = await apiPost<InvoiceApi>(`/api/v1/invoices/${invoiceId}/pay`, { amountNPR });
      if (response.data) {
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === invoiceId
              ? {
                  ...inv,
                  status: response.data.status
                }
              : inv
          )
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Payments"
          subtitle="View your monthly fees and invoices"
          right={
            <Button
              disabled={!due || payingId !== null}
              onClick={() => {
                if (!due) return;
                void handlePay(due.id, due.amountNPR);
              }}
            >
              {payingId && due?.id === payingId ? "Paying..." : "Pay now"}
            </Button>
          }
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
              <div className="mt-2 text-sm text-slate-600">Supports digital payments (test mode).</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500">Receipts</div>
                  <div className="mt-1 text-2xl font-extrabold">{invoices.filter((i) => i.status === "Paid").length}</div>
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
                        <Button
                          disabled={payingId === inv.id}
                          onClick={() => void handlePay(inv.id, inv.amountNPR)}
                        >
                          {payingId === inv.id ? "Paying..." : "Pay"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
