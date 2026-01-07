import Link from "next/link";
import { Leaf, Target, Users, Zap, Shield, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="pt-16 animate-fade-in">
            {/* Hero Section */}
            <section className="mx-auto max-w-4xl text-center animate-slide-up">
                <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-soft">
                    <Leaf size={28} />
                </div>
                <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                    About <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">KacharaAlert</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
                    KacharaAlert helps communities stay on top of waste collection schedules with smart alerts,
                    reporting, and simple management tools. Built for clarity, speed, and a clean user experience.
                </p>
            </section>

            {/* Mission Section */}
            <section className="mt-16 rounded-3xl border border-slate-200/50 bg-white/80 p-10 shadow-soft backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80 dark:shadow-soft-dark">
                <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-brand-50 p-4 text-brand-600 dark:bg-slate-900 dark:text-brand-400">
                        <Target size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
                        <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                            To revolutionize waste management by making it effortless, transparent, and accessible for everyone.
                            We believe that technology can bridge the gap between communities and efficient waste collection services.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="mt-12">
                <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Our Values</h2>
                <div className="mt-10 grid gap-6 sm:grid-cols-3">
                    {[
                        { icon: Zap, title: "Efficiency", desc: "Streamlined processes for maximum productivity" },
                        { icon: Shield, title: "Reliability", desc: "Trustworthy service you can count on" },
                        { icon: Heart, title: "Community", desc: "Building stronger, cleaner neighborhoods" }
                    ].map((v, idx) => {
                        const Icon = v.icon;
                        return (
                            <div
                                key={v.title}
                                className="rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-soft dark:border-slate-800/50 dark:bg-slate-900/80"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="rounded-2xl bg-brand-50 p-3 text-brand-600 dark:bg-slate-900 dark:text-brand-400 w-fit">
                                    <Icon size={20} />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{v.title}</h3>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{v.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="mt-16 rounded-3xl border border-brand-200/50 bg-gradient-to-br from-brand-50 to-brand-100/50 p-12 text-center shadow-soft dark:border-brand-800/50 dark:from-brand-900/30 dark:to-brand-800/20">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-sm">
                    <Users size={24} />
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Join Our Community
                </h2>
                <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
                    Be part of the movement towards smarter waste management
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/register"
                        className="rounded-xl bg-brand-500 px-8 py-4 text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-glow hover:scale-105"
                    >
                        Get Started
                    </Link>
                    <Link
                        href="/login"
                        className="rounded-xl border-2 border-slate-200 bg-white/80 px-8 py-4 text-base font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        Sign In
                    </Link>
                </div>
            </section>
        </div>
    );
}

