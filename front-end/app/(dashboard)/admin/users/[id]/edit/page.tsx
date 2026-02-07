"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

import Button from "@/app/(dashboard)/_components/Button";
import Card, { CardBody, CardHeader } from "@/app/(dashboard)/_components/Card";
import Input from "@/app/(dashboard)/_components/Input";
import { apiGet, type ApiError } from "@/app/lib/api";
import { useAuth } from "@/app/lib/auth-context";

type AdminUserEditPageProps = {
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
};

export default function AdminUserEditPage({ params }: AdminUserEditPageProps) {
  const { id: userId } = use(params);
  const { accessToken, loading: authLoading } = useAuth();
  const [user, setUser] = useState<AdminUserApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setUser(response.data ?? null);
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
          <h1 className="text-2xl font-semibold text-slate-900">Edit User</h1>
          <p className="text-sm text-slate-500">
            Editing user: <span className="font-semibold text-slate-800">{userId}</span>
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          href={userId ? `/admin/users/${userId}` : "/admin/users"}
        >
          Back to profile
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
            <CardHeader title="User information" subtitle="Update personal details and access level." />
            <CardBody>
              <form className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-700">Full name</div>
                  <Input defaultValue={user.name} />
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-700">Email</div>
                  <Input defaultValue={user.email} type="email" />
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-700">Phone</div>
                  <Input defaultValue={user.phone} />
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-700">Role</div>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-emerald-500/20"
                    defaultValue={user.accountType}
                  >
                    <option value="resident">Resident</option>
                    <option value="admin_driver">Admin / Driver</option>
                  </select>
                </div>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Service address" subtitle="Keep pickup details up to date." />
            <CardBody>
              <form className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-700">Society</div>
                  <Input defaultValue={user.society} />
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-700">Building</div>
                  <Input defaultValue={user.building} />
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-700">Apartment</div>
                  <Input defaultValue={user.apartment} />
                </div>
              </form>
            </CardBody>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button>Save changes</Button>
            <Button variant="secondary">Send invite</Button>
            <Button variant="danger">Deactivate user</Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
