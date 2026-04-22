export type { PaymentResult, PaymentDetails, PaymentMethod, PaymentStatus } from "@/services/paymentService";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    location: string;
    rating: number;
    reviewCount: number;
    bio: string;
    memberSince: string;
}

export interface Tool {
    id: string;
    name: string;
    description: string;
    category: string;
    location: string;
    availability: boolean;
    ownerId: string;
    pricePerDay: number;
    image: string;
    rating: number;
    reviewCount: number;
}

export interface BorrowRequest {
    id: string;
    toolId: string;
    requesterId: string;
    ownerId: string;
    startDate: string;
    endDate: string;
    message?: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;

    // Joined fields
    tool?: Tool;
    requester?: User;
    owner?: User;
}
export interface Review {
    id: string;
    targetId: string; // toolId or userId
    targetType: "tool" | "user";
    authorId: string;
    rating: number;
    comment: string;
    createdAt: string;
    author?: User;
}
export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: string;
}
export interface Notification {
    id: string;
    userId: string;
    type: "request" | "message" | "system";
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: string;
}
