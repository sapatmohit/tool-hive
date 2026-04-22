/**
 * models/Review.ts — Mongoose schema & model for Review documents.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
    _id: mongoose.Types.ObjectId;
    reviewId: string;
    targetId: string;
    targetType: "tool" | "user";
    authorId: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        reviewId: { type: String, required: true, unique: true },
        targetId: { type: String, required: true },
        targetType: { type: String, enum: ["tool", "user"], required: true },
        authorId: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: "" },
    },
    { timestamps: true }
);

const Review: Model<IReview> =
    mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
