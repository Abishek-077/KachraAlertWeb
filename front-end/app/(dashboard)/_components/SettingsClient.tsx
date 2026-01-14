"use client";

import { useState } from "react";
import { Bell, Home, User2, ShieldCheck } from "lucide-react";

import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";
import Input from "./Input";
import Badge from "./Badge";

type Tab = "profile" | "address" | "notifications" | "security";

export default function SettingsClient() {
  const [tab, setTab] = useState<Tab>("profile");

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
          subtitle="These settings are local demo state for now"
          right={<Badge tone="blue">Demo</Badge>}
        />
        <CardBody>
          {tab === "profile" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Full name</div>
                <Input defaultValue="Rajesh Shrestha" />
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Email</div>
                <Input defaultValue="rajesh@example.com" />
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Phone</div>
                <Input defaultValue="+977 98XXXXXXXX" />
              </div>
              <div className="flex items-end">
                <Button onClick={() => console.log("Saved")}>Save changes</Button>
              </div>
            </div>
          ) : null}

          {tab === "address" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Society</div>
                <Input defaultValue="Green Valley" />
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Building</div>
                <Input defaultValue="Block A" />
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Apartment</div>
                <Input defaultValue="A-203" />
              </div>
              <div className="flex items-end">
                <Button onClick={() => console.log("Saved")}>Save address</Button>
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
