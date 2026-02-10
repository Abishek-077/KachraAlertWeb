"use client";

import { cn } from "./ui";
import { useLanguage } from "@/app/lib/language-context";

export default function DataTable({
  columns,
  rows,
}: {
  columns: { key: string; label: string; className?: string }[];
  rows: Record<string, React.ReactNode>[];
}) {
  const { t } = useLanguage();

  return (
    <div
      data-motion-reveal="true"
      className="motion-card motion-table motion-swipe-track overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <table className="min-w-[960px] w-full text-left text-sm">
        <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={cn("px-5 py-3.5", c.className)}>
                {t(c.label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((r, idx) => (
            <tr key={idx} className="motion-nav-item hover:bg-slate-50/80 dark:hover:bg-slate-800/80">
              {columns.map((c) => (
                <td key={c.key} className={cn("px-5 py-4 align-top", c.className)}>
                  {r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
