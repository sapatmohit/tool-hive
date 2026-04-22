/**
 * models/Tool.ts — Mongoose schema & model for Tool documents.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITool extends Document {
    _id: mongoose.Types.ObjectId;
    /** Stable string identifier (e.g. "tool-001") preserved from the JSON seed */
    toolId: string;
    name: string;
    description: string;
    category: string;
    location: string;
    availability: boolean;
    /** toolId of the owning User */
    ownerId: string;
    pricePerDay: number;
    image: string;
    rating: number;
    reviewCount: number;
}

const ToolSchema = new Schema<ITool>(
    {
        toolId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        location: { type: String, required: true },
        availability: { type: Boolean, default: true },
        ownerId: { type: String, required: true },
        pricePerDay: { type: Number, required: true },
        image: { type: String, default: "" },
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Prevent model re-registration during Next.js hot-reload
const Tool: Model<ITool> =
    mongoose.models.Tool || mongoose.model<ITool>("Tool", ToolSchema);

export default Tool;
