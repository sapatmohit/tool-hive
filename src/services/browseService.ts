/**
 * browseService.js — Browse module service layer.
 *
 * Data source: local JSON via apiClient (Phase 1)
 * P2 migration: only this file needs to change, not components.
 */

import { get } from "@/services/apiClient";
import { Tool } from "@/types";

/**
 * Fetch all available tools.
 * @returns {Promise<Array>}
 */
export async function getAllTools(): Promise<Tool[]> {
    return get<Tool[]>("/tools");
}

/**
 * Fetch a single tool by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getToolById(id: string): Promise<Tool | null> {
    return get<Tool | null>(`/tools/${id}`);
}

const MOCK_USER_LOCATION = "Mumbai, MH";

/**
 * Search and filter tools using server-side capabilities.
 */
export async function searchTools(
    query: string = "",
    filters: { 
        category?: string; 
        available?: boolean; 
        sort?: string; 
        location?: string; 
        userContextLocation?: string; 
        minPrice?: number; 
        maxPrice?: number;
        page?: number;
        limit?: number;
    } = {}
): Promise<{ tools: Tool[]; total: number }> {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (filters.category) params.append("category", filters.category);
    if (filters.available) params.append("available", "true");
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.location) params.append("location", filters.location);
    if (filters.userContextLocation) params.append("userContextLocation", filters.userContextLocation);
    if (filters.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString());
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return get<{ tools: Tool[]; total: number }>(`/tools?${params.toString()}`);
}


/**
 * Get all unique categories from tools.
 * @returns {Promise<string[]>}
 */
export async function getCategories(): Promise<string[]> {
    const tools = await get<Tool[]>("/tools");
    const cats = [...new Set(tools.map((t: Tool) => t.category))];
    return ["All", ...cats];
}
