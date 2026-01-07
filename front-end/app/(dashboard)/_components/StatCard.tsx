import Card from "./Card";
import { CardBody } from "./Card";

export default function StatCard({
  title,
  value,
  icon,
  hint,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  hint?: string;
}) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-500">{title}</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight">{value}</div>
            {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
