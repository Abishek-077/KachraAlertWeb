"use client";

import { cn } from "./ui";
import { useLanguage } from "@/app/lib/language-context";

type Variant = "primary" | "secondary" | "ghost" | "danger";

function translateChildren(children: React.ReactNode, t: (text: string) => string): React.ReactNode {
  if (typeof children === "string") return t(children);
  if (Array.isArray(children)) {
    return children.map((child) => (typeof child === "string" ? t(child) : child));
  }
  return children;
}

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  className?: string;
}) {
  const { t } = useLanguage();
  const { ["aria-label"]: ariaLabel, ...restProps } = props;

  return (
    <button
      className={cn(
        "motion-button inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-emerald-500 text-white hover:bg-emerald-600",
        variant === "secondary" &&
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
        variant === "ghost" && "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
        variant === "danger" && "bg-red-500 text-white hover:bg-red-600",
        className,
      )}
      aria-label={typeof ariaLabel === "string" ? t(ariaLabel) : ariaLabel}
      {...restProps}
    >
      {translateChildren(children, t)}
    </button>
  );
}
