"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/lib/auth-context";

export type UserRole = "resident" | "admin";

const ROLE_OVERRIDE_KEY = "ka_role_override";

export function useRole() {
  const { user } = useAuth();
  const actualRole = useMemo<UserRole>(() => {
    if (user?.accountType === "admin_driver") return "admin";
    return "resident";
  }, [user]);
  const [roleOverride, setRoleOverride] = useState<UserRole | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(ROLE_OVERRIDE_KEY);
    if (stored === "admin" || stored === "resident") {
      setRoleOverride(stored);
    }
  }, []);

  useEffect(() => {
    if (actualRole !== "admin" && roleOverride) {
      setRoleOverride(null);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(ROLE_OVERRIDE_KEY);
      }
    }
  }, [actualRole, roleOverride]);

  const setRole = useCallback(
    (next: UserRole) => {
      if (actualRole !== "admin") return;
      setRoleOverride(next);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(ROLE_OVERRIDE_KEY, next);
      }
    },
    [actualRole]
  );

  const role = roleOverride ?? actualRole;

  return { role, actualRole, setRole };
}
