/**
 * requestService.js — Requests module service layer.
 * P2 migration: only this file needs to change, not components.
 */

import { get, mutate } from "@/services/apiClient";
import { Tool, User, BorrowRequest } from "@/types";

class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthenticationError";
    }
}

function requireAuth(currentUserId: string | null): void {
    if (!currentUserId) {
        throw new AuthenticationError("Authentication required. Please log in to perform this action.");
    }
}

/**
 * Get all incoming borrow requests for the tool owner.
 * @param {string} ownerId
 * @returns {Promise<Array>}
 */
export async function getRequestsForOwner(ownerId: string): Promise<BorrowRequest[]> {
    const [requests, tools, users] = await Promise.all([
        get<BorrowRequest[]>("/requests"),
        get<Tool[]>("/tools"),
        get<User[]>("/users"),
    ]);

    return requests
        .filter((r: BorrowRequest) => r.ownerId === ownerId)
        .map((r: BorrowRequest) => ({
            ...r,
            tool: tools.find((t: Tool) => t.id === r.toolId) ?? undefined,
            requester: users.find((u: User) => u.id === r.requesterId) ?? undefined,
        }));
}

/**
 * Get all tools borrowed (or requested) by the current user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getBorrowedByUser(userId: string): Promise<BorrowRequest[]> {
    const [requests, tools, users] = await Promise.all([
        get<BorrowRequest[]>("/requests"),
        get<Tool[]>("/tools"),
        get<User[]>("/users"),
    ]);

    return requests
        .filter((r: BorrowRequest) => r.requesterId === userId)
        .map((r: BorrowRequest) => ({
            ...r,
            tool: tools.find((t: Tool) => t.id === r.toolId) ?? undefined,
            owner: users.find((u: User) => u.id === r.ownerId) ?? undefined,
        }));
}

/**
 * Update the status of a borrow request.
 * @param {string} id
 * @param {'approved'|'rejected'} status
 * @param {string} currentUserId - ID of the currently authenticated user
 * @returns {Promise<Object>}
 * @throws {AuthenticationError} If user is not authenticated
 */
export async function updateRequestStatus(id: string, status: "approved" | "rejected" | "pending", currentUserId: string | null): Promise<BorrowRequest> {
    requireAuth(currentUserId);
    return mutate<BorrowRequest>("patch", `/requests/${id}`, { id, status });
}

/**
 * Create a new borrow request.
 * @param {Object} data
 * @param {string} currentUserId - ID of the currently authenticated user
 * @returns {Promise<Object>}
 * @throws {AuthenticationError} If user is not authenticated
 */
export async function createRequest(data: Partial<BorrowRequest>, currentUserId: string | null): Promise<BorrowRequest> {
    requireAuth(currentUserId);
    return mutate<BorrowRequest>("post", "/requests", data);
}
