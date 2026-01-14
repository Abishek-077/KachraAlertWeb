"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordData } from "../schema";
import { Leaf } from "lucide-react";
import { apiPost } from "@/app/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const tokenFromQuery = searchParams.get("token") ?? "";

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { token: tokenFromQuery, password: "", confirmPassword: "" }
    });

    async function onSubmit(values: ResetPasswordData) {
        setMessage(null);
        try {
            await apiPost("/api/v1/auth/reset-password", {
                token: values.token,
                password: values.password
            });
            setMessage("Password reset successful. Redirecting to login...");
            setTimeout(() => router.push("/login"), 1200);
        } catch (e: any) {
            setMessage(e?.message ?? "Unable to reset password");
        }
    }

    return (
        <div className="w-full max-w-md animate-scale-in">
            <div className="rounded-3xl border border-slate-200/50 bg-white/90 p-10 shadow-soft backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/90">
                <div className="text-center">
                    <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-soft">
                        <Leaf size={22} />
                    </div>
                    <h1 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">Reset Password</h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Set a new password for your account.</p>
                    {message && (
                        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
                            {message}
                        </p>
                    )}
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Reset Token</label>
                        <input
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-500"
                            placeholder="Paste your reset token"
                            {...register("token")}
                        />
                        {errors.token && (
                            <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">{errors.token.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                        <input
                            type="password"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-500"
                            placeholder="Create a strong password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-500"
                            placeholder="Re-enter your password"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-brand-500 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-glow hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isSubmitting ? "Resetting..." : "Reset password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
