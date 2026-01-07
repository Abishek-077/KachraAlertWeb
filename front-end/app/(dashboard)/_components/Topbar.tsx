"use client";

import { Bell, Search, User, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "./Button";
import Input from "./Input";
import { useRole } from "./useRole";

export default function Topbar() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const roleLabel = useMemo(() => (role === "admin" ? "Admin/Driver" : "Resident"), [role]);

  return (
    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3">
        <div className="hidden flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input className="pl-9" placeholder="Search reports, payments, schedules..." />
          </div>
        </div>

        <div className="relative">
          <Button
            variant="secondary"
            onClick={() => setOpen((v) => !v)}
            className="gap-2"
            type="button"
          >
            {roleLabel}
            <ChevronDown size={16} />
          </Button>

          {open ? (
            <div
              className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
              onMouseLeave={() => setOpen(false)}
            >
              <button
                className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setRole("resident");
                  setOpen(false);
                }}
              >
                Resident Mode
              </button>
              <button
                className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setRole("admin");
                  setOpen(false);
                }}
              >
                Admin / Driver Mode
              </button>
              <div className="px-3 pb-2 pt-2 text-xs text-slate-500">
                Demo switch (role-based sidebar)
              </div>
            </div>
          ) : null}
        </div>

        <button
          className="relative rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50"
          aria-label="Notifications"
          onClick={() => router.push("/alerts")}
        >
          <Bell size={18} />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
        </button>
        <button
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50"
          aria-label="Profile"
          onClick={() => router.push("/settings")}
        >
          <User size={18} />
        </button>
      </div>
    </div>
  );
}
