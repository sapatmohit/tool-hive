/**
 * apiClient.js — Service Layer Abstraction
 *
 * Current: reads from local JSON (Phase 1)
 * Future (P2): replace fetch calls with axios to a REST API.
 * Components NEVER import this directly — only service files do.
 */

/**
 * Simulates a network fetch from local JSON data.
 * Updated to fetch from real API routes.
 *
 * @param {string} endpoint - e.g. "/tools", "/users"
 * @returns {Promise<any>}
 */
export async function get<T = any>(endpoint: string): Promise<T> {
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

