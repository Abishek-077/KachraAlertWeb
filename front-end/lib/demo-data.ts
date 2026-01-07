import type { AlertItem, InvoiceItem, ReportItem, ScheduleItem } from "./types";

export const scheduleToday: ScheduleItem[] = [
  {
    id: "sch_1",
    dateISO: new Date().toISOString(),
    timeLabel: "5:00 PM",
    waste: "Biodegradable",
    status: "Upcoming",
  },
  {
    id: "sch_2",
    dateISO: new Date().toISOString(),
    timeLabel: "8:00 PM",
    waste: "Dry Waste",
    status: "Upcoming",
  },
];

export const alerts: AlertItem[] = [
  {
    id: "al_1",
    title: "Collection delayed",
    body: "Truck is running 30 minutes late in your area.",
    createdISO: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    severity: "warning",
    read: false,
  },
  {
    id: "al_2",
    title: "Payment received",
    body: "Your monthly waste management fee has been marked as paid.",
    createdISO: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    severity: "info",
    read: true,
  },
  {
    id: "al_3",
    title: "Urgent: Road blockage",
    body: "Alternate route in use. Keep waste ready by 6:30 PM.",
    createdISO: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    severity: "urgent",
    read: false,
  },
];

export const reports: ReportItem[] = [
  {
    id: "rp_1",
    title: "Missed pickup yesterday",
    category: "Missed Pickup",
    createdISO: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "In Progress",
    priority: "High",
  },
  {
    id: "rp_2",
    title: "Overflow near gate",
    category: "Overflow",
    createdISO: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Open",
    priority: "Medium",
  },
  {
    id: "rp_3",
    title: "Wrong amount charged",
    category: "Payment",
    createdISO: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Resolved",
    priority: "Low",
  },
];

export const invoices: InvoiceItem[] = [
  {
    id: "inv_2026_01",
    period: "Jan 2026",
    amountNPR: 250,
    status: "Due",
    issuedISO: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "inv_2025_12",
    period: "Dec 2025",
    amountNPR: 250,
    status: "Paid",
    issuedISO: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "inv_2025_11",
    period: "Nov 2025",
    amountNPR: 250,
    status: "Paid",
    issuedISO: new Date(Date.now() - 68 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const weeklyPickups = [
  { day: "Mon", count: 2 },
  { day: "Tue", count: 1 },
  { day: "Wed", count: 2 },
  { day: "Thu", count: 1 },
  { day: "Fri", count: 2 },
  { day: "Sat", count: 3 },
  { day: "Sun", count: 1 },
];
