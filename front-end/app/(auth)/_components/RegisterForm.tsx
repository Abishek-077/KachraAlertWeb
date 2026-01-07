"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    registerStep1Schema,
    registerStep2Schema,
    type RegisterStep1Data,
    type RegisterStep2Data
} from "../schema";
import { Home, Truck, Leaf, Eye, EyeOff } from "lucide-react";
import { mockRegister } from "@/app/lib/mock-auth";

type Step1 = RegisterStep1Data;
type Step2 = RegisterStep2Data;

export default function RegisterForm() {
    const [step, setStep] = useState<1 | 2>(1);
    const [show, setShow] = useState(false);
    const [cacheStep1, setCacheStep1] = useState<Step1 | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const step1Form = useForm<Step1>({
        resolver: zodResolver(registerStep1Schema),
        defaultValues: {
            accountType: "resident",
            name: "",
            email: "",
            phone: "",
            password: ""
        }
    });

    const step2Form = useForm<Step2>({
        resolver: zodResolver(registerStep2Schema),
        defaultValues: { society: "", building: "", apartment: "", terms: false }
    });

    const progress = useMemo(() => (step === 1 ? 50 : 100), [step]);

    async function submitStep1(values: Step1) {
        setMessage(null);
        setCacheStep1(values);
        setStep(2);
    }

    async function submitStep2(values: Step2) {
        setMessage(null);
        const payload = { ...cacheStep1, ...values };
        try {
            mockRegister(payload);
            router.push("/dashboard");
        } catch (e: any) {
            setMessage(e?.message ?? "Register failed");
        }
    }

    return (
        <div className="w-full max-w-2xl animate-scale-in">
            <div className="rounded-3xl border border-slate-200/50 bg-white/90 p-10 shadow-soft backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/90">
                <div className="text-center">
                    <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-soft">
                        <Leaf size={22} />
                    </div>
                    <h1 className="mt-5 text-3xl font-extrabold text-slate-900 dark:text-white">Create Account</h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Join KacharaAlert today</p>
                    {message && (
                        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                            {message}
                        </p>
                    )}

                    {/* Stepper */}
                    <div className="mx-auto mt-8 w-full max-w-sm">
                        <div className="flex items-center justify-center gap-4">
                            <div
                                className={[
                                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm transition-all",
                                    step >= 1 
                                        ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white scale-110" 
                                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                ].join(" ")}
                            >
                                1
                            </div>
                            <div className="h-1.5 w-40 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500 shadow-sm"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div
                                className={[
                                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm transition-all",
                                    step === 2 
                                        ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white scale-110" 
                                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                ].join(" ")}
                            >
                                2
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <form className="mt-10 space-y-6" onSubmit={step1Form.handleSubmit(submitStep1)}>
                        {/* Account type */}
                        <div>
                            <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">Account Type</label>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() => step1Form.setValue("accountType", "resident")}
                                    className={[
                                        "rounded-2xl border p-5 text-left shadow-sm transition-all",
                                        step1Form.watch("accountType") === "resident"
                                            ? "border-brand-400 bg-brand-50 ring-2 ring-brand-300/50 scale-105 dark:border-brand-600 dark:bg-brand-900/20 dark:ring-brand-700/30"
                                            : "border-slate-200 bg-white hover:bg-slate-50 hover:scale-105 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                                    ].join(" ")}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-950">
                                            <Home size={20} className="text-brand-600 dark:text-brand-400" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900 dark:text-white">Resident</div>
                                            <div className="text-sm text-slate-600 dark:text-slate-300">
                                                Receive pickup alerts
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => step1Form.setValue("accountType", "admin_driver")}
                                    className={[
                                        "rounded-2xl border p-5 text-left shadow-sm transition-all",
                                        step1Form.watch("accountType") === "admin_driver"
                                            ? "border-brand-400 bg-brand-50 ring-2 ring-brand-300/50 scale-105 dark:border-brand-600 dark:bg-brand-900/20 dark:ring-brand-700/30"
                                            : "border-slate-200 bg-white hover:bg-slate-50 hover:scale-105 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                                    ].join(" ")}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-950">
                                            <Truck size={20} className="text-brand-600 dark:text-brand-400" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900 dark:text-white">Admin/Driver</div>
                                            <div className="text-sm text-slate-600 dark:text-slate-300">
                                                Manage schedules
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                            {step1Form.formState.errors.accountType && (
                                <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">
                                    {step1Form.formState.errors.accountType.message as string}
                                </p>
                            )}
                        </div>

                        {/* Fields */}
                        {[
                            { key: "name", label: "Full Name", ph: "John Doe" },
                            { key: "email", label: "Email Address", ph: "you@example.com" },
                            { key: "phone", label: "Phone Number", ph: "98XXXXXXXX" }
                        ].map((f) => (
                            <div key={f.key}>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{f.label}</label>
                                <input
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-500"
                                    placeholder={f.ph}
                                    {...step1Form.register(f.key as keyof Step1)}
                                />
                                {/* @ts-expect-error */}
                                {step1Form.formState.errors?.[f.key]?.message && (
                                    <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">
                                        {/* @ts-expect-error */}
                                        {step1Form.formState.errors[f.key].message}
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                            <div className="relative">
                                <input
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-500"
                                    placeholder="Create a strong password"
                                    type={show ? "text" : "password"}
                                    {...step1Form.register("password")}
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
                            {step1Form.formState.errors.password && (
                                <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">
                                    {step1Form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        <button 
                            type="submit"
                            className="w-full rounded-xl bg-brand-500 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-glow hover:scale-[1.02]"
                        >
                            Next Step
                        </button>

                        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                                Sign In
                            </Link>
                        </p>
                    </form>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <form className="mt-10 space-y-6" onSubmit={step2Form.handleSubmit(submitStep2)}>
                        {[
                            { key: "society", label: "Society", ph: "e.g. Sunshine Society" },
                            { key: "building", label: "Building", ph: "e.g. Block A" },
                            { key: "apartment", label: "Apartment", ph: "e.g. A-12" }
                        ].map((f) => (
                            <div key={f.key}>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{f.label}</label>
                                <input
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-500"
                                    placeholder={f.ph}
                                    {...step2Form.register(f.key as keyof Step2)}
                                />
                                {/* @ts-expect-error */}
                                {step2Form.formState.errors?.[f.key]?.message && (
                                    <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">
                                        {/* @ts-expect-error */}
                                        {step2Form.formState.errors[f.key].message}
                                    </p>
                                )}
                            </div>
                        ))}

                        <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 cursor-pointer rounded border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-500 dark:border-slate-600"
                                {...step2Form.register("terms")}
                            />
                            <span>
                                I agree to the Terms & Conditions.
                                {step2Form.formState.errors.terms && (
                                    <span className="mt-1 block text-xs font-medium text-red-500 dark:text-red-400">
                                        {step2Form.formState.errors.terms.message}
                                    </span>
                                )}
                            </span>
                        </label>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full rounded-xl border-2 border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:scale-[1.02] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Back
                            </button>
                            <button 
                                type="submit"
                                className="w-full rounded-xl bg-brand-500 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-glow hover:scale-[1.02]"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
