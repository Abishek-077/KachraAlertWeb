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
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2">
        <div className={cn("rounded-2xl bg-white shadow-xl")}
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <div>
              <div className="text-base font-extrabold">{title}</div>
              {description ? <div className="mt-1 text-sm text-slate-500">{description}</div> : null}
            </div>
            <button
              className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="px-5 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
