import Link from "next/link";
import { Leaf } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 mx-auto max-w-6xl px-4 pt-6">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/50 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80">
                <Link 
                    href="/" 
                    className="flex items-center gap-3 transition-transform hover:scale-105"
                >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-soft transition-transform hover:scale-110">
                        <Leaf size={20} />
                    </span>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">KacharaAlert</span>
                </Link>

                <nav className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/about"
                        className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                        About
                    </Link>
                    <Link
                        href="/login"
                        className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-soft hover:scale-105"
                    >
                        Get Started
                    </Link>
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}
