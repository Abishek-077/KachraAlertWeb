import type { NextFunction, Response } from "express";
import { ServiceRating } from "../models/ServiceRating.js";
import { sendSuccess } from "../utils/response.js";
import type { AuthRequest } from "../middleware/auth.js";

function mapRating(rating: {
  _id: { toString: () => string };
  score: number;
  comment?: string;
  updatedAt: Date;
}) {
  return {
    id: rating._id.toString(),
    score: rating.score,
    comment: rating.comment ?? "",
    updatedAt: rating.updatedAt
  };
}

export async function getRatingSummary(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [stats, myRating] = await Promise.all([
      ServiceRating.aggregate<{
        _id: null;
        averageScore: number;
        totalRatings: number;
      }>([
        {
          $group: {
            _id: null,
            averageScore: { $avg: "$score" },
            totalRatings: { $sum: 1 }
          }
        }
      ]),
      ServiceRating.findOne({ userId: req.user!.id })
    ]);

    const totals = stats[0];
    return sendSuccess(res, "Service rating summary loaded", {
      averageScore: totals?.averageScore ? Number(totals.averageScore.toFixed(1)) : 0,
      totalRatings: totals?.totalRatings ?? 0,
      myRating: myRating ? mapRating(myRating) : null
    });
  } catch (err) {
    return next(err);
  }
}

export async function upsertMyRating(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const rating = await ServiceRating.findOneAndUpdate(
      { userId: req.user!.id },
      {
        score: req.body.score,
        comment: req.body.comment ?? ""
      },
      {
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    const [stats] = await ServiceRating.aggregate<{
      _id: null;
      averageScore: number;
      totalRatings: number;
    }>([
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$score" },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    return sendSuccess(res, "Service rating saved", {
      rating: rating ? mapRating(rating) : null,
      averageScore: stats?.averageScore ? Number(stats.averageScore.toFixed(1)) : 0,
      totalRatings: stats?.totalRatings ?? 0
    });
  } catch (err) {
    return next(err);
  }
}
