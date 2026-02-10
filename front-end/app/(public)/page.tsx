"use client";

import Link from "next/link";
import {
    Bell,
    CalendarDays,
    CreditCard,
    ShieldCheck,
    Clock,
    CheckCircle2,
    Sparkles,
    ArrowRight,
    Waves,
    BellRing,
    TrendingUp
} from "lucide-react";

const features = [
    { icon: Bell, title: "Smart Alerts", desc: "Never miss a collection with timely notifications", color: "text-blue-600 dark:text-blue-400" },
    { icon: CalendarDays, title: "Digital Schedule", desc: "View and manage collection schedules easily", color: "text-purple-600 dark:text-purple-400" },
    { icon: CreditCard, title: "Easy Payments", desc: "Pay your waste management fees digitally", color: "text-green-600 dark:text-green-400" },
    { icon: ShieldCheck, title: "Report Issues", desc: "Quickly report missed pickups or problems", highlight: true, color: "text-brand-600 dark:text-brand-400" },
    { icon: Clock, title: "Real-time Updates", desc: "Get instant updates on collection status", color: "text-orange-600 dark:text-orange-400" },
    { icon: CheckCircle2, title: "Track History", desc: "Monitor your waste management history", color: "text-indigo-600 dark:text-indigo-400" }
];

const pulseBars = [28, 36, 26, 54, 48, 88, 82, 104];

