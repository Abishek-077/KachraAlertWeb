"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RefreshCw, Search, ShieldCheck, UserCheck, UserPlus, UserX, Users } from "lucide-react";

import Badge from "./Badge";
import Button from "./Button";
import DataTable from "./DataTable";
import Input from "./Input";
import Modal from "./Modal";
import StatCard from "./StatCard";
import Tabs from "./Tabs";
import { apiDelete, apiGet, type ApiError } from "@/app/lib/api";
import { useAuth } from "@/app/lib/auth-context";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "Resident" | "Admin/Driver";
  roleKey: "resident" | "admin_driver";
  status: "Active" | "Removed" | "Banned";
  statusKey: "active" | "removed" | "banned";
  society: string;
  building: string;
  apartment: string;
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

type RoleFilter = "all" | "resident" | "admin_driver";
type StatusFilter = "all" | "active" | "removed" | "banned";

export default function AdminUsersClient() {
  const { accessToken, loading: authLoading } = useAuth();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadUsers = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (!accessToken) return;
      if (mode === "refresh") {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setErrorMessage(null);
      try {
        const response = await apiGet<AdminUserApi[]>("/api/v1/admin/users");
        const mapped =
          response.data?.map((user) => {
            const role: AdminUser["role"] =
              user.accountType === "admin_driver" ? "Admin/Driver" : "Resident";
            const status: AdminUser["status"] = user.isBanned ? "Banned" : "Active";
            const statusKey: AdminUser["statusKey"] = user.isBanned ? "banned" : "active";
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role,
              roleKey: user.accountType,
              status,
              statusKey,
              society: user.society,
              building: user.building,
              apartment: user.apartment
            };
          }) ?? [];
        setUsers(mapped);
        setLastUpdated(new Date());
      } catch (error) {
        const apiError = error as ApiError | undefined;
        setErrorMessage(apiError?.message ?? "Unable to load users.");
      } finally {
        if (mode === "refresh") {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [accessToken],
  );

  useEffect(() => {
    if (authLoading) return;
    if (!accessToken) {
      setUsers([]);
      setLastUpdated(null);
      setLoading(false);
      return;
    }

    loadUsers("initial");
  }, [accessToken, authLoading, loadUsers]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((user) => user.statusKey === "active").length;
    const banned = users.filter((user) => user.statusKey === "banned").length;
    const removed = users.filter((user) => user.statusKey === "removed").length;
    const adminDrivers = users.filter((user) => user.roleKey === "admin_driver").length;
    const residents = users.filter((user) => user.roleKey === "resident").length;
    return { total, active, banned, removed, adminDrivers, residents };
  }, [users]);

  const statusTabs = useMemo(
    () => [
      { key: "all", label: `All (${stats.total})` },
      { key: "active", label: `Active (${stats.active})` },
      { key: "banned", label: `Banned (${stats.banned})` },
      { key: "removed", label: `Removed (${stats.removed})` },
    ],
    [stats],
  );

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let next = users;
    if (roleFilter !== "all") {
      next = next.filter((user) => user.roleKey === roleFilter);
    }
    if (statusFilter !== "all") {
      next = next.filter((user) => user.statusKey === statusFilter);
    }
    if (!normalizedQuery) return next;

    return next.filter((user) =>
      [user.id, user.name, user.email, user.role, user.society, user.building, user.apartment].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [query, roleFilter, statusFilter, users]);

  const handleRemove = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Removed", statusKey: "removed" } : u)),
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiDelete(`/api/v1/admin/users/${deleteTarget.id}`);
      setUsers((prev) => prev.filter((user) => user.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      const apiError = error as ApiError | undefined;
      setErrorMessage(apiError?.message ?? "Unable to delete user.");
    }
  };

  const columns = [
    { key: "id", label: "ID", className: "w-[140px] text-slate-500" },
    { key: "name", label: "Name", className: "w-[180px]" },
    { key: "email", label: "Email", className: "w-[220px] text-slate-500" },
    { key: "role", label: "Role", className: "w-[140px]" },
    { key: "society", label: "Society", className: "w-[140px]" },
    { key: "building", label: "Building", className: "w-[120px]" },
    { key: "apartment", label: "Apartment", className: "w-[120px]" },
    { key: "status", label: "Status", className: "w-[120px]" },
    { key: "actions", label: "Actions", className: "w-[240px]" },
  ];

  const actionBase =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20";

  const rows = filteredUsers.map((user) => ({
    id: (
      <div className="max-w-[120px] truncate font-mono text-xs text-slate-500" title={user.id}>
        {user.id}
      </div>
    ),
    name: (
      <div>
        <div className="font-semibold text-slate-900">{user.name}</div>
        <div className="mt-1 text-xs text-slate-400">{user.society}</div>
      </div>
    ),
    email: (
      <div className="max-w-[220px] truncate text-sm text-slate-500" title={user.email}>
        {user.email}
      </div>
    ),
    role: <Badge tone={user.roleKey === "admin_driver" ? "blue" : "slate"}>{user.role}</Badge>,
    society: <div className="text-sm text-slate-600">{user.society}</div>,
    building: <div className="text-sm text-slate-600">{user.building}</div>,
    apartment: <div className="text-sm text-slate-600">{user.apartment}</div>,
    status: (
      <Badge tone={user.status === "Active" ? "emerald" : user.status === "Banned" ? "red" : "slate"}>
        {user.status}
      </Badge>
    ),
    actions: (
      <div className="flex flex-wrap items-center gap-2">
        <Link
          className={`${actionBase} border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
          href={`/admin/users/${user.id}`}
        >
          View
        </Link>
        <Link
          className={`${actionBase} border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
          href={`/admin/users/${user.id}/edit`}
        >
          Edit
        </Link>
        <button
          className={`${actionBase} border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60`}
          onClick={() => handleRemove(user.id)}
          disabled={user.status === "Removed"}
          type="button"
        >
          Remove
        </button>
        <button
          className={`${actionBase} border-red-200 bg-red-50 text-red-600 hover:bg-red-100`}
          onClick={() => setDeleteTarget(user)}
          type="button"
        >
          Delete
        </button>
      </div>
    ),
  }));

  const lastUpdatedLabel = lastUpdated ? lastUpdated.toLocaleString() : "Not synced yet";

  return (
    <div className="space-y-6 motion-reveal-target">
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/70 to-slate-50 p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-16 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Admin Control
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">User management</h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage residents and admin drivers from one place with live data from the backend.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 font-semibold text-emerald-700">
                Live data
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1">
                Last sync: {lastUpdatedLabel}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => loadUsers("refresh")}
              disabled={refreshing || loading || !accessToken}
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing" : "Refresh"}
            </Button>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
              href="/admin/users/create"
            >
              <UserPlus size={16} /> Add user
            </Link>
          </div>
        </div>

        <div className="relative mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total users" value={`${stats.total}`} icon={<Users size={18} />} hint="All accounts" />
          <StatCard title="Active users" value={`${stats.active}`} icon={<UserCheck size={18} />} hint="Ready to collect" />
          <StatCard
            title="Admin / Drivers"
            value={`${stats.adminDrivers}`}
            icon={<ShieldCheck size={18} />}
            hint="Operations team"
          />
          <StatCard title="Banned users" value={`${stats.banned}`} icon={<UserX size={18} />} hint="Restricted access" />
        </div>
      </section>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search users by name, email, society, or ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</div>
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/20"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}
            >
              <option value="all">All roles ({stats.total})</option>
              <option value="resident">Residents ({stats.residents})</option>
              <option value="admin_driver">Admin / Drivers ({stats.adminDrivers})</option>
            </select>
          </div>
          <div className="ml-auto text-xs font-semibold uppercase tracking-wide text-slate-400">
            {filteredUsers.length} of {users.length} users
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</div>
            <Tabs tabs={statusTabs} value={statusFilter} onChange={(key) => setStatusFilter(key as StatusFilter)} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
          Loading users...
        </div>
      ) : errorMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
          {errorMessage}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-6 text-sm text-slate-500">
          No users match the current filters.
        </div>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete user"
        description="This action permanently deletes the user and all related records."
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
            {deleteTarget ? `You are about to delete ${deleteTarget.name} (${deleteTarget.email}).` : "Select a user to delete."}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Confirm delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
