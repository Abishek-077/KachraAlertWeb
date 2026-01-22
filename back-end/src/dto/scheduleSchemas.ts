import { z } from "zod";

const wasteEnum = z.enum(["Biodegradable", "Dry Waste", "Plastic", "Glass", "Metal"]);
const statusEnum = z.enum(["Upcoming", "Completed", "Missed"]);

export const createScheduleSchema = z.object({
  dateISO: z.string().datetime(),
  timeLabel: z.string().min(1, "Time label is required"),
  waste: wasteEnum,
  status: statusEnum.optional()
});

export const updateScheduleSchema = z
  .object({
    dateISO: z.string().datetime().optional(),
    timeLabel: z.string().min(1, "Time label is required").optional(),
    waste: wasteEnum.optional(),
    status: statusEnum.optional()
  })
  .refine((data) => data.dateISO || data.timeLabel || data.waste || data.status, {
    message: "Provide at least one field to update"
  });
