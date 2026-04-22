import { NextResponse } from "next/server";
import { addItem, readData } from "@/lib/db";
import { Message } from "@/types";
import { z } from "zod";

const messageSchema = z.object({
    senderId: z.string(),
    receiverId: z.string(),
    content: z.string().min(1),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const otherId = searchParams.get("otherId");

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        // In a real app, you'd filter by sender/receiver in the DB
        // For now, we'll use readData and filter here (inefficient but works for mock)
        const allMessages = await readData<Message>("messages");
        const filtered = allMessages.filter(m => 
            (m.senderId === userId && (!otherId || m.receiverId === otherId)) ||
            (m.receiverId === userId && (!otherId || m.senderId === otherId))
        ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        return NextResponse.json(filtered);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = messageSchema.safeParse(body);
        
        if (!result.success) {
            return NextResponse.json({ error: "Invalid message data" }, { status: 400 });
        }

        const newMessage: Message = {
            ...result.data,
            id: `msg-${crypto.randomUUID()}`,
            read: false,
            createdAt: new Date().toISOString(),
        };

        const savedMessage = await addItem<Message>("messages", newMessage);
        return NextResponse.json(savedMessage, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
