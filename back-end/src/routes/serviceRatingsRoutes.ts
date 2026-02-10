import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { upsertServiceRatingSchema } from "../dto/serviceRatingSchemas.js";
import * as serviceRatingsController from "../controllers/serviceRatingsController.js";

const router = Router();

router.get("/summary", requireAuth, serviceRatingsController.getRatingSummary);
router.post("/", requireAuth, validateBody(upsertServiceRatingSchema), serviceRatingsController.upsertMyRating);

export default router;
