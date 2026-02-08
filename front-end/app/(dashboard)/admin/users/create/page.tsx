"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Input from "../../../_components/Input";
import Button from "../../../_components/Button";
import { apiPostForm } from "@/app/lib/api";

const initialForm = {
  accountType: "resident",
  name: "",
  email: "",
  phone: "",
  password: "",
  society: "",
  building: "",
  apartment: ""
};

export default function AdminUserCreatePage() {
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (key: keyof typeof initialForm) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      payload.append(key, value);
    });
    if (imageFile) {
      payload.append("image", imageFile);
    }

    try {
      await apiPostForm("/api/v1/auth/user", payload);
      setStatus("success");
      setMessage("User created successfully.");
      setForm(initialForm);
      setImageFile(null);
    } catch (error) {
      const err = error as Error;
      setStatus("error");
      setMessage(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Create User</h1>
        <p className="text-sm text-slate-500">Add a new resident or admin driver account.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Account Type</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-emerald-500/20"
              value={form.accountType}
              onChange={handleChange("accountType")}
            >
              <option value="resident">Resident</option>
              <option value="admin_driver">Admin / Driver</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
            <Input value={form.name} onChange={handleChange("name")} placeholder="Enter full name" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <Input value={form.email} onChange={handleChange("email")} placeholder="name@example.com" type="email" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Phone</label>
            <Input value={form.phone} onChange={handleChange("phone")} placeholder="+91 00000 00000" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <Input value={form.password} onChange={handleChange("password")} placeholder="Create a password" type="password" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Society</label>
            <Input value={form.society} onChange={handleChange("society")} placeholder="Society name" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Building</label>
            <Input value={form.building} onChange={handleChange("building")} placeholder="Building name" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Apartment</label>
            <Input value={form.apartment} onChange={handleChange("apartment")} placeholder="Apartment number" required />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Profile Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-600 hover:file:bg-emerald-100"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Creating..." : "Create User"}
          </Button>
          {message ? (
            <span className={`text-sm ${status === "error" ? "text-red-500" : "text-emerald-600"}`}>
              {message}
            </span>
          ) : null}
        </div>
      </form>
    </div>
  );
}
