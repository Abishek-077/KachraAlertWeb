import Link from "next/link";

import Badge from "@/app/(dashboard)/_components/Badge";
import Button from "@/app/(dashboard)/_components/Button";
import Card, { CardBody, CardHeader } from "@/app/(dashboard)/_components/Card";

type AdminUserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">User Details</h1>
          <p className="text-sm text-slate-500">
            Viewing user: <span className="font-semibold text-slate-800">{id}</span>
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          href={`/admin/users/${id}/edit`}
        >
          Edit user
        </Link>
      </div>

      <Card>
        <CardHeader
          title="Profile overview"
          subtitle="Quick snapshot of account health and access."
          right={<Badge tone="emerald">Active</Badge>}
        />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Full name</div>
              <div className="mt-1 text-base font-semibold text-slate-900">Aarav Singh</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</div>
              <div className="mt-1 text-base font-semibold text-slate-900">Resident</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</div>
              <div className="mt-1 text-base font-semibold text-slate-700">aarav@example.com</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</div>
              <div className="mt-1 text-base font-semibold text-slate-700">+977 98123 45678</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Service address" subtitle="Primary pickup location for this user." />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Society</div>
              <div className="mt-1 text-base font-semibold text-slate-700">Kachara Heights</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Building</div>
              <div className="mt-1 text-base font-semibold text-slate-700">B</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Apartment</div>
              <div className="mt-1 text-base font-semibold text-slate-700">302</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Account actions" subtitle="Manage access, removal, and notifications." />
        <CardBody>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">Reset password</Button>
            <Button variant="secondary">Suspend account</Button>
            <Button variant="danger">Delete account</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
