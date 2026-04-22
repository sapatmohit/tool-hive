/**
 * scripts/seed.ts
 *
 * One-shot script to populate MongoDB with the local JSON seed data.
 * Run from the project root:
 *
 *   npx tsx scripts/seed.ts
 *
 * Requires MONGODB_URI to be set (either in .env.local or exported in the shell).
 */

import "dotenv/config"; // picks up .env.local automatically via dotenv
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { join } from "path";
import bcrypt from "bcryptjs";

// ─── Load seed data ──────────────────────────────────────────────────────────

const DATA_DIR = join(process.cwd(), "src/data");

function loadJson<T>(filename: string): T[] {
    const raw = readFileSync(join(DATA_DIR, filename), "utf-8");
    return JSON.parse(raw) as T[];
}

import ToolModel from "@/models/Tool";
import UserModel from "@/models/User";
import BorrowRequestModel from "@/models/BorrowRequest";

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌  MONGODB_URI is not set. Create a .env.local file first.");
        process.exit(1);
    }

    console.log("🔌  Connecting to MongoDB…");
    await mongoose.connect(uri);
    console.log("✅  Connected.\n");

    // ── Tools ──
    const tools = loadJson<Record<string, unknown>>("tools.json");
    console.log(`📦  Seeding ${tools.length} tools…`);
    for (const tool of tools) {
        await ToolModel.updateOne(
            { toolId: tool.id as string },
            {
                $setOnInsert: {
                    toolId: tool.id,
                    name: tool.name,
                    description: tool.description,
                    category: tool.category,
                    location: tool.location,
                    availability: tool.availability,
                    ownerId: tool.ownerId,
                    pricePerDay: tool.pricePerDay,
                    image: tool.image,
                    rating: tool.rating,
                    reviewCount: tool.reviewCount,
                },
            },
            { upsert: true }
        );
    }
    console.log("   ✔ Tools done.\n");

    // ── Users ──
    const users = loadJson<Record<string, any>>("users.json");
    console.log(`👤  Seeding ${users.length} users…`);
    for (const user of users) {
        // Hash password if it's a plain string (all seed users have plain text passwords)
        const hashedPassword = await bcrypt.hash(user.password || "password123", 12);
        
        await UserModel.updateOne(
            { userId: user.id as string },
            {
                $set: {
                    password: hashedPassword,
                },
                $setOnInsert: {
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    location: user.location,
                    rating: user.rating,
                    reviewCount: user.reviewCount,
                    bio: user.bio,
                    memberSince: user.memberSince,
                    toolsListed: user.toolsListed ?? 0,
                    toolsBorrowed: user.toolsBorrowed ?? 0,
                },
            },
            { upsert: true }
        );
    }
    console.log("   ✔ Users done.\n");

    // ── Requests ──
    const requests = loadJson<Record<string, unknown>>("requests.json");
    console.log(`📋  Seeding ${requests.length} borrow requests…`);
    for (const req of requests) {
        await BorrowRequestModel.updateOne(
            { requestId: req.id as string },
            {
                $setOnInsert: {
                    requestId: req.id,
                    toolId: req.toolId,
                    requesterId: req.requesterId,
                    ownerId: req.ownerId,
                    startDate: req.startDate,
                    endDate: req.endDate,
                    message: req.message ?? "",
                    status: req.status ?? "pending",
                },
            },
            { upsert: true }
        );
    }
    console.log("   ✔ Requests done.\n");

    await mongoose.disconnect();
    console.log("🎉  Seed complete! Your MongoDB is ready.");
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
