import { NextResponse } from "next/server";
import { addItem, findRequests } from "@/lib/db";
import { BorrowRequest } from "@/types";
import { borrowRequestSchema } from "@/lib/schemas";

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

        // Validate request body
        const result = borrowRequestSchema.safeParse(body);
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

        const newRequest: BorrowRequest = {
            ...result.data,
            id: `req-${crypto.randomUUID()}`,
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

