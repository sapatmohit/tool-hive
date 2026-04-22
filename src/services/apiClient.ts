/**
 * apiClient.ts — Service Layer Abstraction
 *
 * Phase 2: Reads from and writes to the real REST API backed by MongoDB.
 * Components NEVER import this directly — only service files do.
 */

/**
 * Performs a GET request against our Next.js API routes.
 *
 * @param endpoint - e.g. "/tools", "/users", "/tools/tool-001"
 */
export async function get<T = unknown>(endpoint: string): Promise<T> {
    const isServer = typeof window === "undefined";

    const baseUrl = isServer
        ? (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
        : "";

    const response = await fetch(`${baseUrl}/api${endpoint}`, {
        // Opt out of Next.js full-route caching so we always get fresh data.
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`GET ${endpoint} failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

/**
 * Performs a POST / PUT / PATCH / DELETE mutation.
 *
 * @param method   - HTTP verb (case-insensitive)
 * @param endpoint - e.g. "/tools", "/requests/req-001"
 * @param payload  - request body (will be JSON-serialised)
 */
export async function mutate<T = unknown>(
    method: string,
    endpoint: string,
    payload: unknown
): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
        method: method.toUpperCase(),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(
            `${method.toUpperCase()} ${endpoint} failed: ${response.status} ${response.statusText}`
        );
    }

    return response.json() as Promise<T>;
}
