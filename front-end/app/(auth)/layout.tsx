export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="motion-swipe-track relative min-h-screen overflow-hidden kachra-bg bg-slate-50 dark:bg-slate-950">
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-900/20" />
                <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl dark:bg-cyan-900/20" />
            </div>
            <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12 motion-reveal-target">
                {children}
            </div>
        </div>
    );
}
