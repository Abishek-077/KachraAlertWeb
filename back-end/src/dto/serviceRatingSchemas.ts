import { z } from "zod";

export const upsertServiceRatingSchema = z.object({
  score: z.number().int().min(1, "Score must be between 1 and 5").max(5, "Score must be between 1 and 5"),
  comment: z.string().trim().max(500, "Comment must be 500 characters or fewer").optional().default("")
});
