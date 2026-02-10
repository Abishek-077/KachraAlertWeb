"use client";

import { cn } from "./ui";
import { useLanguage } from "@/app/lib/language-context";

export default function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  const { t } = useLanguage();
  const { placeholder, ["aria-label"]: ariaLabel, ...restProps } = props;

  return (
    <input
      className={cn(
        "motion-input w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100",
        className,
      )}
      placeholder={typeof placeholder === "string" ? t(placeholder) : placeholder}
      aria-label={typeof ariaLabel === "string" ? t(ariaLabel) : ariaLabel}
      {...restProps}
    />
  );
}
