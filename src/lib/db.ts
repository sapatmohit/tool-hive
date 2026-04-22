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
import ReviewModel from "@/models/Review";
import MessageModel from "@/models/Message";
import NotificationModel from "@/models/Notification";
import type { Tool, User, BorrowRequest, Review, Message, Notification } from "@/types";

// ─── Collection → Model map ─────────────────────────────────────────────────

type CollectionName = "tools" | "users" | "requests" | "reviews" | "messages" | "notifications";

const MODEL_MAP = {
    tools: ToolModel,
    users: UserModel,
    requests: BorrowRequestModel,
    reviews: ReviewModel,
    messages: MessageModel,
    notifications: NotificationModel,
};

// ─── Serialisation helpers ───────────────────────────────────────────────────

/** Convert a Mongoose Tool document → plain Tool (using toolId as "id"). */
function serializeTool(doc: any): Tool {
    const obj = doc.toObject ? doc.toObject({ versionKey: false }) : doc;
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
function serializeUser(doc: any): User {
    const obj = doc.toObject ? doc.toObject({ versionKey: false }) : doc;
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

function serializeRequest(doc: any): BorrowRequest {
    const obj = doc.toObject ? doc.toObject({ versionKey: false }) : doc;
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

/** Convert a Mongoose Review document → plain Review. */
function serializeReview(doc: any): Review {
    const obj = doc.toObject ? doc.toObject({ versionKey: false }) : doc;
    return {
        id: obj.reviewId,
        targetId: obj.targetId,
        targetType: obj.targetType,
        authorId: obj.authorId,
        rating: obj.rating,
        comment: obj.comment,
        createdAt: obj.createdAt
            ? new Date(obj.createdAt).toISOString()
            : new Date().toISOString(),
    };
}

/** Convert a Mongoose Message document → plain Message. */
function serializeMessage(doc: any): Message {
    const obj = doc.toObject ? doc.toObject({ versionKey: false }) : doc;
    return {
        id: obj.messageId,
        senderId: obj.senderId,
        receiverId: obj.receiverId,
        content: obj.content,
        read: obj.read,
        createdAt: obj.createdAt
            ? new Date(obj.createdAt).toISOString()
            : new Date().toISOString(),
    };
}

/** Convert a Mongoose Notification document → plain Notification. */
function serializeNotification(doc: any): Notification {
    const obj = doc.toObject ? doc.toObject({ versionKey: false }) : doc;
    return {
        id: obj.notificationId,
        userId: obj.userId,
        type: obj.type,
        title: obj.title,
        message: obj.message,
        link: obj.link,
        read: obj.read,
        createdAt: obj.createdAt
            ? new Date(obj.createdAt).toISOString()
            : new Date().toISOString(),
    };
}

function serialize(collection: CollectionName, doc: any) {
    if (!doc) return null;
    switch (collection) {
        case "tools": return serializeTool(doc);
        case "users": return serializeUser(doc);
        case "requests": return serializeRequest(doc);
        case "reviews": return serializeReview(doc);
        case "messages": return serializeMessage(doc);
        case "notifications": return serializeNotification(doc);
    }
}

function getQueryField(collection: CollectionName) {
    switch (collection) {
        case "tools": return "toolId";
        case "users": return "userId";
        case "requests": return "requestId";
        case "reviews": return "reviewId";
        case "messages": return "messageId";
        case "notifications": return "notificationId";
    }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function readData<T>(collection: CollectionName): Promise<T[]> {
    await connectToDatabase();
    const Model = MODEL_MAP[collection] as any;
    const docs = await Model.find({}).lean(false);
    return docs.map((doc: any) => serialize(collection, doc)) as unknown as T[];
}

export async function getItemById<T extends { id: string }>(
    collection: CollectionName,
    id: string
): Promise<T | null> {
    await connectToDatabase();
    const Model = MODEL_MAP[collection] as any;
    const field = getQueryField(collection);
    const doc = await Model.findOne({ [field]: id });
    return serialize(collection, doc) as unknown as T | null;
}

export async function addItem<T extends { id: string }>(
    collection: CollectionName,
    item: T
): Promise<T> {
    await connectToDatabase();
    const Model = MODEL_MAP[collection] as any;
    const field = getQueryField(collection);
    
    // Convert 'id' to the internal field name (e.g., 'toolId')
    const { id, ...rest } = item;
    const doc = await Model.create({ [field]: id, ...rest });
    
    return serialize(collection, doc) as unknown as T;
}

export async function updateItem<T extends { id: string }>(
    collection: CollectionName,
    id: string,
    updates: Partial<T>
): Promise<T | null> {
    await connectToDatabase();
    const Model = MODEL_MAP[collection] as any;
    const field = getQueryField(collection);
    
    const { id: _id, ...rest } = updates;
    const doc = await Model.findOneAndUpdate(
        { [field]: id },
        { $set: rest },
        { new: true }
    );
    
    return serialize(collection, doc) as unknown as T | null;
}

export async function deleteItem(
    collection: CollectionName,
    id: string
): Promise<boolean> {
    await connectToDatabase();
    const Model = MODEL_MAP[collection] as any;
    const field = getQueryField(collection);
    const result = await Model.deleteOne({ [field]: id });
    return result.deletedCount > 0;
}

/**
 * Find a user by email — used by login/auth flows.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
    await connectToDatabase();
    const doc = await UserModel.findOne({ email });
    return serializeUser(doc);
}

/**
 * Find tools with advanced filtering, sorting, and pagination.
 */
export async function findTools(options: {
    query?: string;
    category?: string;
    available?: boolean;
    sort?: string;
    location?: string;
    userContextLocation?: string;
    minPrice?: number;
    maxPrice?: number;
    lat?: number;
    lng?: number;
    radius?: number; // in km
    page?: number;
    limit?: number;
}): Promise<{ tools: Tool[]; total: number }> {
    await connectToDatabase();
    
    const { 
        query, category, available, sort, location, 
        userContextLocation, minPrice, maxPrice, 
        lat, lng, radius,
        page = 1, limit = 20 
    } = options;

    const mongoQuery: any = {};

    // Keyword search
    if (query) {
        mongoQuery.$or = [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
        ];
    }

    // Category filter
    if (category && category !== "All") {
        mongoQuery.category = category;
    }

    // Availability filter
    if (available) {
        mongoQuery.availability = true;
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
        mongoQuery.pricePerDay = {};
        if (minPrice !== undefined) mongoQuery.pricePerDay.$gte = minPrice;
        if (maxPrice !== undefined) mongoQuery.pricePerDay.$lte = maxPrice;
    }

    // Location filter (Geofencing simulation)
    if (location && location !== "all") {
        const locationContext = userContextLocation || "Mumbai, MH";
        const [userCity, userState] = locationContext.split(",").map(s => s.trim().toLowerCase());
        
        if (location === "nearby") {
            mongoQuery.location = { $regex: `^${userCity}`, $options: "i" };
        } else if (location === "state") {
            mongoQuery.location = { $regex: `${userState}$`, $options: "i" };
        }
    }

    // Geo-spatial search
    if (options.lat !== undefined && options.lng !== undefined && options.radius !== undefined) {
        mongoQuery.coordinates = {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [options.lng, options.lat]
                },
                $maxDistance: options.radius * 1000 // radius in km to meters
            }
        };
    }

    // Sort options
    let sortOption: any = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { pricePerDay: 1 };
    else if (sort === "price_desc") sortOption = { pricePerDay: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };

    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
        ToolModel.find(mongoQuery)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean(false),
        ToolModel.countDocuments(mongoQuery)
    ]);

    return {
        tools: docs.map(serializeTool),
        total
    };
}/**
 * Find requests filtered by ownerId and/or requesterId.
 */
