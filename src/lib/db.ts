/**
 * db.ts — MongoDB/Mongoose data-access helpers.
 *
 * Mirrors the original JSON-file API so every API route can keep
 * the same call signatures with zero changes to the route layer.
 *
 * NOTE: All public IDs passed in/out use the string toolId / userId /
 * requestId fields, NOT the Mongo ObjectId, so the front-end contract
 * is preserved.
 */

import { connectToDatabase } from "./mongodb";
import ToolModel from "@/models/Tool";
import UserModel from "@/models/User";
import BorrowRequestModel from "@/models/BorrowRequest";
import type { Tool, User, BorrowRequest } from "@/types";

// ─── Collection → Model map ─────────────────────────────────────────────────

type CollectionName = "tools" | "users" | "requests";

// ─── Serialisation helpers ───────────────────────────────────────────────────

/** Convert a Mongoose Tool document → plain Tool (using toolId as "id"). */
function serializeTool(doc: InstanceType<typeof ToolModel>): Tool {
    const obj = doc.toObject({ versionKey: false });
    return {
        id: obj.toolId,
        name: obj.name,
        description: obj.description,
        category: obj.category,
        location: obj.location,
        availability: obj.availability,
        ownerId: obj.ownerId,
        pricePerDay: obj.pricePerDay,
        image: obj.image,
        rating: obj.rating,
        reviewCount: obj.reviewCount,
    };
}

/** Convert a Mongoose User document → plain User (using userId as "id"). */
function serializeUser(doc: InstanceType<typeof UserModel>): User {
    const obj = doc.toObject({ versionKey: false });
    return {
        id: obj.userId,
        name: obj.name,
        email: obj.email,
        password: obj.password,
        avatar: obj.avatar,
        location: obj.location,
        rating: obj.rating,
        reviewCount: obj.reviewCount,
        bio: obj.bio,
        memberSince: obj.memberSince,
    };
}

