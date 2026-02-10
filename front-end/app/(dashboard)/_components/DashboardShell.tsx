import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-theme motion-swipe-track relative min-h-screen overflow-x-hidden bg-slate-50 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-16 top-20 h-56 w-56 rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-900/25" />
        <div className="absolute -right-14 top-1/2 h-52 w-52 rounded-full bg-cyan-200/35 blur-3xl dark:bg-cyan-900/25" />
      </div>
      <div className="relative z-10 flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="mx-auto max-w-6xl px-6 py-6 motion-reveal-target">{children}</main>
        </div>
      </div>
    </div>
  );
}
