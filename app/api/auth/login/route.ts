import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json() as {
            email?: string;
            password?: string;
        };

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required.", code: "INVALID_EMAIL" },
                { status: 400 }
            );
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return NextResponse.json(
                { error: "No account found with this email address.", code: "INVALID_EMAIL" },
                { status: 401 }
            );
        }

        if (user.password !== password) {
            return NextResponse.json(
                { error: "Incorrect password. Please try again.", code: "INVALID_PASSWORD" },
                { status: 401 }
            );
        }

        // Strip the password before sending to the client
        const { password: _pw, ...safeUser } = user;
        return NextResponse.json({ user: safeUser });
    } catch (error) {
        console.error("POST /api/auth/login error:", error);
        return NextResponse.json(
            { error: "Login failed. Please try again.", code: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}
