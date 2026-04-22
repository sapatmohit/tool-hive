import { NextResponse } from "next/server";
import { getItemById, updateItem, deleteItem } from "@/lib/db";
import { BorrowRequest } from "@/types";
import { borrowRequestSchema } from "@/lib/schemas";

const partialRequestSchema = borrowRequestSchema.partial();

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
    const { id } = await params;
    try {
        const body = await request.json();

        // Validate partial update
        const result = partialRequestSchema.safeParse(body);
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

        const updatedRequest = await updateItem<BorrowRequest>("requests", id, result.data);
        if (!updatedRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }
        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error(`PATCH /api/requests/${id} error:`, error);
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
