"use client";

import { Bell, Search, User, ChevronDown, MessageSquare, Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import Button from "./Button";
import Input from "./Input";
import { useRole } from "./useRole";
import { useAuth } from "@/app/lib/auth-context";

export default function Topbar() {
  const { role, actualRole, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [switchingAccount, setSwitchingAccount] = useState<"resident" | "admin_driver" | null>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  const roleLabel = useMemo(() => (role === "admin" ? "Admin/Driver" : "Resident"), [role]);
  const isDark = theme === "dark";

  useEffect(() => setMounted(true), []);

  const handleAccountSwitch = async (targetRole: "resident" | "admin_driver") => {
    setSwitchingAccount(targetRole);
    setOpen(false);
    router.push("/login");
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="motion-swipe-track sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
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
              className="motion-card absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900"
              onMouseLeave={() => setOpen(false)}
            >
              {actualRole === "admin" ? (
                <>
                  <button
                    className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => {
                      setRole("resident");
                      setOpen(false);
                    }}
                  >
                    Resident Mode
                  </button>
                  <button
                    className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => {
                      setRole("admin");
                      setOpen(false);
                    }}
                  >
                    Admin / Driver Mode
                  </button>
                  <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
                </>
              ) : null}

              <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Switch account
              </div>
              <button
                className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-200 dark:hover:bg-slate-800"
                disabled={Boolean(switchingAccount)}
                onClick={() => {
                  void handleAccountSwitch("resident");
                }}
              >
                {switchingAccount === "resident" ? "Opening login..." : "Login as Resident"}
              </button>
              <button
                className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-200 dark:hover:bg-slate-800"
                disabled={Boolean(switchingAccount)}
                onClick={() => {
                  void handleAccountSwitch("admin_driver");
                }}
              >
                {switchingAccount === "admin_driver" ? "Opening login..." : "Login as Admin / Driver"}
              </button>
              <div className="px-3 pb-1 pt-2 text-xs text-slate-500 dark:text-slate-400">
                You will be signed out first, then redirected to login.
              </div>
            </div>
          ) : null}
        </div>

        {mounted ? (
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="motion-button rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        ) : null}

        <button
          className="motion-button relative rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label="Messages"
          onClick={() => router.push("/messages")}
        >
          <MessageSquare size={18} />
        </button>
        <button
          className="motion-button relative rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label="Notifications"
          onClick={() => router.push("/alerts")}
        >
          <Bell size={18} />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
        </button>
        <button
          className="motion-button rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label="Profile"
          onClick={() => router.push("/settings")}
        >
          <User size={18} />
        </button>
      </div>
    </div>
  );
}
