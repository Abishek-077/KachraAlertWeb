import { cn } from "./ui";

export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>
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
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
      <div>
        <div className="text-lg font-extrabold tracking-tight">{title}</div>
        {subtitle ? <div className="mt-1 text-sm text-slate-500">{subtitle}</div> : null}
      </div>
      {right}
    </div>
  );
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-5">{children}</div>;
}
