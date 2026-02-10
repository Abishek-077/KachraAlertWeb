"use client";

import { cn } from "./ui";

export default function Modal({
  open,
  onClose,
  title,
  children,
  description,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" data-no-motion="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 animate-scale-in">
        <div
          className={cn(
            "motion-card rounded-2xl bg-white shadow-xl dark:bg-slate-900",
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <div>
              <div className="text-base font-extrabold">{title}</div>
              {description ? <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</div> : null}
            </div>
            <button
              className="motion-button rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={onClose}
              aria-label="Close"
            >
              x
            </button>
          </div>
          <div className="px-5 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
