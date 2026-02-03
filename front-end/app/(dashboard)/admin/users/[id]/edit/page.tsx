import Link from "next/link";

import Button from "@/app/(dashboard)/_components/Button";
import Card, { CardBody, CardHeader } from "@/app/(dashboard)/_components/Card";
import Input from "@/app/(dashboard)/_components/Input";

type AdminUserEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserEditPage({ params }: AdminUserEditPageProps) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Edit User</h1>
          <p className="text-sm text-slate-500">
            Editing user: <span className="font-semibold text-slate-800">{id}</span>
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          href={`/admin/users/${id}`}
        >
          Back to profile
        </Link>
      </div>

      <Card>
        <CardHeader title="User information" subtitle="Update personal details and access level." />
        <CardBody>
          <form className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Full name</div>
              <Input defaultValue="Aarav Singh" />
            </div>
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Email</div>
              <Input defaultValue="aarav@example.com" type="email" />
            </div>
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Phone</div>
              <Input defaultValue="+977 98123 45678" />
            </div>
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Role</div>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-emerald-500/20"
                defaultValue="resident"
              >
                <option value="resident">Resident</option>
                <option value="admin_driver">Admin / Driver</option>
              </select>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Service address" subtitle="Keep pickup details up to date." />
        <CardBody>
          <form className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Society</div>
              <Input defaultValue="Kachara Heights" />
            </div>
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Building</div>
              <Input defaultValue="B" />
            </div>
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Apartment</div>
              <Input defaultValue="302" />
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button>Save changes</Button>
        <Button variant="secondary">Send invite</Button>
        <Button variant="danger">Deactivate user</Button>
      </div>
    </div>
  );
}
