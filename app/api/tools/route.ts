import { NextResponse } from "next/server";
import { readData, addItem } from "@/lib/db";
import { Tool } from "@/types";

export async function GET() {
    try {
        const tools = await readData<Tool>("tools");
        return NextResponse.json(tools);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newTool: Tool = {
            ...body,
            id: body.id || `tool-${Date.now()}`,
            rating: body.rating || 0,
            reviewCount: body.reviewCount || 0,
            availability: body.availability ?? true,
        };
        const savedTool = await addItem<Tool>("tools", newTool);
        return NextResponse.json(savedTool, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create tool" }, { status: 500 });
    }
}
