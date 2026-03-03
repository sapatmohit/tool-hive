import { NextResponse } from "next/server";
import { readData, addItem } from "@/lib/db";
import { BorrowRequest } from "@/types";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const ownerId = searchParams.get("ownerId");
        const requesterId = searchParams.get("requesterId");

        let requests = await readData<BorrowRequest>("requests");

        if (ownerId) {
            requests = requests.filter((r) => r.ownerId === ownerId);
        }
        if (requesterId) {
            requests = requests.filter((r) => r.requesterId === requesterId);
        }

        return NextResponse.json(requests);
    } catch (error) {
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
        return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
    }
}
