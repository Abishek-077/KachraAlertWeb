import type { ReactNode } from "react";

import DashboardShell from "./_components/DashboardShell";
import AuthGuard from "./_components/AuthGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
