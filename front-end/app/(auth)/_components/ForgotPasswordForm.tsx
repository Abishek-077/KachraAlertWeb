"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordData } from "../schema";
import { Leaf } from "lucide-react";
import { apiPost } from "@/app/lib/api";

export default function ForgotPasswordForm() {
    const [message, setMessage] = useState<string | null>(null);
    const [devToken, setDevToken] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" }
    });

    async function onSubmit(values: ForgotPasswordData) {
        setMessage(null);
        setDevToken(null);
        try {
            const response = await apiPost<{ devResetToken?: string }>("/api/v1/auth/forgot-password", values);
            setMessage(response.message);
            if (response.data?.devResetToken) {
                setDevToken(response.data.devResetToken);
            }
        } catch (e: any) {
            setMessage(e?.message ?? "Unable to request reset link");
        }
    }

    return (
        <div className="w-full max-w-md animate-scale-in">
            <div className="rounded-3xl border border-slate-200/50 bg-white/90 p-10 shadow-soft backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/90">
                <div className="text-center">
                    <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-soft">
                        <Leaf size={22} />
                    </div>
                    <h1 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">Forgot Password</h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">We&apos;ll send you a reset link if your account exists.</p>
                    {message && (
                        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
                            {message}
                        </p>
                    )}
                    {devToken && (
                        <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:border-brand-900/40 dark:bg-brand-900/20 dark:text-brand-200">
                            <div className="font-semibold">Dev reset token</div>
                            <div className="break-all text-xs">{devToken}</div>
                        </div>
                    )}
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                        <input
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-500"
                            placeholder="you@example.com"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">{errors.email.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-brand-500 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-glow hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isSubmitting ? "Sending..." : "Send reset link"}
                    </button>
                </form>
            </div>
        </div>
    );
}
