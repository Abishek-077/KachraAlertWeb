"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CreditCard, Receipt } from "lucide-react";

import Badge from "./Badge";
import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";
import { apiGet, apiPatch, apiPost, baseUrl } from "@/app/lib/api";
import { useRole } from "./useRole";
import type { InvoiceItem } from "../../../lib/types";
import { invoices as demoInvoices } from "../../../lib/demo-data";

type InvoiceApi = {
  id: string;
  period: string;
  amountNPR: number;
  status: "Paid" | "Due" | "Overdue";
  issuedAt: string;
  dueAt: string;
};

function mapInvoice(inv: InvoiceApi): InvoiceItem {
  return {
    id: inv.id,
    period: inv.period,
    amountNPR: inv.amountNPR,
    status: inv.status,
    issuedISO: inv.issuedAt,
  };
}

export default function PaymentsClient() {
  const { accountType } = useRole();
  const isAdmin = accountType === "admin_driver";
  const isDemoMode = !baseUrl;

  const invoicesPath = isAdmin ? "/api/v1/invoices/all" : "/api/v1/invoices";

  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [payingId, setPayingId] = useState<string | null>(null);

  // Admin-only amount editing
  const [draftAmounts, setDraftAmounts] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadInvoices = async () => {
      try {
        const response = await apiGet<InvoiceApi[]>(invoicesPath);
        const mapped = (response.data ?? []).map(mapInvoice);

        if (cancelled) return;
        setInvoices(mapped);

        // Keep draft amounts aligned with server amounts
        setDraftAmounts((prev) => {
          const next = { ...prev };
          for (const inv of mapped) next[inv.id] = inv.amountNPR;
          return next;
        });
      } catch (error) {
        console.error(error);
        if (cancelled) return;

        if (isDemoMode) {
          setInvoices(demoInvoices);
          setDraftAmounts(
            Object.fromEntries(demoInvoices.map((inv) => [inv.id, inv.amountNPR]))
          );
        } else {
          setInvoices([]);
          setDraftAmounts({});
        }
      }
    };

    void loadInvoices();

    return () => {
      cancelled = true;
    };
  }, [invoicesPath, isDemoMode]);

  const due = useMemo(() => invoices.find((i) => i.status !== "Paid"), [invoices]);
  const dueDraftAmount =
    due && Number.isFinite(draftAmounts[due.id]) ? draftAmounts[due.id] : due?.amountNPR;

  const markInvoicePaidOptimistic = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: "Paid" } : inv))
    );
  };

  const handlePay = async (invoiceId: string, amountNPR: number) => {
    if (payingId) return;

    setPayingId(invoiceId);
    try {
      const response = await apiPost<InvoiceApi>(
        `/api/v1/invoices/${invoiceId}/pay`,
        { amountNPR }
      );

      if (response.data) {
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === invoiceId ? { ...inv, status: response.data!.status } : inv
          )
        );
      } else if (isDemoMode) {
        markInvoicePaidOptimistic(invoiceId);
      }
    } catch (error) {
      console.error(error);
      if (isDemoMode) markInvoicePaidOptimistic(invoiceId);
    } finally {
      setPayingId(null);
    }
  };

  const handleAmountChange = (invoiceId: string, nextValue: string) => {
    // allow empty while typing; keep last known good number in state
    const parsed = Number(nextValue);
    setDraftAmounts((prev) => ({
      ...prev,
      [invoiceId]: Number.isFinite(parsed) ? parsed : prev[invoiceId],
    }));
  };

  const handleSaveAmount = async (invoiceId: string) => {
    if (!isAdmin) return;
    const nextAmount = draftAmounts[invoiceId];

    if (!Number.isFinite(nextAmount) || nextAmount <= 0) return;
    if (savingId) return;

    setSavingId(invoiceId);
    try {
      const response = await apiPatch<InvoiceApi>(
        `/api/v1/invoices/${invoiceId}/amount`,
        { amountNPR: nextAmount }
      );

      if (response.data) {
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === invoiceId ? { ...inv, amountNPR: response.data!.amountNPR } : inv
          )
        );
        setDraftAmounts((prev) => ({ ...prev, [invoiceId]: response.data!.amountNPR }));
      } else if (isDemoMode) {
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === invoiceId ? { ...inv, amountNPR: nextAmount } : inv))
        );
      }
    } catch (error) {
      console.error(error);
      if (isDemoMode) {
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === invoiceId ? { ...inv, amountNPR: nextAmount } : inv))
        );
      }
    } finally {
      setSavingId(null);
    }
  };

  const paidCount = useMemo(
    () => invoices.filter((i) => i.status === "Paid").length,
    [invoices]
  );

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
                const amount = isAdmin ? dueDraftAmount ?? due.amountNPR : due.amountNPR;
                void handlePay(due.id, amount);
              }}
            >
              {payingId && due?.id === payingId ? "Paying..." : "Pay now"}
            </Button>
          }
        />
        <CardBody>
          {isAdmin ? (
            <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Admin mode: you’re viewing all resident invoices and can mark payments on their behalf.
            </div>
          ) : null}

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
                  <div className="mt-1 text-2xl font-extrabold">
                    {due
                      ? `NPR ${isAdmin ? dueDraftAmount ?? due.amountNPR : due.amountNPR}`
                      : "NPR 0"}
                  </div>
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
                  <div className="mt-1 text-2xl font-extrabold">{paidCount}</div>
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
                {invoices.map((inv) => {
                  const isEditableAmount = isAdmin && inv.status !== "Paid";
                  const draftValue = draftAmounts[inv.id] ?? inv.amountNPR;
                  const payAmount = isAdmin ? draftValue : inv.amountNPR;

                  return (
                    <tr key={inv.id} className="border-t border-slate-200 bg-white">
                      <td className="px-4 py-3 font-semibold">{inv.period}</td>

                      <td className="px-4 py-3">
                        {isEditableAmount ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs font-semibold text-slate-500">NPR</span>
                            <input
                              className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-sm"
                              type="number"
                              min={1}
                              value={draftValue}
                              onChange={(event) => handleAmountChange(inv.id, event.target.value)}
                            />
                            <Button
                              variant="secondary"
                              disabled={savingId === inv.id}
                              onClick={() => void handleSaveAmount(inv.id)}
                            >
                              {savingId === inv.id ? "Saving..." : "Update"}
                            </Button>
                          </div>
                        ) : (
                          <>NPR {inv.amountNPR}</>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          tone={
                            inv.status === "Paid"
                              ? "emerald"
                              : inv.status === "Overdue"
                              ? "red"
                              : "amber"
                          }
                        >
                          {inv.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-right">
                        {inv.status === "Paid" ? (
                          <Button variant="secondary" disabled>
                            Receipt
                          </Button>
                        ) : (
                          <Button
                            disabled={payingId === inv.id}
                            onClick={() => void handlePay(inv.id, payAmount)}
                          >
                            {payingId === inv.id ? "Paying..." : "Pay"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
