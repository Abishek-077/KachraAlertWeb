import Link from "next/link";
import {
    Bell,
    CalendarDays,
    CreditCard,
    ShieldCheck,
    Clock,
    CheckCircle2,
    Leaf,
    Sparkles,
    ArrowRight
} from "lucide-react";

const features = [
    { icon: Bell, title: "Smart Alerts", desc: "Never miss a collection with timely notifications", color: "text-blue-600 dark:text-blue-400" },
    { icon: CalendarDays, title: "Digital Schedule", desc: "View and manage collection schedules easily", color: "text-purple-600 dark:text-purple-400" },
    { icon: CreditCard, title: "Easy Payments", desc: "Pay your waste management fees digitally", color: "text-green-600 dark:text-green-400" },
    { icon: ShieldCheck, title: "Report Issues", desc: "Quickly report missed pickups or problems", highlight: true, color: "text-brand-600 dark:text-brand-400" },
    { icon: Clock, title: "Real-time Updates", desc: "Get instant updates on collection status", color: "text-orange-600 dark:text-orange-400" },
    { icon: CheckCircle2, title: "Track History", desc: "Monitor your waste management history", color: "text-indigo-600 dark:text-indigo-400" }
];

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
                        { n: "1", title: "Sign Up", desc: "Create your account in minutes", icon: "✨" },
                        { n: "2", title: "Set Preferences", desc: "Choose your alert settings and schedule", icon: "⚙️" },
                        { n: "3", title: "Stay Updated", desc: "Get timely notifications and never miss a pickup", icon: "🔔" }
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
        </div>
    );
}
