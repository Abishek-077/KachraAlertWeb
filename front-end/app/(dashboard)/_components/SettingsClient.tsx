"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Home, User2, ShieldCheck, Star } from "lucide-react";
import { useRouter } from "next/navigation";

import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";
import Input from "./Input";
import { apiGet, apiGetBlob, apiPatch, apiPost } from "@/app/lib/api";
import { useAuth } from "@/app/lib/auth-context";

type Tab = "profile" | "address" | "notifications" | "security" | "rating";

type ServiceRatingSummary = {
  averageScore: number;
  totalRatings: number;
  myRating: {
    id: string;
    score: number;
    comment: string;
    updatedAt: string;
  } | null;
};

type ServiceRatingSaveResponse = {
  rating: {
    id: string;
    score: number;
    comment: string;
    updatedAt: string;
  } | null;
  averageScore: number;
  totalRatings: number;
};

export default function SettingsClient() {
  const [tab, setTab] = useState<Tab>("profile");
  const { user, refresh, logout } = useAuth();
  const router = useRouter();
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
  const profileImageObjectUrl = useRef<string | null>(null);
  const [profileImageRevision, setProfileImageRevision] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(true);
  const [ratingSaving, setRatingSaving] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingAverage, setRatingAverage] = useState(0);
  const [ratingTotal, setRatingTotal] = useState(0);
  const [ratingUpdatedAt, setRatingUpdatedAt] = useState<string | null>(null);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [ratingSavedMessage, setRatingSavedMessage] = useState<string | null>(null);
  const [switchingAccount, setSwitchingAccount] = useState<"resident" | "admin_driver" | null>(null);

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
      const profileImageUrl = user?.profileImageUrl ? `${user.profileImageUrl}?v=${profileImageRevision}` : null;
      if (!profileImageUrl) {
        if (profileImageObjectUrl.current) {
          URL.revokeObjectURL(profileImageObjectUrl.current);
        }
        profileImageObjectUrl.current = null;
        if (isActive) {
          setProfileImagePreview(null);
        }
        return;
      }
      try {
        const blob = await apiGetBlob(profileImageUrl);
        const objectUrl = URL.createObjectURL(blob);
        if (profileImageObjectUrl.current) {
          URL.revokeObjectURL(profileImageObjectUrl.current);
        }
        profileImageObjectUrl.current = objectUrl;
        if (isActive) {
          setProfileImagePreview(objectUrl);
        }
      } catch (error) {
        console.error(error);
        if (profileImageObjectUrl.current) {
          URL.revokeObjectURL(profileImageObjectUrl.current);
        }
        profileImageObjectUrl.current = null;
        if (isActive) {
          setProfileImagePreview(null);
        }
      }
    };
    void loadProfileImage();
    return () => {
      isActive = false;
    };
  }, [user?.profileImageUrl, profileImageRevision]);

  useEffect(() => {
    return () => {
      if (profileImageObjectUrl.current) {
        URL.revokeObjectURL(profileImageObjectUrl.current);
      }
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    const loadRatingSummary = async () => {
      setRatingLoading(true);
      setRatingError(null);
      try {
        const response = await apiGet<ServiceRatingSummary>("/api/v1/service-ratings/summary");
        if (!isActive) return;
        const summary = response.data;
        setRatingAverage(summary?.averageScore ?? 0);
        setRatingTotal(summary?.totalRatings ?? 0);
        if (summary?.myRating) {
          setRatingScore(summary.myRating.score);
          setRatingComment(summary.myRating.comment ?? "");
          setRatingUpdatedAt(summary.myRating.updatedAt);
        }
      } catch (error) {
        console.error(error);
        if (isActive) {
          setRatingError("Unable to load rating details right now.");
        }
      } finally {
        if (isActive) {
          setRatingLoading(false);
        }
      }
    };
    void loadRatingSummary();
    return () => {
      isActive = false;
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

  const saveRating = async () => {
    setRatingSaving(true);
    setRatingSavedMessage(null);
    setRatingError(null);
    try {
      const response = await apiPost<ServiceRatingSaveResponse>("/api/v1/service-ratings", {
        score: ratingScore,
        comment: ratingComment.trim()
      });
      const payload = response.data;
      setRatingAverage(payload?.averageScore ?? 0);
      setRatingTotal(payload?.totalRatings ?? 0);
      setRatingUpdatedAt(payload?.rating?.updatedAt ?? null);
      setRatingSavedMessage("Thanks for rating our service.");
    } catch (error) {
      console.error(error);
      setRatingError("Unable to save your rating right now.");
    } finally {
      setRatingSaving(false);
    }
  };

  const switchAccount = async (accountType: "resident" | "admin_driver") => {
    setSwitchingAccount(accountType);
    router.push("/login");
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  const tabTitle =
    tab === "profile"
      ? "Profile"
      : tab === "address"
        ? "Address"
        : tab === "notifications"
          ? "Notifications"
          : tab === "security"
            ? "Security"
            : "Service Rating";

  const tabSubtitle =
    tab === "rating" ? "Rate your pickup and waste management service" : "Update your profile details";

  return (
    <div className="grid gap-4 lg:grid-cols-3 motion-reveal-target">
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
            <button
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${tab === "rating" ? "bg-emerald-500 text-white" : "hover:bg-slate-50"}`}
              onClick={() => setTab("rating")}
            >
              <span className="inline-flex items-center gap-2"><Star size={16} /> Service Rating</span>
            </button>
          </div>
        </CardBody>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader
          title={tabTitle}
          subtitle={tabSubtitle}
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
                        setProfileImageRevision((prev) => prev + 1);
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

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="font-extrabold">Switch account role</div>
                <div className="mt-1 text-sm text-slate-500">
                  Sign out and continue on login as Resident or Admin / Driver.
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    disabled={Boolean(switchingAccount)}
                    onClick={() => {
                      void switchAccount("resident");
                    }}
                  >
                    {switchingAccount === "resident" ? "Opening login..." : "Login as Resident"}
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={Boolean(switchingAccount)}
                    onClick={() => {
                      void switchAccount("admin_driver");
                    }}
                  >
                    {switchingAccount === "admin_driver" ? "Opening login..." : "Login as Admin / Driver"}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "rating" ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="font-extrabold">Rate our service quality</div>
                <div className="mt-1 text-sm text-slate-500">
                  Your feedback helps us improve collection schedules and response time.
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      className="rounded-xl border border-slate-200 bg-white p-2 hover:bg-slate-50"
                      onClick={() => setRatingScore(score)}
                      aria-label={`${score} star${score === 1 ? "" : "s"}`}
                    >
                      <Star
                        size={20}
                        className={score <= ratingScore ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-slate-700">{ratingScore}/5</span>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Feedback (optional)</div>
                <textarea
                  value={ratingComment}
                  onChange={(event) => setRatingComment(event.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Share what went well and what can be improved."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-500/20"
                />
                <div className="mt-1 text-xs text-slate-500">{ratingComment.length}/500</div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-slate-700">
                <div className="font-semibold">
                  Community rating: {ratingAverage.toFixed(1)} / 5 ({ratingTotal} ratings)
                </div>
                {ratingUpdatedAt ? (
                  <div className="mt-1 text-xs text-slate-600">
                    Your latest rating was updated on {new Date(ratingUpdatedAt).toLocaleString()}.
                  </div>
                ) : null}
              </div>

              {ratingLoading ? <div className="text-sm text-slate-500">Loading rating details...</div> : null}
              {ratingError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                  {ratingError}
                </div>
              ) : null}
              {ratingSavedMessage ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                  {ratingSavedMessage}
                </div>
              ) : null}

              <Button onClick={() => void saveRating()} disabled={ratingSaving || ratingLoading}>
                {ratingSaving ? "Submitting..." : "Submit rating"}
              </Button>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
