"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  CreditCard,
  FileText,
  Bell,
  Shield,
  Settings,
  LogOut,
  Leaf,
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
];

const adminNav = [{ href: "/admin", label: "Admin Panel", icon: Shield }];

const footerNav = [{ href: "/settings", label: "Settings", icon: Settings }];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useRole();
  const { logout } = useAuth();

  const nav = role === "admin" ? [...baseNav, ...adminNav, ...footerNav] : [...baseNav, ...footerNav];

  return (
    <aside className="sticky top-0 h-screen w-[270px] border-r border-slate-200 bg-white px-4 py-5">
      <div className="flex items-center gap-2 px-2">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
          <Leaf size={18} />
        </span>
        <div className="leading-tight">
          <div className="font-semibold">KacharaAlert</div>
          <div className="text-xs text-slate-500">Smart Waste Management</div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
        <div className="text-xs font-semibold text-slate-500">Current Mode</div>
        <div className="mt-0.5 text-sm font-extrabold text-emerald-700">
          {role === "admin" ? "Admin / Driver" : "Resident"}
        </div>
      </div>

      <nav className="mt-5 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-slate-200 pt-4">
        <button
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
