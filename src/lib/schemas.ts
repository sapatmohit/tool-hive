import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    location: z.string().optional(),
    avatar: z.string().optional(),
    bio: z.string().optional(),
});

export const toolSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.string().min(1, "Category is required"),
    location: z.string().min(1, "Location is required"),
    pricePerDay: z.number().positive("Price must be a positive number"),
    image: z.string().url("Invalid image URL"),
    ownerId: z.string().min(1, "Owner ID is required"),
});

export const borrowRequestSchema = z.object({
    toolId: z.string().min(1, "Tool ID is required"),
    requesterId: z.string().min(1, "Requester ID is required"),
    ownerId: z.string().min(1, "Owner ID is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    message: z.string().optional(),
    status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

export const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    location: z.string().optional(),
    avatar: z.string().optional(),
    memberSince: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const reviewSchema = z.object({
    targetId: z.string().min(1, "Target ID is required"),
    targetType: z.enum(["tool", "user"]),
    authorId: z.string().min(1, "Author ID is required"),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
});