export async function findRequests(filters: {
    ownerId?: string;
    requesterId?: string;
}): Promise<BorrowRequest[]> {
    await connectToDatabase();
    const query: any = {};
    if (filters.ownerId) query.ownerId = filters.ownerId;
    if (filters.requesterId) query.requesterId = filters.requesterId;
    const docs = await BorrowRequestModel.find(query);
    return docs.map(serializeRequest);
}

/**
 * Find reviews for a specific target (tool or user).
 */
export async function findReviews(filters: {
    targetId?: string;
    targetType?: "tool" | "user";
    authorId?: string;
}): Promise<Review[]> {
    await connectToDatabase();
    const query: any = {};
    if (filters.targetId) query.targetId = filters.targetId;
    if (filters.targetType) query.targetType = filters.targetType;
    if (filters.authorId) query.authorId = filters.authorId;
    
    const docs = await ReviewModel.find(query).sort({ createdAt: -1 });
    return docs.map(serializeReview);
}

/**
 * Recalculate and update the average rating for a tool or user.
 */
export async function updateTargetRating(targetId: string, targetType: "tool" | "user") {
    await connectToDatabase();
    const reviews = await findReviews({ targetId, targetType });
    
    if (reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    const collection = targetType === "tool" ? "tools" : "users";
    await updateItem(collection, targetId, {
        rating: Number(averageRating.toFixed(1)),
        reviewCount: reviews.length
    } as any);
}
