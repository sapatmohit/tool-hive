import { NextResponse } from "next/server";
import { readData, addItem } from "@/lib/db";
import { User } from "@/types";

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
        const newUser: User = {
            ...body,
            id: body.id || `user-${Date.now()}`,
            rating: body.rating || 0,
            reviewCount: body.reviewCount || 0,
            memberSince: body.memberSince || new Date().toISOString().split('T')[0],
        };
        const savedUser = await addItem<User>("users", newUser);
        return NextResponse.json(savedUser, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}
