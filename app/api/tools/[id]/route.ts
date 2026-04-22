import { NextResponse } from "next/server";
import { getItemById, updateItem, deleteItem } from "@/lib/db";
import { Tool } from "@/types";
import { toolSchema } from "@/lib/schemas";

const partialToolSchema = toolSchema.partial();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const tool = await getItemById<Tool>("tools", id);
        if (!tool) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 });
        }
        return NextResponse.json(tool);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tool" }, { status: 500 });
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
        const result = partialToolSchema.safeParse(body);
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

        const updatedTool = await updateItem<Tool>("tools", id, result.data);
        if (!updatedTool) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 });
        }
        return NextResponse.json(updatedTool);
    } catch (error) {
        console.error(`PATCH /api/tools/${id} error:`, error);
        return NextResponse.json({ error: "Failed to update tool" }, { status: 500 });
    }
}


export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const success = await deleteItem("tools", id);
        if (!success) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Tool deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 });
    }
}
