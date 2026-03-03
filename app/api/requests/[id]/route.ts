import { NextResponse } from "next/server";
import { getItemById, updateItem, deleteItem } from "@/lib/db";
import { BorrowRequest } from "@/types";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const borrowRequest = await getItemById<BorrowRequest>("requests", id);
        if (!borrowRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }
        return NextResponse.json(borrowRequest);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch request" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const updatedRequest = await updateItem<BorrowRequest>("requests", id, body);
        if (!updatedRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }
        return NextResponse.json(updatedRequest);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const success = await deleteItem("requests", id);
        if (!success) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Request deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete request" }, { status: 500 });
    }
}
