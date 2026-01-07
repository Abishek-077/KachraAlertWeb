"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schema";
import { Eye, EyeOff, Leaf } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockLogin } from "@/app/lib/mock-auth";

export default function LoginForm() {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "", remember: false }
    });

    async function onSubmit(values: LoginFormData) {
        setMessage(null);
        try {
            mockLogin(values.email, values.password);
            router.push("/dashboard");
        } catch (e: any) {
            setMessage(e?.message ?? "Login failed");
        }
    }

    return (
        <div className="w-full max-w-md animate-scale-in">
            <div className="rounded-3xl border border-slate-200/50 bg-white/90 p-10 shadow-soft backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/90">
                {/* Logo */}
                <div className="text-center">
                    <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-soft">
                        <Leaf size={22} />
                    </div>
                    <h1 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign in to your KacharaAlert account</p>
                    {message && (
                        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                            {message}
                        </p>
                    )}
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* Email */}
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

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                        <div className="relative">
                            <input
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-500"
                                placeholder="Enter your password"
                                type={show ? "text" : "password"}
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShow((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                                aria-label="Toggle password visibility"
                            >
                                {show ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Remember + Forgot */}
                    <div className="flex items-center justify-between">
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <input
                                type="checkbox"
                                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-500 dark:border-slate-600"
                                {...register("remember")}
                            />
                            Remember me
                        </label>

                        <button
                            type="button"
                            className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                            onClick={() => setMessage("Forgot password is demo-only right now")}
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-brand-500 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-glow hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isSubmitting ? "Signing In..." : "Sign In"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Or continue with</span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    </div>

                    {/* Social */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:scale-105 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            onClick={() => setMessage("Google login is demo-only right now")}
                        >
                            Google
                        </button>
                        <button
                            type="button"
                            className="rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:scale-105 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            onClick={() => setMessage("Facebook login is demo-only right now")}
                        >
                            Facebook
                        </button>
                    </div>

                    <p className="text-center text-sm text-slate-600 dark:text-slate-300">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
