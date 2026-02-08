import type { ReactNode } from "react";
import AdminGuard from "../_components/AdminGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}
