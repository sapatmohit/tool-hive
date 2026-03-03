/**
 * requestService.js — Requests module service layer.
 * P2 migration: only this file needs to change, not components.
 */

import { get, mutate } from "@/services/apiClient";
import { Tool, User, BorrowRequest } from "@/types";

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
 * @returns {Promise<Object>}
 */
export async function updateRequestStatus(id: string, status: "approved" | "rejected" | "pending"): Promise<BorrowRequest> {
    return mutate<BorrowRequest>("patch", `/requests/${id}`, { id, status });
}

/**
 * Create a new borrow request.
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function createRequest(data: Partial<BorrowRequest>): Promise<BorrowRequest> {
    return mutate<BorrowRequest>("post", "/requests", data);
}
