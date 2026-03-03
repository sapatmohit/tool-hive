import { NextResponse } from "next/server";
import { getItemById, updateItem, deleteItem } from "@/lib/db";
import { Tool } from "@/types";

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
    try {
        const { id } = await params;
        const body = await request.json();
        const updatedTool = await updateItem<Tool>("tools", id, body);
        if (!updatedTool) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 });
        }
        return NextResponse.json(updatedTool);
    } catch (error) {
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
