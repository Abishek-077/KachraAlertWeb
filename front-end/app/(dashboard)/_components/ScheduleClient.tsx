"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { CalendarDays, Clock, Filter } from "lucide-react";

import type { ScheduleItem, WasteType } from "../../../lib/types";
import Badge from "./Badge";
import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";
import Input from "./Input";
import { apiDelete, apiGet, apiPatch, apiPost, type ApiError } from "@/app/lib/api";

type ScheduleApi = {
  id: string;
  dateISO: string;
  timeLabel: string;
  waste: WasteType;
  status: ScheduleItem["status"];
};

const statusTone: Record<ScheduleItem["status"], "emerald" | "amber" | "red"> = {
  Upcoming: "amber",
  Completed: "emerald",
  Missed: "red"
};

const wasteOptions: WasteType[] = ["Biodegradable", "Dry Waste", "Plastic", "Glass", "Metal"];
const statusOptions: ScheduleItem["status"][] = ["Upcoming", "Completed", "Missed"];

export default function ScheduleClient() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [waste, setWaste] = useState<WasteType>("Biodegradable");
  const [status, setStatus] = useState<ScheduleItem["status"]>("Upcoming");
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [scheduleUnavailable, setScheduleUnavailable] = useState(false);

  useEffect(() => {
    const isNotFound = (error: unknown) => (error as ApiError | undefined)?.status === 404;

    const loadSchedule = async () => {
      try {
        const response = await apiGet<ScheduleApi[]>("/api/v1/schedules");
        const mapped =
          response.data?.map((item) => ({
            id: item.id,
            dateISO: item.dateISO,
            timeLabel: item.timeLabel,
            waste: item.waste,
            status: item.status
          })) ?? [];
        setItems(mapped);
      } catch (error) {
        if (isNotFound(error)) {
          setItems([]);
          setScheduleUnavailable(true);
          return;
        }
        console.error(error);
      }
    };
    loadSchedule();
  }, []);

  const days = useMemo(() => {
    const start = new Date();
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>();
    items.forEach((item) => {
      const key = format(new Date(item.dateISO), "yyyy-MM-dd");
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    });
    return map;
  }, [items]);

  const todayKey = format(new Date(), "yyyy-MM-dd");
  const todaysItems = grouped.get(todayKey) ?? [];

  const canSubmit = date && time && !submitting && !scheduleUnavailable;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Collection schedule"
          subtitle="Weekly overview and upcoming pickups"
          right={
            <div className="flex items-center gap-2">
              <Button variant="secondary">
                <Filter size={16} /> Filters
              </Button>
              <Button>
                <CalendarDays size={16} /> Add reminder
              </Button>
            </div>
          }
        />
        <CardBody>
          {scheduleUnavailable ? (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              The schedules API is not available yet. Configure the backend to enable schedule updates.
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {days.map((d) => {
              const dayKey = format(d, "yyyy-MM-dd");
              const dayItems = grouped.get(dayKey) ?? [];
              return (
                <div key={d.toISOString()} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold text-slate-500">{format(d, "EEE")}</div>
                  <div className="mt-1 text-lg font-extrabold">{format(d, "d")}</div>
                  <div className="mt-3 space-y-2">
                    {dayItems.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 px-3 py-2 text-xs text-slate-500">
                        No pickups scheduled
                      </div>
                    ) : (
                      dayItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                        >
                          <div className="text-xs font-semibold text-slate-600">{item.waste}</div>
                          <div className="mt-1 inline-flex items-center gap-2 text-xs text-slate-600">
                            <Clock size={14} className="text-slate-600" /> {item.timeLabel}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Add schedule" subtitle="Create or adjust pickup entries" />
        <CardBody>
          <div className="grid gap-3 md:grid-cols-4">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-emerald-500/20"
              value={waste}
              onChange={(e) => setWaste(e.target.value as WasteType)}
            >
              {wasteOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-emerald-500/20"
              value={status}
              onChange={(e) => setStatus(e.target.value as ScheduleItem["status"])}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <Button
              onClick={async () => {
                if (scheduleUnavailable) return;
                if (!canSubmit) return;
                setSubmitting(true);
                try {
                  const dateValue = new Date(`${date}T${time}`);
                  const payload = {
                    dateISO: dateValue.toISOString(),
                    timeLabel: format(dateValue, "p"),
                    waste,
                    status
                  };
                  const response = await apiPost<ScheduleApi>("/api/v1/schedules", payload);
                  if (response.data) {
                    setItems((prev) => [
                      {
                        id: response.data.id,
                        dateISO: response.data.dateISO,
                        timeLabel: response.data.timeLabel,
                        waste: response.data.waste,
                        status: response.data.status
                      },
                      ...prev
                    ]);
                  }
                  setDate("");
                  setTime("");
                  setWaste("Biodegradable");
                  setStatus("Upcoming");
                } catch (error) {
                  if ((error as ApiError | undefined)?.status === 404) {
                    setScheduleUnavailable(true);
                    return;
                  }
                  console.error(error);
                } finally {
                  setSubmitting(false);
                }
              }}
              disabled={!canSubmit}
            >
              Add schedule
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Today" subtitle="Detailed list" />
        <CardBody>
          <div className="space-y-3">
            {todaysItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4"
              >
                <div>
                  <div className="font-extrabold">{item.waste}</div>
                  <div className="text-sm text-slate-500">{item.timeLabel}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={statusTone[item.status]}>{item.status}</Badge>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      if (scheduleUnavailable) return;
                      if (updatingId) return;
                      setUpdatingId(item.id);
                      try {
                        const nextStatus = item.status === "Completed" ? "Upcoming" : "Completed";
                        await apiPatch(`/api/v1/schedules/${item.id}`, { status: nextStatus });
                        setItems((prev) =>
                          prev.map((entry) => (entry.id === item.id ? { ...entry, status: nextStatus } : entry))
                        );
                      } catch (error) {
                        if ((error as ApiError | undefined)?.status === 404) {
                          setScheduleUnavailable(true);
                          return;
                        }
                        console.error(error);
                      } finally {
                        setUpdatingId(null);
                      }
                    }}
                    disabled={updatingId === item.id || scheduleUnavailable}
                  >
                    {item.status === "Completed" ? "Undo" : "Complete"}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={async () => {
                      if (scheduleUnavailable) return;
                      if (deletingId) return;
                      setDeletingId(item.id);
                      try {
                        await apiDelete(`/api/v1/schedules/${item.id}`);
                        setItems((prev) => prev.filter((entry) => entry.id !== item.id));
                      } catch (error) {
                        if ((error as ApiError | undefined)?.status === 404) {
                          setScheduleUnavailable(true);
                          return;
                        }
                        console.error(error);
                      } finally {
                        setDeletingId(null);
                      }
                    }}
                    disabled={deletingId === item.id || scheduleUnavailable}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            {todaysItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
                No pickups scheduled for today.
              </div>
            ) : null}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
