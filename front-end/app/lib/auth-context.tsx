"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiPost, setAccessToken } from "./api";

const AUTH_TOKEN_COOKIE = "ka_access_token";
const AUTH_USER_COOKIE = "ka_user";
const AUTH_REMEMBER_COOKIE = "ka_remember";
const REMEMBER_MAX_AGE_DAYS = 30;

type CookieOptions = {
  maxAgeDays?: number;
};

function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (typeof document === "undefined") return;
  const encodedValue = encodeURIComponent(value);
  let cookie = `${name}=${encodedValue}; Path=/; SameSite=Lax`;
  if (options.maxAgeDays) {
    const maxAgeSeconds = options.maxAgeDays * 24 * 60 * 60;
    cookie += `; Max-Age=${maxAgeSeconds}`;
  }
  document.cookie = cookie;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0`;
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.trim().split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}

function persistAuthCookies({
  token,
  user,
  remember
}: {
  token: string;
  user: AuthUser;
  remember: boolean;
}) {
  const options = remember ? { maxAgeDays: REMEMBER_MAX_AGE_DAYS } : {};
  setCookie(AUTH_TOKEN_COOKIE, token, options);
  setCookie(AUTH_USER_COOKIE, JSON.stringify(user), options);
  setCookie(AUTH_REMEMBER_COOKIE, remember ? "true" : "false", options);
}

function clearAuthCookies() {
  deleteCookie(AUTH_TOKEN_COOKIE);
  deleteCookie(AUTH_USER_COOKIE);
  deleteCookie(AUTH_REMEMBER_COOKIE);
}

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
      if (response.data?.accessToken && response.data.user) {
        setToken(response.data.accessToken);
        setUser(response.data.user);
        const rememberCookie = getCookie(AUTH_REMEMBER_COOKIE);
        const remember = rememberCookie === "true";
        persistAuthCookies({ token: response.data.accessToken, user: response.data.user, remember });
      } else {
        setToken(null);
        setUser(null);
        clearAuthCookies();
      }
    } catch {
      const cookieToken = getCookie(AUTH_TOKEN_COOKIE);
      const cookieUser = getCookie(AUTH_USER_COOKIE);
      if (cookieToken && cookieUser) {
        try {
          const parsedUser = JSON.parse(cookieUser) as AuthUser;
          setToken(cookieToken);
          setUser(parsedUser);
        } catch {
          setToken(null);
          setUser(null);
          clearAuthCookies();
        }
      } else {
        setToken(null);
        setUser(null);
      }
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
      persistAuthCookies({
        token: response.data.accessToken,
        user: response.data.user,
        remember: Boolean(payload.remember)
      });
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
      persistAuthCookies({
        token: response.data.accessToken,
        user: response.data.user,
        remember: true
      });
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
      clearAuthCookies();
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