export default function PublicHomePage() {
    return (
        <div className="pt-16 animate-fade-in">
            {/* Hero */}
            <section className="mx-auto max-w-4xl text-center animate-slide-up">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-200/50 bg-brand-50/80 px-4 py-2 text-sm font-medium text-brand-700 backdrop-blur-sm dark:border-brand-800/50 dark:bg-brand-900/50 dark:text-brand-300">
                    <Sparkles size={16} className="animate-pulse-slow" />
                    Smart Waste Management Solution
                </div>

                <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl leading-tight">
                    Never Miss Your{" "}
                    <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                        Garbage Collection
                    </span>{" "}
                    Again
                </h1>

                <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
                    KacharaAlert is your smart companion for efficient waste management.
                    Get timely alerts, manage schedules, and contribute to a cleaner environment.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/register"
                        className="group w-full rounded-xl bg-brand-500 px-8 py-4 text-center text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-glow hover:scale-105 sm:w-auto"
                    >
                        Sign Up Free
                        <ArrowRight className="ml-2 inline-block h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="/about"
                        className="w-full rounded-xl border-2 border-slate-200 bg-white/80 px-8 py-4 text-center text-base font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-50 hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-brand-600 sm:w-auto"
                    >
                        Learn More
                    </Link>
                </div>
            </section>

            {/* Stability + Impact Section */}
            <section className="mx-auto mt-14 grid max-w-[1160px] gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="stability-shell rounded-[1.6rem] border border-slate-200/60 bg-white/80 p-6 shadow-soft backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Scroll Intensity</p>
                            <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-[2.7rem]">Collection Stability Pulse</h3>
                        </div>
                        <div className="rounded-[1.3rem] border border-brand-200 bg-brand-50 px-5 py-2 text-brand-700 dark:border-brand-700/50 dark:bg-brand-900/30 dark:text-brand-300">
                            <div className="text-xs font-bold uppercase tracking-[0.08em]">Score</div>
                            <div className="text-4xl font-black leading-none sm:text-[3.2rem]">67%</div>
                        </div>
                    </div>

                    <div className="mt-6 grid h-24 grid-cols-8 items-end gap-2.5">
                        {pulseBars.map((barHeight, idx) => (
                            <div
                                key={`pulse-bar-${idx}`}
                                className="pulse-bar rounded-t-3xl bg-gradient-to-t from-brand-600 via-brand-500 to-cyan-300"
                                style={{
                                    height: `${Math.round(barHeight * 0.8)}px`,
                                    animationDelay: `${idx * 120}ms`
                                }}
                            />
                        ))}
                    </div>

                    <div className="mt-6 rounded-[1.4rem] border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-950/80">
                        <svg viewBox="0 0 640 180" className="h-36 w-full sm:h-40">
                            <path
                                d="M20 130 C 90 20, 160 20, 230 95 S 360 170, 430 70 S 540 30, 610 95"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="7"
                                strokeLinecap="round"
                                className="pulse-line text-brand-500"
                            />
                            <path
                                d="M610 95 C 620 100, 625 80, 632 48"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="7"
                                strokeLinecap="round"
                                className="pulse-tail text-slate-300"
                            />
                            {[20, 140, 230, 360, 470, 610].map((x, idx) => (
                                <circle
                                    key={`pulse-point-${idx}`}
                                    cx={x}
                                    cy={idx === 0 ? 130 : idx === 1 ? 95 : idx === 2 ? 95 : idx === 3 ? 62 : idx === 4 ? 90 : 48}
                                    r={7}
                                    className="pulse-dot fill-brand-500"
                                    style={{ animationDelay: `${idx * 140}ms` }}
                                />
                            ))}
                        </svg>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.3rem] border border-slate-200 bg-white/80 p-5 dark:border-slate-700 dark:bg-slate-950/80">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <BellRing size={18} />
                                <span className="text-sm font-semibold">Active alerts</span>
                            </div>
                            <p className="mt-2 text-4xl font-black leading-none text-slate-900 dark:text-white sm:text-[3.6rem]">387</p>
                        </div>
                        <div className="rounded-[1.3rem] border border-slate-200 bg-white/80 p-5 dark:border-slate-700 dark:bg-slate-950/80">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <TrendingUp size={18} />
                                <span className="text-sm font-semibold">Route precision</span>
                            </div>
                            <p className="mt-2 text-4xl font-black leading-none text-slate-900 dark:text-white sm:text-[3.6rem]">82%</p>
                        </div>
                    </div>
                </div>

                <div className="matrix-shell rounded-[1.6rem] border border-slate-900/80 bg-gradient-to-br from-[#0c1534] to-[#1d2a43] p-6 text-white shadow-soft dark:border-slate-700/80">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="text-3xl font-extrabold tracking-tight sm:text-[2.7rem]">Animated Impact Matrix</h3>
                        <Waves className="text-cyan-300 animate-pulse" size={24} />
                    </div>
                    <p className="mt-3 text-xl leading-relaxed text-slate-200 sm:text-[1.7rem]">
                        Scroll to drive the data streams and watch system throughput accelerate.
                    </p>

                    <div className="matrix-grid mt-6 overflow-hidden rounded-[1.3rem] border border-white/10 bg-[#020b2e] p-3">
                        <div className="matrix-scan" />
                        <div className="matrix-stream matrix-stream-a" />
                        <div className="matrix-stream matrix-stream-b" />
                        <div className="matrix-stream matrix-stream-c" />
                        <div className="matrix-stream matrix-stream-d" />
                        <span className="matrix-node matrix-node-a" style={{ left: "34%", top: "62%" }} />
                        <span className="matrix-node matrix-node-b" style={{ left: "58%", top: "24%" }} />
                        <span className="matrix-node matrix-node-c" style={{ left: "80%", top: "47%" }} />
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4 rounded-[1.3rem] border border-white/10 bg-white/5 p-5">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.30em] text-slate-300">Cycle Complete</p>
                            <p className="mt-2 text-5xl font-black leading-none sm:text-[4.4rem]">56%</p>
                        </div>
                        <div
                            className="matrix-ring h-28 w-28 rounded-full p-2 sm:h-32 sm:w-32"
                            style={{
                                background: "conic-gradient(rgb(52 211 153) 56%, rgba(148,163,184,0.25) 56% 100%)"
                            }}
                        >
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#020b2e] text-4xl font-black text-emerald-300 sm:text-5xl">
                                56
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Everything you need */}
            <section className="mt-24 rounded-3xl border border-slate-200/50 bg-white/80 p-10 shadow-soft backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80 dark:shadow-soft-dark">
                <div className="text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Everything You Need</h2>
                    <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
                        Comprehensive features to make waste management effortless
                    </p>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f, idx) => {
                        const Icon = f.icon;
                        return (
                            <div
                                key={f.title}
                                className={[
                                    "group rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft dark:bg-slate-950",
                                    f.highlight
                                        ? "border-brand-300 ring-2 ring-brand-200/50 dark:border-brand-700/50 dark:ring-brand-700/30"
                                        : "border-slate-200 dark:border-slate-800"
                                ].join(" ")}
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`rounded-2xl bg-brand-50 p-3 ${f.color} dark:bg-slate-900 transition-transform group-hover:scale-110`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{f.desc}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* How it works */}
            <section className="mt-24 text-center">
                <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">How It Works</h2>
                <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">Simple steps to get started</p>

                <div className="mt-12 grid gap-10 sm:grid-cols-3">
                    {[
                        { n: "1", title: "Sign Up", desc: "Create your account in minutes" },
                        { n: "2", title: "Set Preferences", desc: "Choose your alert settings and schedule" },
                        { n: "3", title: "Stay Updated", desc: "Get timely notifications and never miss a pickup" }
                    ].map((s, idx) => (
                        <div
                            key={s.n}
                            className="mx-auto max-w-xs animate-scale-in"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-2xl font-bold text-white shadow-soft transition-transform hover:scale-110">
                                {s.n}
                            </div>
                            <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">{s.title}</h3>
                            <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="mt-24 rounded-3xl border border-brand-200/50 bg-gradient-to-br from-brand-50 to-brand-100/50 p-12 text-center shadow-soft dark:border-brand-800/50 dark:from-brand-900/30 dark:to-brand-800/20">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Ready to Get Started?
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                    Join thousands of users managing their waste efficiently
                </p>
                <Link
                    href="/register"
                    className="mt-8 inline-block rounded-xl bg-brand-500 px-8 py-4 text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-glow hover:scale-105"
                >
                    Create Your Account Now
                </Link>
            </section>

            <style jsx>{`
                .stability-shell {
                    animation: sectionFloat 4.4s ease-in-out infinite;
                }

                .matrix-shell {
                    animation: sectionFloat 5.1s ease-in-out infinite reverse;
                }

                .pulse-bar {
                    transform-origin: bottom center;
                    animation: pulseBar 1.85s cubic-bezier(0.28, 0.84, 0.42, 1) infinite;
                    will-change: transform, filter;
                }

                .pulse-line {
                    stroke-dasharray: 1400;
                    stroke-dashoffset: 0;
                    filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.48));
                    animation: lineFlow 2.8s ease-in-out infinite;
                }

                .pulse-tail {
                    animation: tailBlink 2s ease-in-out infinite;
                }

                .pulse-dot {
                    animation: dotPop 1.5s ease-in-out infinite;
                }

                .matrix-grid {
                    position: relative;
                    height: 240px;
                    background-image:
                        linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(148, 163, 184, 0.12) 1px, transparent 1px);
                    background-size: 38px 38px;
                    border-radius: 1.5rem;
                    overflow: hidden;
                    animation: gridJitter 3.6s linear infinite;
                }

                .matrix-scan {
                    position: absolute;
                    inset: -20%;
                    background: linear-gradient(
                        114deg,
                        transparent 42%,
                        rgba(45, 212, 191, 0.2) 51%,
                        transparent 60%
                    );
                    transform: translateX(-50%);
                    animation: scanSweep 2.6s linear infinite;
                }

                .matrix-stream {
                    position: absolute;
                    height: 3px;
                    border-radius: 9999px;
                    background: linear-gradient(90deg, rgba(20, 184, 166, 0), rgba(45, 212, 191, 0.9), rgba(20, 184, 166, 0));
                    filter: drop-shadow(0 0 8px rgba(20, 184, 166, 0.75));
                    animation: streamMove 2.1s ease-in-out infinite;
                    will-change: transform, opacity, filter;
                }

                .matrix-stream-a {
                    left: -8%;
                    top: 30%;
                    width: 44%;
                }

                .matrix-stream-b {
                    left: 18%;
                    top: 57%;
                    width: 50%;
                    animation-delay: -1.4s;
                }

                .matrix-stream-c {
                    right: -4%;
                    top: 18%;
                    width: 40%;
                    animation-delay: -0.8s;
                }

                .matrix-stream-d {
                    left: -12%;
                    top: 72%;
                    width: 54%;
                    animation-delay: -1.1s;
                }

                .matrix-node {
                    position: absolute;
                    transform: translate(-50%, -50%);
                    width: 18px;
                    height: 18px;
                    border-radius: 9999px;
                    background: rgb(45 212 191);
                    box-shadow:
                        0 0 0 10px rgba(45, 212, 191, 0.22),
                        0 0 22px rgba(45, 212, 191, 0.8);
                    animation: nodePulse 1.1s ease-in-out infinite;
                    will-change: transform, filter;
                }

                .matrix-node-a {
                    animation-delay: -0.2s;
                }

                .matrix-node-b {
                    animation-delay: -0.7s;
                }

                .matrix-node-c {
                    animation-delay: -1.1s;
                }

                .matrix-ring {
                    box-shadow: inset 0 0 0 2px rgba(148, 163, 184, 0.2);
                    animation: ringSpin 5.5s linear infinite;
                    will-change: transform, filter;
                }

                @keyframes pulseBar {
                    0%, 100% {
                        transform: translateY(0) scaleY(0.94);
                        filter: saturate(0.95) brightness(0.95);
                    }
                    45% {
                        transform: translateY(-16px) scaleY(1.18);
                        filter: saturate(1.42) brightness(1.2);
                    }
                    72% {
                        transform: translateY(-6px) scaleY(1.06);
                    }
                }

                @keyframes lineFlow {
                    0%, 100% {
                        stroke-dashoffset: 0;
                    }
                    50% {
                        stroke-dashoffset: -180;
                    }
                }

                @keyframes tailBlink {
                    0%, 100% {
                        opacity: 0.45;
                    }
                    50% {
                        opacity: 1;
                    }
                }

                @keyframes dotPop {
                    0%, 100% {
                        transform: scale(0.92);
                        filter: drop-shadow(0 0 0 rgba(16, 185, 129, 0));
                    }
                    50% {
                        transform: scale(1.22);
                        filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.6));
                    }
                }

                @keyframes streamMove {
                    0%, 100% {
                        transform: translateX(-28px) scaleX(0.84);
                        opacity: 0.5;
                        filter: blur(0px);
                    }
                    50% {
                        transform: translateX(28px) scaleX(1.2);
                        opacity: 1;
                        filter: blur(1px);
                    }
                }

                @keyframes nodePulse {
                    0%, 100% {
                        transform: translate(-50%, -50%) scale(0.85);
                        filter: brightness(0.85);
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.35);
                        filter: brightness(1.25);
                    }
                }

                @keyframes gridJitter {
                    0%, 100% {
                        background-position: 0 0, 0 0;
                    }
                    50% {
                        background-position: 7px -10px, -6px 9px;
                    }
                }

                @keyframes scanSweep {
                    0% {
                        transform: translateX(-62%) rotate(5deg);
                    }
                    100% {
                        transform: translateX(62%) rotate(5deg);
                    }
                }

                @keyframes ringSpin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                @keyframes sectionFloat {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-7px);
                    }
                }

                @media (max-width: 1024px) {
                    .matrix-grid {
                        height: 220px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .pulse-bar,
                    .matrix-stream,
                    .matrix-node {
                        animation: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
