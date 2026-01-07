import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
