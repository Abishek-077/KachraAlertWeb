import { cn } from "./ui";

export default function DataTable({
  columns,
  rows,
}: {
  columns: { key: string; label: string; className?: string }[];
  rows: Record<string, React.ReactNode>[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={cn("px-4 py-3", c.className)}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((r, idx) => (
            <tr key={idx} className="hover:bg-slate-50">
              {columns.map((c) => (
                <td key={c.key} className={cn("px-4 py-3", c.className)}>
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
