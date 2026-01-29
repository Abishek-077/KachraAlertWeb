"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Home, User2, ShieldCheck } from "lucide-react";

import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";
import Input from "./Input";
import { apiGetBlob, apiPatch, apiPost } from "@/app/lib/api";
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
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const previousProfileImageUrl = useRef<string | null>(null);
  const profileImageObjectUrl = useRef<string | null>(null);

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

  useEffect(() => {
    let isActive = true;
    const loadProfileImage = async () => {
      if (!user?.profileImageUrl) {
        if (profileImageObjectUrl.current) {
          URL.revokeObjectURL(profileImageObjectUrl.current);
        }
        profileImageObjectUrl.current = null;
        if (isActive) {
          setProfileImagePreview(null);
        }
        previousProfileImageUrl.current = null;
        return;
      }
      if (previousProfileImageUrl.current === user.profileImageUrl) return;
      try {
        const blob = await apiGetBlob(user.profileImageUrl);
        const objectUrl = URL.createObjectURL(blob);
        if (profileImageObjectUrl.current) {
          URL.revokeObjectURL(profileImageObjectUrl.current);
        }
        profileImageObjectUrl.current = objectUrl;
        previousProfileImageUrl.current = user.profileImageUrl;
        if (isActive) {
          setProfileImagePreview(objectUrl);
        }
      } catch (error) {
        console.error(error);
      }
    };
    void loadProfileImage();
    return () => {
      isActive = false;
    };
  }, [user?.profileImageUrl]);

  useEffect(() => {
    return () => {
      if (profileImageObjectUrl.current) {
        URL.revokeObjectURL(profileImageObjectUrl.current);
      }
    };
  }, []);

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
              <div className="md:col-span-2">
                <div className="mb-2 text-sm font-semibold text-slate-700">Profile photo</div>
                <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-400">
                    {profileImagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profileImagePreview} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      "No Photo"
                    )}
                  </div>
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      type="button"
                      disabled={profileImageUploading}
                      onClick={() => {
                        const input = document.getElementById("profile-image-input");
                        if (input instanceof HTMLInputElement) {
                          input.click();
                        }
                      }}
                    >
                      {profileImageUploading ? "Uploading..." : "Upload photo"}
                    </Button>
                    <span className="text-xs text-slate-500">PNG or JPG up to 5MB.</span>
                  </div>
                </div>
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    if (!file) return;
                    setProfileImageUploading(true);
                    const reader = new FileReader();
                    reader.onload = async () => {
                      const result = typeof reader.result === "string" ? reader.result : "";
                      const base64 = result.includes(",") ? result.split(",")[1] : result;
                      try {
                        await apiPost("/api/v1/users/me/profile-image", {
                          image: {
                            name: file.name,
                            mimeType: file.type || "application/octet-stream",
                            dataBase64: base64
                          }
                        });
                        await refresh();
                      } catch (error) {
                        console.error(error);
                      } finally {
                        setProfileImageUploading(false);
                        if (event.target) {
                          event.target.value = "";
                        }
                      }
                    };
                    reader.onerror = () => {
                      console.error("Failed to read profile image");
                      setProfileImageUploading(false);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
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
