import { NextResponse } from "next/server";
import { addItem, findRequests } from "@/lib/db";
import { BorrowRequest } from "@/types";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const ownerId = searchParams.get("ownerId") ?? undefined;
        const requesterId = searchParams.get("requesterId") ?? undefined;

        const requests = await findRequests({ ownerId, requesterId });
        return NextResponse.json(requests);
    } catch (error) {
        console.error("GET /api/requests error:", error);
        return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newRequest: BorrowRequest = {
            ...body,
            id: `req-${Date.now()}`,
            status: "pending",
            createdAt: new Date().toISOString(),
        };
        const savedRequest = await addItem<BorrowRequest>("requests", newRequest);
        return NextResponse.json(savedRequest, { status: 201 });
    } catch (error) {
        console.error("POST /api/requests error:", error);
        return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
    }
}
