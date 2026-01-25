"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CreditCard, Receipt } from "lucide-react";
import { useRole } from "./useRole";
import { apiGet, apiPatch, apiPost, baseUrl } from "@/app/lib/api";

type InvoiceItem = {
  id: string;
  period: string;
  amountNPR: number;
  status: "Paid" | "Due" | "Overdue";
  issuedISO: string;
};

type InvoiceApi = {
  id: string;
  period: string;
  amountNPR: number;
  status: "Paid" | "Due" | "Overdue";
  issuedAt: string;
  dueAt: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

// Demo data
const demoInvoices: InvoiceItem[] = [
  {
    id: "inv-001",
    period: "January 2026",
    amountNPR: 5000,
    status: "Due",
    issuedISO: "2026-01-01",
  },
  {
    id: "inv-002",
    period: "December 2025",
    amountNPR: 5000,
    status: "Paid",
    issuedISO: "2025-12-01",
  },
  {
    id: "inv-003",
    period: "November 2025",
    amountNPR: 5000,
    status: "Paid",
    issuedISO: "2025-11-01",
  },
];

function mapInvoice(inv: InvoiceApi): InvoiceItem {
  return {
    id: inv.id,
    period: inv.period,
    amountNPR: inv.amountNPR,
    status: inv.status,
    issuedISO: inv.issuedAt,
  };
}

function unwrapList<T>(resp: any): T[] {
  const payload = resp?.data;
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

function unwrapItem<T>(resp: any): T | null {
  const payload = resp?.data;
  if (!payload) return null;
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data ?? null;
  }
  return payload as T;
}

function parsePositiveAmount(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export default function PaymentsClient() {
  const { role, actualRole } = useRole();
  const isAdmin = actualRole === "admin";
  const isViewingAsAdmin = role === "admin";
  const isDemoMode = !baseUrl;

  const invoicesPath = isViewingAsAdmin ? "/api/v1/invoices/all" : "/api/v1/invoices";

  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [draftAmounts, setDraftAmounts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadInvoices = async () => {
      try {
        const response = await apiGet(invoicesPath);
        const list = unwrapList<InvoiceApi>(response);
        const mapped = list.map(mapInvoice);

        if (cancelled) return;

        setInvoices(mapped);

        setDraftAmounts((prev) => {
          const next: Record<string, string> = { ...prev };
          for (const inv of mapped) next[inv.id] = String(inv.amountNPR);
          return next;
        });
      } catch (error) {
        console.error(error);
        if (cancelled) return;

        if (isDemoMode) {
          setInvoices(demoInvoices);
          setDraftAmounts(
            Object.fromEntries(demoInvoices.map((inv) => [inv.id, String(inv.amountNPR)]))
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

  const paidCount = useMemo(
    () => invoices.filter((i) => i.status === "Paid").length,
    [invoices]
  );

  const dueDraftAmount = due
    ? parsePositiveAmount(draftAmounts[due.id] ?? String(due.amountNPR))
    : null;

  const markInvoicePaidOptimistic = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: "Paid" } : inv))
    );
  };

  const handlePay = async (invoiceId: string) => {
    if (payingId) return;

    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    const draft = draftAmounts[invoiceId] ?? String(inv.amountNPR);
    const amountToPay = isAdmin ? parsePositiveAmount(draft) : inv.amountNPR;

    if (!amountToPay) return;

    setPayingId(invoiceId);
    try {
      const response = await apiPost(`/api/v1/invoices/${invoiceId}/pay`, {
        amountNPR: amountToPay,
      });

      const updated = unwrapItem<InvoiceApi>(response);

      if (updated) {
        setInvoices((prev) =>
          prev.map((row) => (row.id === invoiceId ? { ...row, status: updated.status } : row))
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
    setDraftAmounts((prev) => ({ ...prev, [invoiceId]: nextValue }));
  };

  const handleSaveAmount = async (invoiceId: string) => {
    if (!isAdmin) return;

    if (savingId) return;

    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    const draft = draftAmounts[invoiceId] ?? String(inv.amountNPR);
    const nextAmount = parsePositiveAmount(draft);

    if (!nextAmount) return;
    if (nextAmount === inv.amountNPR) return;

    setSavingId(invoiceId);
    try {
      const response = await apiPatch(`/api/v1/invoices/${invoiceId}/amount`, {
        amountNPR: nextAmount,
      });

      const updated = unwrapItem<InvoiceApi>(response);

      if (updated) {
        setInvoices((prev) =>
          prev.map((row) =>
            row.id === invoiceId ? { ...row, amountNPR: updated.amountNPR } : row
          )
        );
        setDraftAmounts((prev) => ({ ...prev, [invoiceId]: String(updated.amountNPR) }));
      } else if (isDemoMode) {
        setInvoices((prev) =>
          prev.map((row) => (row.id === invoiceId ? { ...row, amountNPR: nextAmount } : row))
        );
        setDraftAmounts((prev) => ({ ...prev, [invoiceId]: String(nextAmount) }));
      }
    } catch (error) {
      console.error(error);
      if (isDemoMode) {
        setInvoices((prev) =>
          prev.map((row) => (row.id === invoiceId ? { ...row, amountNPR: nextAmount } : row))
        );
        setDraftAmounts((prev) => ({ ...prev, [invoiceId]: String(nextAmount) }));
      }
    } finally {
      setSavingId(null);
    }
  };

  const payNowDisabled = !due || payingId !== null;

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-100 text-emerald-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Payments</h2>
              <p className="text-sm text-slate-600">View your monthly fees and invoices</p>
            </div>
            <button
              type="button"
              disabled={payNowDisabled}
              onClick={(e: any) => {
                e?.preventDefault?.();
                if (!due) return;
                void handlePay(due.id);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              <CreditCard size={18} />
              {payingId && due?.id === payingId ? "Paying..." : "Pay now"}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {isAdmin ? (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {isViewingAsAdmin
                ? "Admin mode: you're viewing all resident invoices and can update amounts or mark payments."
                : "Admin access: you can update invoice amounts even while viewing a resident account."}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500">Current status</div>
                  <div className="mt-1 text-2xl font-extrabold text-slate-900">
                    {due ? "Due" : "Paid"}
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {due ? `Pay ${due.period} invoice to avoid late fees.` : "Thanks! You're all set."}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500">Amount due</div>
                  <div className="mt-1 text-2xl font-extrabold text-slate-900">
                    {due ? `NPR ${dueDraftAmount ?? due.amountNPR}` : "NPR 0"}
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
                  <div className="mt-1 text-2xl font-extrabold text-slate-900">{paidCount}</div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <Receipt size={18} />
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Download invoices & receipts (coming soon).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">Invoices</h3>
          <p className="text-sm text-slate-600">History</p>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-600">
                <tr>
                  <th className="px-6 py-3">Period</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((inv) => {
                  const isEditableAmount = isAdmin && inv.status !== "Paid";
                  const draftValue = draftAmounts[inv.id] ?? String(inv.amountNPR);
                  const parsedDraft = parsePositiveAmount(draftValue);

                  const canSave =
                    isEditableAmount &&
                    savingId !== inv.id &&
                    parsedDraft !== null &&
                    parsedDraft !== inv.amountNPR;

                  const payAmount = isAdmin ? parsedDraft : inv.amountNPR;
                  const canPay = inv.status !== "Paid" && payingId !== inv.id && !!payAmount;

                  return (
                    <tr key={inv.id} className="border-t border-slate-200 bg-white hover:bg-slate-50">
                      <td className="px-6 py-3 font-semibold text-slate-900">{inv.period}</td>

                      <td className="px-6 py-3">
                        {isEditableAmount ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs font-semibold text-slate-500">NPR</span>
                            <input
                              className="w-28 rounded-lg border border-slate-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              inputMode="numeric"
                              type="text"
                              value={draftValue}
                              onChange={(event) => handleAmountChange(inv.id, event.target.value)}
                            />
                            <button
                              type="button"
                              disabled={!canSave}
                              onClick={(e: any) => {
                                e?.preventDefault?.();
                                void handleSaveAmount(inv.id);
                              }}
                              className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                            >
                              {savingId === inv.id ? "Saving..." : "Update"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-900">NPR {inv.amountNPR}</span>
                        )}
                      </td>

                      <td className="px-6 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>

                      <td className="px-6 py-3 text-right">
                        {inv.status === "Paid" ? (
                          <button
                            type="button"
                            disabled
                            className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
                          >
                            Receipt
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={!canPay}
                            onClick={(e: any) => {
                              e?.preventDefault?.();
                              void handlePay(inv.id);
                            }}
                            className="px-3 py-1 text-xs font-semibold rounded-lg bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                          >
                            {payingId === inv.id ? "Paying..." : "Pay"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!isDemoMode && invoices.length === 0 ? (
            <div className="px-6 py-4 text-sm text-slate-600">
              No invoices found, or the server request failed. Check your API base URL and authentication.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
