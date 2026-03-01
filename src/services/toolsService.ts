/**
 * toolsService.js — My Tools module service layer.
 * P2 migration: only this file needs to change, not components.
 */

import { get, mutate } from "@/services/apiClient";
import { Tool } from "@/types";

/**
 * Get all tools listed by a specific user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getMyTools(userId: string): Promise<Tool[]> {
    const tools = await get<Tool[]>("/tools");
    return tools.filter((t: Tool) => t.ownerId === userId);
}

/**
 * Add a new tool listing.
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function addTool(data: Partial<Tool>): Promise<Tool> {
    return mutate<Tool>("post", "/tools", data);
}

/**
 * Update an existing tool listing.
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function updateTool(id: string, data: Partial<Tool>): Promise<Tool> {
    return mutate<Tool>("patch", `/tools/${id}`, data);
}

/**
 * Delete a tool listing.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function deleteTool(id: string): Promise<{ id: string }> {
    return mutate<{ id: string }>("delete", `/tools/${id}`, { id });
}
