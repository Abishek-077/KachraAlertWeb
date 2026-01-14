"use client";

import { useMemo } from "react";
import { useAuth } from "@/app/lib/auth-context";

export type UserRole = "resident" | "admin";

export function useRole() {
  const { user } = useAuth();

  const role = useMemo<UserRole>(() => {
    if (user?.accountType === "admin_driver") return "admin";
    return "resident";
  }, [user]);

  return { role };
}
