"use client";

import { cn } from "./ui";
import { useLanguage } from "@/app/lib/language-context";

export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-motion-reveal="true"
      className={cn(
        "motion-card motion-swipe-track rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
      <div>
        <div className="text-lg font-extrabold tracking-tight">{t(title)}</div>
        {subtitle ? <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t(subtitle)}</div> : null}
      </div>
      {right}
    </div>
  );
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-5">{children}</div>;
}
