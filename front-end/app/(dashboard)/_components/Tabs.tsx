"use client";

import { cn } from "./ui";
import { useLanguage } from "@/app/lib/language-context";

export type Tab = { key: string; label: string };

export default function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: Tab[];
  value: string;
  onChange: (key: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="motion-card inline-flex rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
      {tabs.map((tabItem) => {
        const active = tabItem.key === value;
        return (
          <button
            key={tabItem.key}
            type="button"
            onClick={() => onChange(tabItem.key)}
            className={cn(
              "motion-nav-item rounded-xl px-3 py-2 text-sm font-semibold transition",
              active ? "bg-emerald-500 text-white" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800",
            )}
          >
            {t(tabItem.label)}
          </button>
        );
      })}
    </div>
  );
}
