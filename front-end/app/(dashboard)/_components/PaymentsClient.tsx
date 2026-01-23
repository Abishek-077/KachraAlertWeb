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

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
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

// Unwrap backend envelope safely (supports either: array directly OR {data: array})
function unwrapList<T>(resp: any): T[] {
  const maybe = resp?.data;
  if (Array.isArray(maybe)) return maybe;
  if (Array.isArray(maybe?.data)) return maybe.data;
  return [];
}

function unwrapItem<T>(resp: any): T | null {
  const maybe = resp?.data;
  if (!maybe) return null;
  // backend envelope
  if (maybe && typeof maybe === "object" && "data" in maybe) return (maybe as ApiEnvelope<T>).data ?? null;
  // direct
  return maybe as T;
}

// Parse a "draft" string safely into a positive number (or null if invalid)
function parsePositiveAmount(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export default function PaymentsClient() {
  const { actualRole } = useRole();

  // IMPORTANT: your backend admin role is "admin_driver"
  const isAdmin = actualRole === "admin" || actualRole === "admin_driver";

  // demo mode when baseUrl is missing/empty
  const isDemoMode = !baseUrl;

  // Correct admin endpoint
  const invoicesPath = isAdmin ? "/api/v1/invoices/all" : "/api/v1/invoices";

  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [payingId, setPayingId] = useState<string | null>(null);

  // IMPORTANT: keep drafts as strings so input stays editable
  const [draftAmounts, setDraftAmounts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadInvoices = async () => {
      try {
        const response = await apiGet<any>(invoicesPath);
        const list = unwrapList<InvoiceApi>(response);
        const mapped = list.map(mapInvoice);

        if (cancelled) return;

        setInvoices(mapped);

        // Initialize/refresh drafts from server values
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

  const due = useMemo(
    () => invoices.find((i) => i.status !== "Paid"),
    [invoices]
  );

  const paidCount = useMemo(
    () => invoices.filter((i) => i.status === "Paid").length,
    [invoices]
  );

  const markInvoicePaidOptimistic = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: "Paid" } : inv))
    );
  };

  const handlePay = async (invoiceId: string) => {
    if (payingId) return;

    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    // Admin can pay using the draft amount; residents pay the invoice amount.
    const draft = draftAmounts[invoiceId] ?? String(inv.amountNPR);
    const amountToPay = isAdmin ? parsePositiveAmount(draft) : inv.amountNPR;

    if (!amountToPay) return;

    setPayingId(invoiceId);
    try {
      const response = await apiPost<any>(`/api/v1/invoices/${invoiceId}/pay`, {
        amountNPR: amountToPay,
      });

      const updated = unwrapItem<InvoiceApi>(response);

      if (updated) {
        setInvoices((prev) =>
          prev.map((row) =>
            row.id === invoiceId ? { ...row, status: updated.status } : row
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
    setDraftAmounts((prev) => ({ ...prev, [invoiceId]: nextValue }));
  };

  const handleSaveAmount = async (invoiceId: string) => {
    if (savingId) return;

    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    const draft = draftAmounts[invoiceId] ?? String(inv.amountNPR);
    const nextAmount = parsePositiveAmount(draft);
    if (!nextAmount) return;

    if (nextAmount === inv.amountNPR) return;

    setSavingId(invoiceId);
    try {
      const response = await apiPatch<any>(`/api/v1/invoices/${invoiceId}/amount`, {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Payments"
          subtitle="View your monthly fees and invoices"
          right={
            <Button
              type="button"
              disabled={payNowDisabled}
              onClick={(e: any) => {
                e?.preventDefault?.();
                if (!due) return;
                void handlePay(due.id);
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
                    {due ? `NPR ${due.amountNPR}` : "NPR 0"}
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
                  const draftValue = draftAmounts[inv.id] ?? String(inv.amountNPR);
                  const parsedDraft = parsePositiveAmount(draftValue);

                  const canSave =
                    isEditableAmount &&
                    savingId !== inv.id &&
                    parsedDraft !== null &&
                    parsedDraft !== inv.amountNPR;

                  // Admin "Pay" uses draft amount; normal users use invoice amount.
                  const payAmount = isAdmin ? parsedDraft : inv.amountNPR;
                  const canPay = inv.status !== "Paid" && payingId !== inv.id && !!payAmount;

                  return (
                    <tr key={inv.id} className="border-t border-slate-200 bg-white">
                      <td className="px-4 py-3 font-semibold">{inv.period}</td>

                      <td className="px-4 py-3">
                        {isEditableAmount ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs font-semibold text-slate-500">NPR</span>
                            <input
                              className="w-28 rounded-lg border border-slate-200 px-2 py-1 text-sm"
                              inputMode="numeric"
                              type="text"
                              value={draftValue}
                              onChange={(event) => handleAmountChange(inv.id, event.target.value)}
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              disabled={!canSave}
                              onClick={(e: any) => {
                                e?.preventDefault?.();
                                void handleSaveAmount(inv.id);
                              }}
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
                            type="button"
                            disabled={!canPay}
                            onClick={(e: any) => {
                              e?.preventDefault?.();
                              void handlePay(inv.id);
                            }}
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

          {!isDemoMode && invoices.length === 0 ? (
            <div className="mt-4 text-sm text-slate-600">
              No invoices found, or the server request failed. Check your API base URL and authentication.
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
