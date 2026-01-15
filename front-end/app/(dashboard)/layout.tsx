import type { ReactNode } from "react";

import DashboardShell from "./_components/DashboardShell";
import AuthGuard from "./_components/AuthGuard";
import { AlertsProvider } from "../lib/alerts-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AlertsProvider>
        <DashboardShell>{children}</DashboardShell>
      </AlertsProvider>
    </AuthGuard>
  );
}
