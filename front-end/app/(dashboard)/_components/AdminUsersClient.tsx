"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Badge from "./Badge";
import Button from "./Button";
import DataTable from "./DataTable";
import Input from "./Input";
import Modal from "./Modal";
import { apiDelete, apiGet, type ApiError } from "@/app/lib/api";
import { useAuth } from "@/app/lib/auth-context";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "Resident" | "Admin/Driver";
  status: "Active" | "Removed";
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
};

export default function AdminUsersClient() {
  const { accessToken, loading: authLoading } = useAuth();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!accessToken) {
      setUsers([]);
      setLoading(false);
      return;
    }

    const loadUsers = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const response = await apiGet<AdminUserApi[]>("/api/v1/admin/users");
        const mapped =
          response.data?.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.accountType === "admin_driver" ? "Admin/Driver" : "Resident",
            status: "Active" as const,
            society: user.society,
            building: user.building,
            apartment: user.apartment,
          })) ?? [];
        setUsers(mapped);
      } catch (error) {
        const apiError = error as ApiError | undefined;
        setErrorMessage(apiError?.message ?? "Unable to load users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [accessToken, authLoading]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return users;

    return users.filter((user) =>
      [
        user.id,
        user.name,
        user.email,
        user.role,
        user.society,
        user.building,
        user.apartment,
      ].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [query, users]);

  const handleRemove = (id: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, status: "Removed" } : user)),
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
    { key: "actions", label: "Actions", className: "w-[160px]" },
  ];

  const rows = filteredUsers.map((user) => ({
    id: (
      <div
        className="max-w-[120px] truncate font-mono text-xs text-slate-500"
        title={user.id}
      >
        {user.id}
      </div>
    ),
    name: <div className="font-semibold text-slate-900">{user.name}</div>,
    email: (
      <div
        className="max-w-[200px] truncate text-sm text-slate-500"
        title={user.email}
      >
        {user.email}
      </div>
    ),
    role: <div className="text-sm font-medium text-slate-700">{user.role}</div>,
    society: <div className="text-sm text-slate-600">{user.society}</div>,
    building: <div className="text-sm text-slate-600">{user.building}</div>,
    apartment: <div className="text-sm text-slate-600">{user.apartment}</div>,
    status: (
      <Badge tone={user.status === "Active" ? "emerald" : "slate"}>{user.status}</Badge>
    ),
    actions: (
      <div className="flex flex-col items-start gap-2 text-sm">
        <Link
          className="font-semibold text-emerald-600 hover:underline"
          href={`/admin/users/${user.id}`}
        >
          View
        </Link>
        <Link
          className="font-semibold text-emerald-600 hover:underline"
          href={`/admin/users/${user.id}/edit`}
        >
          Edit
        </Link>
        <button
          className="font-semibold text-slate-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => handleRemove(user.id)}
          disabled={user.status === "Removed"}
          type="button"
        >
          Remove
        </button>
        <button
          className="font-semibold text-red-600 hover:underline"
          onClick={() => setDeleteTarget(user)}
          type="button"
        >
          Delete
        </button>
      </div>
    ),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500">Manage residents and admin drivers from one place.</p>
        </div>
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
          href="/admin/users/create"
        >
          Add user
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
        <div className="min-w-[220px] flex-1">
          <Input
            placeholder="Search users by name, email, or ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {filteredUsers.length} users
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
            {deleteTarget
              ? `You are about to delete ${deleteTarget.name} (${deleteTarget.email}).`
              : "Select a user to delete."}
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
