import { NextResponse } from "next/server";
import { readData, addItem } from "@/lib/db";
import { User } from "@/types";
import { userSchema } from "@/lib/schemas";

export async function GET() {
    try {
        const users = await readData<User>("users");
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate request body
        const result = userSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { 
                    error: result.error.issues[0].message, 
                    code: "VALIDATION_ERROR",
                    details: result.error.issues 
                },
                { status: 400 }
            );
        }

        const newUser: User = {
            ...result.data,
            id: `user-${crypto.randomUUID()}`,
            rating: 0,
            reviewCount: 0,
            memberSince: new Date().toISOString().split('T')[0],
        } as User;

        const savedUser = await addItem<User>("users", newUser);
        return NextResponse.json(savedUser, { status: 201 });
    } catch (error) {
        console.error("POST /api/users error:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}

