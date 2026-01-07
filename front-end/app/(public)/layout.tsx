import Header from "./_components/Header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen kachra-bg bg-slate-50 dark:bg-slate-950">
            <Header />
            <main className="mx-auto max-w-6xl px-4 pb-20 pt-8">{children}</main>
        </div>
    );
}
