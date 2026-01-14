"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiPost, setAccessToken } from "./api";

export type AuthUser = {
  id: string;
  accountType: "resident" | "admin_driver";
  name: string;
  email: string;
  phone: string;
  society: string;
  building: string;
  apartment: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (payload: { email: string; password: string; remember?: boolean }) => Promise<AuthUser>;
  register: (payload: {
    accountType: "resident" | "admin_driver";
    name: string;
    email: string;
    phone: string;
    password: string;
    society: string;
    building: string;
    apartment: string;
    terms: boolean;
  }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setToken = useCallback((token: string | null) => {
    setAccessToken(token);
    setAccessTokenState(token);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const response = await apiPost<{ accessToken: string | null; user: AuthUser | null }>("/api/v1/auth/refresh");
      if (response.data?.accessToken) {
        setToken(response.data.accessToken);
      } else {
        setToken(null);
      }
      setUser(response.data?.user ?? null);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setToken]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (payload: { email: string; password: string; remember?: boolean }) => {
      const response = await apiPost<{ accessToken: string; user: AuthUser }>("/api/v1/auth/login", payload);
      setToken(response.data.accessToken);
      setUser(response.data.user);
      return response.data.user;
    },
    [setToken]
  );

  const register = useCallback(
    async (payload: {
      accountType: "resident" | "admin_driver";
      name: string;
      email: string;
      phone: string;
      password: string;
      society: string;
      building: string;
      apartment: string;
      terms: boolean;
    }) => {
      const response = await apiPost<{ accessToken: string; user: AuthUser }>("/api/v1/auth/register", payload);
      setToken(response.data.accessToken);
      setUser(response.data.user);
      return response.data.user;
    },
    [setToken]
  );

  const logout = useCallback(async () => {
    try {
      await apiPost("/api/v1/auth/logout");
    } finally {
      setToken(null);
      setUser(null);
    }
  }, [setToken]);

  const value = useMemo(
    () => ({
      user,
      accessToken: accessTokenState,
      loading,
      login,
      register,
      logout,
      refresh
    }),
    [user, accessTokenState, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
