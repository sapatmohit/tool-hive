/**
 * models/Notification.ts — Mongoose schema & model for Notifications.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
    _id: mongoose.Types.ObjectId;
    notificationId: string;
    userId: string;
    type: "request" | "message" | "system";
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        notificationId: { type: String, required: true, unique: true },
        userId: { type: String, required: true },
        type: { type: String, enum: ["request", "message", "system"], required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        link: { type: String },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Notification: Model<INotification> =
    mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
