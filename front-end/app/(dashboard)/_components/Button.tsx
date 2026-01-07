"use client";

import { cn } from "./ui";

type Variant = "primary" | "secondary" | "ghost" | "danger";

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  className?: string;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-emerald-500 text-white hover:bg-emerald-600",
        variant === "secondary" &&
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        variant === "ghost" && "text-slate-700 hover:bg-slate-100",
        variant === "danger" && "bg-red-500 text-white hover:bg-red-600",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
