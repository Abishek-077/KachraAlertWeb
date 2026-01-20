"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { apiGet, apiPost, baseUrl } from "./api";
import { useAuth } from "./auth-context";
import type { AlertItem } from "../../lib/types";

type AlertApi = {
  id: string;
  title: string;
  body: string;
  severity: "info" | "warning" | "urgent";
  createdAt: string;
  read: boolean;
  target: string;
};

type AlertsContextValue = {
  alerts: AlertItem[];
  unreadCount: number;
  loading: boolean;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AlertsContext = createContext<AlertsContextValue | undefined>(undefined);

function formatAlert(alert: AlertApi): AlertItem {
  return {
    id: alert.id,
    title: alert.title,
    body: alert.body,
    severity: alert.severity,
    createdISO: alert.createdAt,
    read: alert.read
  };
}

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuth();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const refresh = useCallback(async () => {
    if (!accessToken) {
      setAlerts([]);
      setLoading(false);
      return;
    }
    try {
      const response = await apiGet<AlertApi[]>("/api/v1/alerts");
      setAlerts(response.data?.map(formatAlert) ?? []);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("alertSoundEnabled");
    if (stored === "true") {
      setSoundEnabled(true);
    }
  }, []);

  const playSound = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch {
      setNeedsUnlock(true);
    }
  }, []);

  const enableSound = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setSoundEnabled(true);
      setNeedsUnlock(false);
      window.localStorage.setItem("alertSoundEnabled", "true");
    } catch {
      setNeedsUnlock(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const socketEnabled = process.env.NEXT_PUBLIC_ENABLE_SOCKET === "true";
    if (!accessToken || !socketEnabled || !baseUrl) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socket = io(baseUrl, {
      auth: { token: accessToken },
      transports: ["websocket"]
    });
    socketRef.current = socket;

    socket.on("alerts:new", (payload: AlertApi) => {
      setAlerts((prev) => {
        if (prev.some((item) => item.id === payload.id)) return prev;
        return [formatAlert(payload), ...prev];
      });
      if (soundEnabled) {
        void playSound();
      } else {
        setNeedsUnlock(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken, playSound, soundEnabled]);

  const markRead = useCallback(async (id: string) => {
    await apiPost(`/api/v1/alerts/${id}/read`);
    setAlerts((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }, []);

  const markAllRead = useCallback(async () => {
    await apiPost("/api/v1/alerts/read-all");
    setAlerts((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const unreadCount = useMemo(() => alerts.filter((a) => !a.read).length, [alerts]);

  const value = useMemo(
    () => ({
      alerts,
      unreadCount,
      loading,
      markRead,
      markAllRead,
      refresh
    }),
    [alerts, unreadCount, loading, markRead, markAllRead, refresh]
  );

  const alertToneDataUri =
    "data:audio/wav;base64,UklGRmQGAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

  return (
    <AlertsContext.Provider value={value}>
      {children}
      <audio ref={audioRef} src={alertToneDataUri} preload="auto" />
      {needsUnlock ? (
        <div className="fixed bottom-4 right-4 z-50 rounded-2xl border border-amber-200 bg-white p-4 text-sm shadow-lg">
          <div className="font-semibold text-slate-900">Enable alert sound</div>
          <div className="mt-1 text-xs text-slate-500">
            Tap to allow urgent broadcast alerts to play a sound.
          </div>
          <button
            className="mt-2 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white"
            onClick={() => void enableSound()}
          >
            Enable alert sound
          </button>
        </div>
      ) : null}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error("useAlerts must be used within AlertsProvider");
  }
  return context;
}
