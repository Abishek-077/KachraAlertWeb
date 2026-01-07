"use client";

import { cn } from "./ui";

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
  return (
    <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1">
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold transition",
              active ? "bg-emerald-500 text-white" : "text-slate-600 hover:bg-slate-50",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
