import { NextResponse } from "next/server";
import { getItemById, updateItem, deleteItem } from "@/lib/db";
import { User } from "@/types";
import { userSchema } from "@/lib/schemas";

const partialUserSchema = userSchema.partial();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getItemById<User>("users", id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
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
        const result = partialUserSchema.safeParse(body);
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

        const updatedUser = await updateItem<User>("users", id, result.data);
        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error(`PATCH /api/users/${id} error:`, error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}


export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const success = await deleteItem("users", id);
        if (!success) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
