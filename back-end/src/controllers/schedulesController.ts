import type { Response, NextFunction } from "express";
import { Schedule, type ScheduleDocument } from "../models/Schedule.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../utils/errors.js";
import type { AuthRequest } from "../middleware/auth.js";

function mapSchedule(schedule: ScheduleDocument) {
  return {
    id: schedule._id.toString(),
    dateISO: schedule.dateISO.toISOString(),
    timeLabel: schedule.timeLabel,
    waste: schedule.waste,
    status: schedule.status
  };
}

export async function listSchedules(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const filter = req.user!.accountType === "admin_driver" ? {} : { createdBy: req.user!.id };
    const schedules = await Schedule.find(filter).sort({ dateISO: 1, timeLabel: 1 });
    return sendSuccess(res, "Schedules loaded", schedules.map(mapSchedule));
  } catch (err) {
    return next(err);
  }
}

export async function createSchedule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const schedule = await Schedule.create({
      dateISO: new Date(req.body.dateISO),
      timeLabel: req.body.timeLabel,
      waste: req.body.waste,
      status: req.body.status ?? "Upcoming",
      createdBy: req.user!.id
    });
    return sendSuccess(res, "Schedule created", mapSchedule(schedule));
  } catch (err) {
    return next(err);
  }
}

export async function updateSchedule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      throw new AppError("Schedule not found", 404, "NOT_FOUND");
    }
    if (req.user!.accountType !== "admin_driver" && schedule.createdBy.toString() !== req.user!.id) {
      throw new AppError("Not authorized", 403, "FORBIDDEN");
    }

    if (req.body.dateISO) {
      schedule.dateISO = new Date(req.body.dateISO);
    }
    if (req.body.timeLabel) {
      schedule.timeLabel = req.body.timeLabel;
    }
    if (req.body.waste) {
      schedule.waste = req.body.waste;
    }
    if (req.body.status) {
      schedule.status = req.body.status;
    }

    await schedule.save();
    return sendSuccess(res, "Schedule updated", mapSchedule(schedule));
  } catch (err) {
    return next(err);
  }
}

export async function deleteSchedule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      throw new AppError("Schedule not found", 404, "NOT_FOUND");
    }
    if (req.user!.accountType !== "admin_driver" && schedule.createdBy.toString() !== req.user!.id) {
      throw new AppError("Not authorized", 403, "FORBIDDEN");
    }
    await schedule.deleteOne();
    return sendSuccess(res, "Schedule deleted");
  } catch (err) {
    return next(err);
  }
}
