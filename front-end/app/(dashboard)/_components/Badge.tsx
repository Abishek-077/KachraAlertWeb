import { cn } from "./ui";

export default function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "emerald" | "amber" | "red" | "blue";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tone === "slate" && "border-slate-200 bg-slate-50 text-slate-700",
        tone === "emerald" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        tone === "amber" && "border-amber-200 bg-amber-50 text-amber-700",
        tone === "red" && "border-red-200 bg-red-50 text-red-700",
        tone === "blue" && "border-blue-200 bg-blue-50 text-blue-700",
      )}
    >
      {children}
    </span>
  );
}
