/**
 * models/BorrowRequest.ts — Mongoose schema & model for BorrowRequest documents.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export type RequestStatus = "pending" | "approved" | "rejected";

export interface IBorrowRequest extends Document {
    _id: mongoose.Types.ObjectId;
    /** Stable string identifier (e.g. "req-001") preserved from the JSON seed */
    requestId: string;
    toolId: string;
    requesterId: string;
    ownerId: string;
    startDate: string;
    endDate: string;
    message?: string;
    status: RequestStatus;
    securityDeposit?: {
        amount: number;
        status: "pending" | "held" | "released" | "claimed";
    };
    createdAt: Date;
}

const BorrowRequestSchema = new Schema<IBorrowRequest>(
    {
        requestId: { type: String, required: true, unique: true },
        toolId: { type: String, required: true },
        requesterId: { type: String, required: true },
        ownerId: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        message: { type: String, default: "" },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        securityDeposit: {
            amount: { type: Number, default: 0 },
            status: { type: String, enum: ["pending", "held", "released", "claimed"], default: "pending" }
        }
    },
    { timestamps: true }
);

// Prevent model re-registration during Next.js hot-reload
const BorrowRequest: Model<IBorrowRequest> =
    mongoose.models.BorrowRequest ||
    mongoose.model<IBorrowRequest>("BorrowRequest", BorrowRequestSchema);

export default BorrowRequest;
