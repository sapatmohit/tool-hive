/**
 * models/User.ts — Mongoose schema & model for User documents.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    /** Stable string identifier (e.g. "user-001") preserved from the JSON seed */
    userId: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    location: string;
    rating: number;
    reviewCount: number;
    bio: string;
    memberSince: string;
    toolsListed: number;
    toolsBorrowed: number;
}

const UserSchema = new Schema<IUser>(
    {
        userId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String, default: "" },
        location: { type: String, default: "" },
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        bio: { type: String, default: "" },
        memberSince: {
            type: String,
            default: () => new Date().toISOString().split("T")[0],
        },
        toolsListed: { type: Number, default: 0 },
        toolsBorrowed: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Prevent model re-registration during Next.js hot-reload
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
