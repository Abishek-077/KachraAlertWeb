"use client";

import { useEffect, useState } from "react";

export type UserRole = "resident" | "admin";

const KEY = "kachraalert_role";

export function useRole() {
  const [role, setRoleState] = useState<UserRole>("resident");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY) as UserRole | null;
      if (saved === "resident" || saved === "admin") {
        setRoleState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setRole = (next: UserRole) => {
    setRoleState(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // ignore
    }
  };

  return { role, setRole };
}
