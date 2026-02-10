"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  CreditCard,
  FileText,
  Bell,
  MessageSquare,
  Shield,
  Settings,
  LogOut,
  Leaf,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { cn } from "./ui";
import { useRole } from "./useRole";
import { useAuth } from "@/app/lib/auth-context";

const baseNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/messages", label: "Messages", icon: MessageSquare },
];

const adminNav = [
  { href: "/admin", label: "Admin Panel", icon: Shield },
  { href: "/admin/users", label: "User Management", icon: Shield },
];

const footerNav = [{ href: "/settings", label: "Settings", icon: Settings }];

const SIDEBAR_COLLAPSED_KEY = "ka_sidebar_collapsed";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useRole();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored === "true") {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "true" : "false");
  }, [collapsed]);

  return (
    <aside
      className={cn(
        "motion-panel sticky top-0 h-screen border-r border-slate-200 bg-white px-3 py-5 transition-all duration-200 dark:border-slate-800 dark:bg-slate-950",
        collapsed ? "w-[88px]" : "w-[270px]",
      )}
    >
      <div className="flex items-center gap-2 px-2">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
          <Leaf size={18} />
        </span>
        <div className={cn("leading-tight", collapsed ? "hidden" : "block")}>
          <div className="font-semibold">KacharaAlert</div>
          <div className="text-xs text-slate-500">Smart Waste Management</div>
        </div>
        <button
          type="button"
          className={cn(
            "motion-button ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800",
            collapsed ? "ml-0" : "ml-auto",
          )}
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <div
        className={cn(
          "motion-card mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/30",
          collapsed ? "hidden" : "block",
        )}
      >
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Mode</div>
        <div className="mt-0.5 text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
          {role === "admin" ? "Admin / Driver" : "Resident"}
        </div>
      </div>

      <nav className="mt-5 space-y-1">
        {baseNav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "motion-nav-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                collapsed ? "justify-center" : "justify-start",
                active
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
              )}
            >
              <Icon size={18} />
              <span className={cn(collapsed ? "sr-only" : "block")}>{item.label}</span>
            </Link>
          );
        })}
        {role === "admin" ? (
          <div className="mt-4 space-y-1">
            <div
              className={cn(
                "px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400",
                collapsed ? "sr-only" : "block",
              )}
            >
              Admin Control
            </div>
            {adminNav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "motion-nav-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                    collapsed ? "justify-center" : "justify-start",
                    active
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                  )}
                >
                  <Icon size={18} />
                  <span className={cn(collapsed ? "sr-only" : "block")}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ) : null}
        {footerNav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "motion-nav-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                collapsed ? "justify-center" : "justify-start",
                active
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
              )}
            >
              <Icon size={18} />
              <span className={cn(collapsed ? "sr-only" : "block")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
        <button
          className={cn(
            "motion-button flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40",
            collapsed ? "justify-center" : "justify-start",
          )}
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
        >
          <LogOut size={18} />
          <span className={cn(collapsed ? "sr-only" : "block")}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
