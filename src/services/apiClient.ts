/**
 * apiClient.js — Service Layer Abstraction
 *
 * Current: reads from local JSON (Phase 1)
 * Future (P2): replace fetch calls with axios to a REST API.
 * Components NEVER import this directly — only service files do.
 */

import tools from "@/data/tools.json";
import users from "@/data/users.json";

/**
 * Simulates a network fetch from local JSON data.
 * Updated to fetch from real API routes.
 *
 * @param {string} endpoint - e.g. "/tools", "/users"
 * @returns {Promise<any>}
 */
export async function get<T = any>(endpoint: string): Promise<T> {
    const isServer = typeof window === "undefined";

    // During build time (static generation), network fetches to localhost fail.
    // For Phase 1, we can return the local JSON data directly.
    if (isServer) {
        if (endpoint === "/tools") return Promise.resolve(tools as T);
        if (endpoint === "/users") return Promise.resolve(users as T);
        if (endpoint.startsWith("/tools/")) {
            const id = endpoint.split("/")[2];
            return Promise.resolve(tools.find((t) => t.id === id) as T);
        }
        if (endpoint.startsWith("/users/")) {
            const id = endpoint.split("/")[2];
            return Promise.resolve(users.find((u) => u.id === id) as T);
        }
        
        // Fallback for other server-side fetches (e.g. if we add more)
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api${endpoint}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
        }
        return response.json();
    }

    // Client side:
    const response = await fetch(`/api${endpoint}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Simulates a POST/PUT mutation.
 * Updated to use real fetch mutations.
 */
export async function mutate<T = any>(method: string, endpoint: string, payload: any): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
        method: method.toUpperCase(),
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Failed to ${method} ${endpoint}: ${response.statusText}`);
    }
    return response.json();
}

