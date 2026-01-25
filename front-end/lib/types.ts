export type WasteType = "Biodegradable" | "Dry Waste" | "Plastic" | "Glass" | "Metal";

export type ScheduleItem = {
  id: string;
  dateISO: string;
  timeLabel: string;
  waste: WasteType;
  status: "Upcoming" | "Completed" | "Missed";
};

export type AlertItem = {
  id: string;
  title: string;
  body: string;
  createdISO: string;
  severity: "info" | "warning" | "urgent";
  read: boolean;
};

export type ReportItem = {
  id: string;
  title: string;
  category: "Missed Pickup" | "Overflow" | "Payment" | "Other";
  createdISO: string;
  status: "Open" | "In Progress" | "Resolved";
  priority: "Low" | "Medium" | "High";
  attachments?: {
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadedAt: string;
    url: string;
  }[];
};

export type InvoiceItem = {
  id: string;
  period: string;
  amountNPR: number;
  status: "Paid" | "Due" | "Overdue";
  issuedISO: string;
};
