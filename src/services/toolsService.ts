/**
 * toolsService.js — My Tools module service layer.
 * P2 migration: only this file needs to change, not components.
 */

import { get, mutate } from "@/services/apiClient";
import { Tool } from "@/types";

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
 * Get all tools listed by a specific user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getMyTools(userId: string): Promise<Tool[]> {
    const response = await get<{ tools: Tool[]; total: number }>("/tools");
    const tools = response.tools || [];
    return tools.filter((t: Tool) => t.ownerId === userId);
}

/**
 * Add a new tool listing.
 * @param {Object} data
 * @param {string} currentUserId - ID of the currently authenticated user
 * @returns {Promise<Object>}
 * @throws {AuthenticationError} If user is not authenticated
 */
export async function addTool(data: Partial<Tool>, currentUserId: string | null): Promise<Tool> {
    requireAuth(currentUserId);
    return mutate<Tool>("post", "/tools", { ...data, ownerId: currentUserId });
}

/**
 * Update an existing tool listing.
 * @param {string} id
 * @param {Object} data
 * @param {string} currentUserId - ID of the currently authenticated user
 * @returns {Promise<Object>}
 * @throws {AuthenticationError} If user is not authenticated
 */
export async function updateTool(id: string, data: Partial<Tool>, currentUserId: string | null): Promise<Tool> {
    requireAuth(currentUserId);
    return mutate<Tool>("patch", `/tools/${id}`, data);
}

/**
 * Delete a tool listing.
 * @param {string} id
 * @param {string} currentUserId - ID of the currently authenticated user
 * @returns {Promise<Object>}
 * @throws {AuthenticationError} If user is not authenticated
 */
export async function deleteTool(id: string, currentUserId: string | null): Promise<{ id: string }> {
    requireAuth(currentUserId);
    return mutate<{ id: string }>("delete", `/tools/${id}`, { id });
}
