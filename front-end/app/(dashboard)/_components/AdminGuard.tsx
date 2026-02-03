"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "./useRole";
import { useAuth } from "@/app/lib/auth-context";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { actualRole } = useRole();
  const { loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && actualRole !== "admin") {
      router.replace("/dashboard");
    }
  }, [actualRole, loading, router]);

  if (loading || actualRole !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Checking admin access...
      </div>
    );
  }

  return <>{children}</>;
}
