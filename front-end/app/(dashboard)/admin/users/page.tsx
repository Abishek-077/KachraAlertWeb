const rows = [
  { id: "u-1001", name: "Aarav Singh", email: "aarav@example.com", role: "Resident" },
  { id: "u-1002", name: "Priya Patel", email: "priya@example.com", role: "Admin/Driver" },
  { id: "u-1003", name: "Rohan Sharma", email: "rohan@example.com", role: "Resident" }
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
        <p className="text-sm text-slate-500">Manage residents and admin drivers from one place.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-700">{row.id}</td>
                <td className="px-4 py-3 text-slate-700">{row.name}</td>
                <td className="px-4 py-3 text-slate-500">{row.email}</td>
                <td className="px-4 py-3 text-slate-500">{row.role}</td>
                <td className="px-4 py-3 text-emerald-600">
                  <a className="mr-3 hover:underline" href={`/admin/users/${row.id}`}>
                    View
                  </a>
                  <a className="hover:underline" href={`/admin/users/${row.id}/edit`}>
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
