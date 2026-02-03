type AdminUserDetailPageProps = {
  params: { id: string };
};

export default function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">User Details</h1>
      <p className="text-sm text-slate-500">
        Viewing user: <span className="font-semibold text-slate-800">{params.id}</span>
      </p>
    </div>
  );
}
