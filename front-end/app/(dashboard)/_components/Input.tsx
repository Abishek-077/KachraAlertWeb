import { cn } from "./ui";

export default function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-emerald-500/20",
        className,
      )}
      {...props}
    />
  );
}
