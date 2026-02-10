import mongoose, { Schema, type InferSchemaType } from "mongoose";

const serviceRatingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    score: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true, maxlength: 500, default: "" }
  },
  { timestamps: true }
);

export type ServiceRatingDocument = InferSchemaType<typeof serviceRatingSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ServiceRating = mongoose.model("ServiceRating", serviceRatingSchema);
