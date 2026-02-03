import { cn } from "./ui";

export default function DataTable({
  columns,
  rows,
}: {
  columns: { key: string; label: string; className?: string }[];
  rows: Record<string, React.ReactNode>[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-[960px] w-full text-left text-sm">
        <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={cn("px-5 py-3.5", c.className)}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80">
              {columns.map((c) => (
                <td key={c.key} className={cn("px-5 py-4 align-top", c.className)}>
                  {r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
