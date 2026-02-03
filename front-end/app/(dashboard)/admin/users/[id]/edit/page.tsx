type AdminUserEditPageProps = {
  params: { id: string };
};

export default function AdminUserEditPage({ params }: AdminUserEditPageProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Edit User</h1>
      <p className="text-sm text-slate-500">
        Editing user: <span className="font-semibold text-slate-800">{params.id}</span>
      </p>
    </div>
  );
}
