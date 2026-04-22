/**
 * mongodb.ts — Singleton connection manager for Mongoose.
 *
 * Uses a module-level cache so that in Next.js development (with hot-reload),
 * we don't create a new connection on every module evaluation.
 * See: https://mongoosejs.com/docs/connections.html#multiple-connections
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable in .env.local"
    );
}

// Extend the NodeJS global type so TypeScript doesn't complain about the cache.
declare global {
    // eslint-disable-next-line no-var
    var mongooseCache:
        | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
        | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
    if (cached!.conn) {
        return cached!.conn;
    }

    if (!cached!.promise) {
        cached!.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    cached!.conn = await cached!.promise;
    return cached!.conn;
}
