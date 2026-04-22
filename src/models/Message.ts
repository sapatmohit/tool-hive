/**
 * models/Message.ts — Mongoose schema & model for Chat messages.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
    _id: mongoose.Types.ObjectId;
    messageId: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        messageId: { type: String, required: true, unique: true },
        senderId: { type: String, required: true },
        receiverId: { type: String, required: true },
        content: { type: String, required: true },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Message: Model<IMessage> =
    mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
