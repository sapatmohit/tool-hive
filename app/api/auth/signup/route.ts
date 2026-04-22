import { NextResponse } from "next/server";
import { findUserByEmail, addItem } from "@/lib/db";
import { User } from "@/types";

export async function POST(request: Request) {
    try {
        const body = await request.json() as {
            name?: string;
            email?: string;
            password?: string;
            location?: string;
            avatar?: string;
            memberSince?: string;
        };

        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email and password are required.", code: "SERVER_ERROR" },
                { status: 400 }
            );
        }

        // Check for duplicate email
        const existing = await findUserByEmail(email);
        if (existing) {
            return NextResponse.json(
                { error: "An account with this email already exists.", code: "EMAIL_EXISTS" },
                { status: 409 }
            );
        }

        const newUser: User = {
            id: `user-${crypto.randomUUID()}`,
            name,
            email,
            password,
            avatar: body.avatar ?? "",
            location: body.location ?? "",
            rating: 0,
            reviewCount: 0,
            bio: "",
            memberSince: body.memberSince ?? new Date().toISOString().split("T")[0],
        };

        const savedUser = await addItem<User>("users", newUser);

        // Strip password before responding
        const { password: _pw, ...safeUser } = savedUser;
        return NextResponse.json({ user: safeUser }, { status: 201 });
    } catch (error) {
        console.error("POST /api/auth/signup error:", error);
        return NextResponse.json(
            { error: "Signup failed. Please try again.", code: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}
