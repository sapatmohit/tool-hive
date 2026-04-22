import { NextResponse } from "next/server";
import { findUserByEmail, addItem } from "@/lib/db";
import { User } from "@/types";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    location: z.string().optional(),
    avatar: z.string().optional(),
    memberSince: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate request body
        const result = signupSchema.safeParse(body);
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

        const { name, email, password, location, avatar, memberSince } = result.data;

        // Check for duplicate email
        const existing = await findUserByEmail(email);
        if (existing) {
            return NextResponse.json(
                { error: "An account with this email already exists.", code: "EMAIL_EXISTS" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser: User = {
            id: `user-${crypto.randomUUID()}`,
            name,
            email,
            password: hashedPassword,
            avatar: avatar ?? "",
            location: location ?? "",
            rating: 0,
            reviewCount: 0,
            bio: "",
            memberSince: memberSince ?? new Date().toISOString().split("T")[0],
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

