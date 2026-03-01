/**
 * apiClient.js — Service Layer Abstraction
 *
 * Current: reads from local JSON (Phase 1)
 * Future (P2): replace fetch calls with axios to a REST API.
 * Components NEVER import this directly — only service files do.
 */

/**
 * Simulates a network fetch from local JSON data.
 * In P2, replace with: return axios.get(`${BASE_URL}${endpoint}`).then(r => r.data)
 *
 * @param {string} endpoint - e.g. "/tools", "/users"
 * @returns {Promise<any>}
 */
export async function get<T = any>(endpoint: string): Promise<T> {
    // Strip leading slash and map to JSON file in /src/data/
    const resource = endpoint.replace(/^\//, "").split("/")[0];
    const mod = await import(`@/data/${resource}.json`);
    const data = mod.default;

    // Support /resource/:id pattern
    const parts = endpoint.replace(/^\//, "").split("/");
    if (parts.length === 2) {
        const id = parts[1];
        const item = data.find((d: any) => d.id === id) ?? null;
        return item as T;
    }

    return data;
}

/**
 * Simulates a POST/PUT mutation.
 * In P2, replace with: return axios.post/put/patch/delete(...)
 */
export async function mutate<T = any>(method: string, endpoint: string, payload: any): Promise<T> {
    // Phase 1: return payload as-is (no real persistence)
    console.log(`[apiClient] ${method.toUpperCase()} ${endpoint}`, payload);
    return { ...payload, id: payload.id ?? `mock-${Date.now()}` };
}