/** Convert a Mongoose BorrowRequest document → plain BorrowRequest. */
function serializeRequest(
    doc: InstanceType<typeof BorrowRequestModel>
): BorrowRequest {
    const obj = doc.toObject({ versionKey: false });
    return {
        id: obj.requestId,
        toolId: obj.toolId,
        requesterId: obj.requesterId,
        ownerId: obj.ownerId,
        startDate: obj.startDate,
        endDate: obj.endDate,
        message: obj.message,
        status: obj.status,
        createdAt: obj.createdAt
            ? new Date(obj.createdAt).toISOString()
            : new Date().toISOString(),
    };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function readData<T>(collection: CollectionName): Promise<T[]> {
    await connectToDatabase();
    if (collection === "tools") {
        const docs = await ToolModel.find({}).lean(false);
        return docs.map(serializeTool) as unknown as T[];
    }
    if (collection === "users") {
        const docs = await UserModel.find({}).lean(false);
        return docs.map(serializeUser) as unknown as T[];
    }
    if (collection === "requests") {
        const docs = await BorrowRequestModel.find({}).lean(false);
        return docs.map(serializeRequest) as unknown as T[];
    }
    return [];
}

export async function getItemById<T extends { id: string }>(
    collection: CollectionName,
    id: string
): Promise<T | null> {
    await connectToDatabase();
    if (collection === "tools") {
        const doc = await ToolModel.findOne({ toolId: id });
        return doc ? (serializeTool(doc) as unknown as T) : null;
    }
    if (collection === "users") {
        const doc = await UserModel.findOne({ userId: id });
        return doc ? (serializeUser(doc) as unknown as T) : null;
    }
    if (collection === "requests") {
        const doc = await BorrowRequestModel.findOne({ requestId: id });
        return doc ? (serializeRequest(doc) as unknown as T) : null;
    }
    return null;
}

export async function addItem<T extends { id: string }>(
    collection: CollectionName,
    item: T
): Promise<T> {
    await connectToDatabase();
    if (collection === "tools") {
        const toolItem = item as unknown as Tool;
        const doc = await ToolModel.create({
            toolId: toolItem.id,
            name: toolItem.name,
            description: toolItem.description,
            category: toolItem.category,
            location: toolItem.location,
            availability: toolItem.availability,
            ownerId: toolItem.ownerId,
            pricePerDay: toolItem.pricePerDay,
            image: toolItem.image,
            rating: toolItem.rating,
            reviewCount: toolItem.reviewCount,
        });
        return serializeTool(doc) as unknown as T;
    }
    if (collection === "users") {
        const userItem = item as unknown as User;
        const doc = await UserModel.create({
            userId: userItem.id,
            name: userItem.name,
            email: userItem.email,
            password: userItem.password,
            avatar: userItem.avatar,
            location: userItem.location,
            rating: userItem.rating,
            reviewCount: userItem.reviewCount,
            bio: userItem.bio,
            memberSince: userItem.memberSince,
        });
        return serializeUser(doc) as unknown as T;
    }
    if (collection === "requests") {
        const reqItem = item as unknown as BorrowRequest;
        const doc = await BorrowRequestModel.create({
            requestId: reqItem.id,
            toolId: reqItem.toolId,
            requesterId: reqItem.requesterId,
            ownerId: reqItem.ownerId,
            startDate: reqItem.startDate,
            endDate: reqItem.endDate,
            message: reqItem.message,
            status: reqItem.status,
        });
        return serializeRequest(doc) as unknown as T;
    }
    throw new Error(`Unknown collection: ${collection}`);
}

export async function updateItem<T extends { id: string }>(
    collection: CollectionName,
    id: string,
    updates: Partial<T>
): Promise<T | null> {
    await connectToDatabase();
    if (collection === "tools") {
        const { id: _id, ...rest } = updates as Partial<Tool> & { id?: string };
        const doc = await ToolModel.findOneAndUpdate(
            { toolId: id },
            { $set: rest },
            { new: true }
        );
        return doc ? (serializeTool(doc) as unknown as T) : null;
    }
    if (collection === "users") {
        const { id: _id, ...rest } = updates as Partial<User> & { id?: string };
        const doc = await UserModel.findOneAndUpdate(
            { userId: id },
            { $set: rest },
            { new: true }
        );
        return doc ? (serializeUser(doc) as unknown as T) : null;
    }
    if (collection === "requests") {
        const { id: _id, ...rest } = updates as Partial<BorrowRequest> & {
            id?: string;
        };
        const doc = await BorrowRequestModel.findOneAndUpdate(
            { requestId: id },
            { $set: rest },
            { new: true }
        );
        return doc ? (serializeRequest(doc) as unknown as T) : null;
    }
    return null;
}

export async function deleteItem(
    collection: CollectionName,
    id: string
): Promise<boolean> {
    await connectToDatabase();
    if (collection === "tools") {
        const result = await ToolModel.deleteOne({ toolId: id });
        return result.deletedCount > 0;
    }
    if (collection === "users") {
        const result = await UserModel.deleteOne({ userId: id });
        return result.deletedCount > 0;
    }
    if (collection === "requests") {
        const result = await BorrowRequestModel.deleteOne({ requestId: id });
        return result.deletedCount > 0;
    }
    return false;
}

/**
 * Find a user by email — used by login/auth flows.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
    await connectToDatabase();
    const doc = await UserModel.findOne({ email });
    return doc ? serializeUser(doc) : null;
}

/**
 * Find requests filtered by ownerId and/or requesterId.
 */
export async function findRequests(filters: {
    ownerId?: string;
    requesterId?: string;
}): Promise<BorrowRequest[]> {
    await connectToDatabase();
    const query: Record<string, string> = {};
    if (filters.ownerId) query.ownerId = filters.ownerId;
    if (filters.requesterId) query.requesterId = filters.requesterId;
    const docs = await BorrowRequestModel.find(query);
    return docs.map(serializeRequest);
}
