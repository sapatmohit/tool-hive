import { NextResponse } from "next/server";
import { addItem, findReviews, updateTargetRating } from "@/lib/db";
import { Review } from "@/types";
import { reviewSchema } from "@/lib/schemas";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const targetId = searchParams.get("targetId") ?? undefined;
        const targetType = (searchParams.get("targetType") as "tool" | "user") ?? undefined;
        const authorId = searchParams.get("authorId") ?? undefined;

        const reviews = await findReviews({ targetId, targetType, authorId });
        return NextResponse.json(reviews);
    } catch (error) {
        console.error("GET /api/reviews error:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate request body
        const result = reviewSchema.safeParse(body);
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

        const newReview: Review = {
            ...result.data,
            id: `rev-${crypto.randomUUID()}`,
            comment: result.data.comment ?? "",
            createdAt: new Date().toISOString(),
        };

        const savedReview = await addItem<Review>("reviews", newReview);
        
        // Update target rating (tool or user)
        await updateTargetRating(result.data.targetId, result.data.targetType);
        
        return NextResponse.json(savedReview, { status: 201 });
    } catch (error) {
        console.error("POST /api/reviews error:", error);
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }
}
