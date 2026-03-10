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
 * Search and filter tools.
 * @param {string} query - keyword search
 * @param {{ category?: string, available?: boolean, sort?: string, location?: string, userContextLocation?: string, minPrice?: number, maxPrice?: number }} filters
 * @returns {Promise<Array>}
 */
export async function searchTools(
    query: string = "",
    filters: { category?: string; available?: boolean; sort?: string; location?: string; userContextLocation?: string; minPrice?: number; maxPrice?: number } = {}
): Promise<Tool[]> {
    const tools = await get<Tool[]>("/tools");

    let results = tools;

    // Keyword filter
    if (query.trim()) {
        const q = query.toLowerCase();
        results = results.filter(
            (t: Tool) =>
                t.name.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q) ||
                t.location.toLowerCase().includes(q)
        );
    }

    // Category filter
    if (filters.category && filters.category !== "All") {
        results = results.filter((t: Tool) => t.category === filters.category);
    }

    // Location filter (Geofencing)
    if (filters.location && filters.location !== "all") {
        const locationContext = filters.userContextLocation || MOCK_USER_LOCATION;
        const [userCity, userState] = locationContext.split(",").map(s => s.trim().toLowerCase());
        
        if (filters.location === "nearby") {
            // Filter by same city
            results = results.filter((t: Tool) => {
                const [toolCity] = t.location.split(",").map(s => s.trim().toLowerCase());
                return toolCity === userCity;
            });
        } else if (filters.location === "state") {
            // Filter by same state
            results = results.filter((t: Tool) => {
                const parts = t.location.split(",");
                const toolState = parts.length > 1 ? parts[1].trim().toLowerCase() : "";
                return toolState === userState;
            });
        }
    }

    // Availability filter
    if (filters.available) {
        results = results.filter((t: Tool) => t.availability === true);
    }

    // Price filters
    if (filters.minPrice !== undefined) {
        results = results.filter((t: Tool) => t.pricePerDay >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
        results = results.filter((t: Tool) => t.pricePerDay <= filters.maxPrice!);
    }

    // Sort
    if (filters.sort === "price_asc") {
        results = [...results].sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (filters.sort === "price_desc") {
        results = [...results].sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (filters.sort === "rating") {
        results = [...results].sort((a, b) => b.rating - a.rating);
    }

    return results;
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
