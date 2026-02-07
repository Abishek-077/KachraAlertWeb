"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

import Badge from "@/app/(dashboard)/_components/Badge";
import Button from "@/app/(dashboard)/_components/Button";
import Card, { CardBody, CardHeader } from "@/app/(dashboard)/_components/Card";
import { apiGet, apiPatch, type ApiError } from "@/app/lib/api";
import { useAuth } from "@/app/lib/auth-context";

type AdminUserDetailPageProps = {
  params: Promise<{ id: string }>;
};

type AdminUserApi = {
  id: string;
  accountType: "resident" | "admin_driver";
  name: string;
  email: string;
  phone: string;
  society: string;
  building: string;
  apartment: string;
  isBanned?: boolean;
  lateFeePercent?: number;
};

export default function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  const { id: userId } = use(params);
  const { accessToken, loading: authLoading } = useAuth();
  const [user, setUser] = useState<AdminUserApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [lateFeeDraft, setLateFeeDraft] = useState<string>("");

  useEffect(() => {
    if (authLoading) return;
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const response = await apiGet<AdminUserApi>(`/api/v1/admin/users/${userId}`);
        const payload = response.data ?? null;
        setUser(payload);
        if (payload) {
          setLateFeeDraft(String(payload.lateFeePercent ?? 0));
        }
      } catch (error) {
        const apiError = error as ApiError | undefined;
        setErrorMessage(apiError?.message ?? "Unable to load user details.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [accessToken, authLoading, userId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">User Details</h1>
          <p className="text-sm text-slate-500">
            Viewing user: <span className="font-semibold text-slate-800">{userId}</span>
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          href={userId ? `/admin/users/${userId}/edit` : "/admin/users"}
        >
          Edit user
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
          Loading user details...
        </div>
      ) : errorMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
          {errorMessage}
        </div>
      ) : user ? (
        <>
          <Card>
            <CardHeader
              title="Profile overview"
              subtitle="Quick snapshot of account health and access."
              right={
                <Badge tone={user.isBanned ? "red" : "emerald"}>
                  {user.isBanned ? "Banned" : "Active"}
                </Badge>
              }
            />
            <CardBody>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Full name</div>
                  <div className="mt-1 text-base font-semibold text-slate-900">{user.name}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</div>
                  <div className="mt-1 text-base font-semibold text-slate-900">
                    {user.accountType === "admin_driver" ? "Admin / Driver" : "Resident"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</div>
                  <div className="mt-1 text-base font-semibold text-slate-700">{user.email}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</div>
                  <div className="mt-1 text-base font-semibold text-slate-700">{user.phone}</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Service address" subtitle="Primary pickup location for this user." />
            <CardBody>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Society</div>
                  <div className="mt-1 text-base font-semibold text-slate-700">{user.society}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Building</div>
                  <div className="mt-1 text-base font-semibold text-slate-700">{user.building}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Apartment</div>
                  <div className="mt-1 text-base font-semibold text-slate-700">{user.apartment}</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Account actions" subtitle="Manage access, removal, and notifications." />
            <CardBody>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Access</div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={user.isBanned ? "secondary" : "danger"}
                      onClick={async () => {
                        if (savingStatus) return;
                        setSavingStatus(true);
                        try {
                          const response = await apiPatch<AdminUserApi>(
                            `/api/v1/admin/users/${userId}/status`,
                            { isBanned: !user.isBanned }
                          );
                          if (response.data) {
                            setUser(response.data);
                          }
                        } catch (error) {
                          const apiError = error as ApiError | undefined;
                          setErrorMessage(apiError?.message ?? "Unable to update user status.");
                        } finally {
                          setSavingStatus(false);
                        }
                      }}
                    >
                      {savingStatus
                        ? "Updating..."
                        : user.isBanned
                          ? "Unban user"
                          : "Ban user"}
                    </Button>
                    <Button variant="secondary">Reset password</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Late fee</div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                      <span className="text-xs font-semibold text-slate-500">%</span>
                      <input
                        className="w-20 text-sm outline-none"
                        inputMode="numeric"
                        value={lateFeeDraft}
                        onChange={(event) => setLateFeeDraft(event.target.value)}
                      />
                    </div>
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        if (savingStatus) return;
                        const nextPercent = Number(lateFeeDraft);
                        if (!Number.isFinite(nextPercent) || nextPercent < 0 || nextPercent > 100) {
                          setErrorMessage("Late fee must be between 0 and 100.");
                          return;
                        }
                        setSavingStatus(true);
                        try {
                          const response = await apiPatch<AdminUserApi>(
                            `/api/v1/admin/users/${userId}/status`,
                            { lateFeePercent: nextPercent }
                          );
                          if (response.data) {
                            setUser(response.data);
                          }
                        } catch (error) {
                          const apiError = error as ApiError | undefined;
                          setErrorMessage(apiError?.message ?? "Unable to update late fee.");
                        } finally {
                          setSavingStatus(false);
                        }
                      }}
                    >
                      {savingStatus ? "Saving..." : "Save fee"}
                    </Button>
                  </div>
                  <div className="text-xs text-slate-500">
                    This percentage is applied when you add late fees to overdue invoices.
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      ) : null}
    </div>
  );
}
