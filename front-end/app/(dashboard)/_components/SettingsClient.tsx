"use client";

import { useEffect, useState } from "react";
import { Bell, Home, User2, ShieldCheck } from "lucide-react";

import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";
import Input from "./Input";
import { apiPatch } from "@/app/lib/api";
import { useAuth } from "@/app/lib/auth-context";

type Tab = "profile" | "address" | "notifications" | "security";

export default function SettingsClient() {
  const [tab, setTab] = useState<Tab>("profile");
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    society: "",
    building: "",
    apartment: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      society: user.society,
      building: user.building,
      apartment: user.apartment
    });
  }, [user]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await apiPatch("/api/v1/users/me", {
        name: form.name,
        phone: form.phone
      });
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const saveAddress = async () => {
    setSaving(true);
    try {
      await apiPatch("/api/v1/users/me", {
        society: form.society,
        building: form.building,
        apartment: form.apartment
      });
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader title="Settings" subtitle="Customize your experience" />
        <CardBody>
          <div className="space-y-2">
            <button
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${tab === "profile" ? "bg-emerald-500 text-white" : "hover:bg-slate-50"}`}
              onClick={() => setTab("profile")}
            >
              <span className="inline-flex items-center gap-2"><User2 size={16} /> Profile</span>
            </button>
            <button
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${tab === "address" ? "bg-emerald-500 text-white" : "hover:bg-slate-50"}`}
              onClick={() => setTab("address")}
            >
              <span className="inline-flex items-center gap-2"><Home size={16} /> Address</span>
            </button>
            <button
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${tab === "notifications" ? "bg-emerald-500 text-white" : "hover:bg-slate-50"}`}
              onClick={() => setTab("notifications")}
            >
              <span className="inline-flex items-center gap-2"><Bell size={16} /> Notifications</span>
            </button>
            <button
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${tab === "security" ? "bg-emerald-500 text-white" : "hover:bg-slate-50"}`}
              onClick={() => setTab("security")}
            >
              <span className="inline-flex items-center gap-2"><ShieldCheck size={16} /> Security</span>
            </button>
          </div>
        </CardBody>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader
          title={tab === "profile" ? "Profile" : tab === "address" ? "Address" : tab === "notifications" ? "Notifications" : "Security"}
          subtitle="Update your profile details"
        />
        <CardBody>
          {tab === "profile" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Full name</div>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Email</div>
                <Input value={form.email} disabled />
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Phone</div>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="flex items-end">
                <Button onClick={() => void saveProfile()} disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          ) : null}

          {tab === "address" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Society</div>
                <Input value={form.society} onChange={(e) => setForm({ ...form, society: e.target.value })} />
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Building</div>
                <Input value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} />
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Apartment</div>
                <Input value={form.apartment} onChange={(e) => setForm({ ...form, apartment: e.target.value })} />
              </div>
              <div className="flex items-end">
                <Button onClick={() => void saveAddress()} disabled={saving}>
                  {saving ? "Saving..." : "Save address"}
                </Button>
              </div>
            </div>
          ) : null}

          {tab === "notifications" ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold">Pickup reminders</div>
                    <div className="text-sm text-slate-500">Get notified 30 minutes before pickup</div>
                  </div>
                  <Button variant="secondary" onClick={() => console.log("Toggle")}>Enabled</Button>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold">Payment updates</div>
                    <div className="text-sm text-slate-500">Invoice due & payment confirmations</div>
                  </div>
                  <Button variant="secondary" onClick={() => console.log("Toggle")}>Enabled</Button>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold">Urgent alerts</div>
                    <div className="text-sm text-slate-500">Route changes, delays, road blockage</div>
                  </div>
                  <Button variant="secondary" onClick={() => console.log("Toggle")}>Enabled</Button>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "security" ? (
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Change password</div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input placeholder="New password" type="password" />
                  <Input placeholder="Confirm password" type="password" />
                </div>
              </div>
              <Button onClick={() => console.log("Updated")}>Update password</Button>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
