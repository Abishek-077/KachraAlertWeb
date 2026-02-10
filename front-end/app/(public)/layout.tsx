import Header from "./_components/Header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="motion-swipe-track relative min-h-screen overflow-x-hidden kachra-bg bg-slate-50 dark:bg-slate-950">
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute -left-16 top-24 h-64 w-64 rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-900/25" />
                <div className="absolute -right-20 top-2/3 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-900/20" />
            </div>
            <Header />
            <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-8 motion-reveal-target">{children}</main>
        </div>
    );
}
