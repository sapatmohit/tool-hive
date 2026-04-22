import { NextResponse } from "next/server";
import { readData, addItem, findTools } from "@/lib/db";
import { Tool } from "@/types";
import { toolSchema } from "@/lib/schemas";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        
        const options = {
            query: searchParams.get("q") || undefined,
            category: searchParams.get("category") || undefined,
            available: searchParams.get("available") === "true",
            sort: searchParams.get("sort") || undefined,
            location: searchParams.get("location") || undefined,
            userContextLocation: searchParams.get("userContextLocation") || undefined,
            minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
            maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
            page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
            limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 20,
        };

        const result = await findTools(options);
        return NextResponse.json(result);
    } catch (error) {
        console.error("GET /api/tools error:", error);
        return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate request body
        const result = toolSchema.safeParse(body);
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

        const newTool: Tool = {
            ...result.data,
            id: `tool-${crypto.randomUUID()}`,
            rating: 0,
            reviewCount: 0,
            availability: true,
        };

        const savedTool = await addItem<Tool>("tools", newTool);
        return NextResponse.json(savedTool, { status: 201 });
    } catch (error) {
        console.error("POST /api/tools error:", error);
        return NextResponse.json({ error: "Failed to create tool" }, { status: 500 });
    }
}

