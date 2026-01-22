import { Router } from "express";
import * as schedulesController from "../controllers/schedulesController.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createScheduleSchema, updateScheduleSchema } from "../dto/scheduleSchemas.js";

const router = Router();

router.get("/", requireAuth, schedulesController.listSchedules);
router.post("/", requireAuth, validateBody(createScheduleSchema), schedulesController.createSchedule);
router.patch("/:id", requireAuth, validateBody(updateScheduleSchema), schedulesController.updateSchedule);
router.delete("/:id", requireAuth, schedulesController.deleteSchedule);

export default router;
