"use client";

/**
 * AuthContext.tsx
 *
 * All auth operations (login, signup, session lookup) now talk to the
 * real REST API backed by MongoDB.  localStorage is still used only
 * to persist the logged-in userId across page refreshes — the user
 * object itself always comes from the DB.
 */

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { User } from "@/types";

const AUTH_STORAGE_KEY = "toolhive_auth_user_id";

interface SignupData {
    name: string;
    email: string;
    password: string;
    location?: string;
}

interface AuthError extends Error {
    code: "INVALID_EMAIL" | "INVALID_PASSWORD" | "EMAIL_EXISTS" | "SERVER_ERROR";
}

interface AuthContextType {
    currentUser: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStoredUserId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_STORAGE_KEY);
}

function generateAvatar(name: string): string {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff`;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount: restore session from localStorage → fetch user from DB
    useEffect(() => {
        const storedId = getStoredUserId();
        if (!storedId) {
            setIsLoading(false);
            return;
        }

        fetch(`/api/users/${storedId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Session user not found");
                return res.json() as Promise<User>;
            })
            .then((user) => setCurrentUser(user))
            .catch(() => {
                // Stale / deleted user — clear the stored id
                localStorage.removeItem(AUTH_STORAGE_KEY);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<void> => {
        const res = await fetch(`/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json() as { user?: User; code?: string; error?: string };

        if (!res.ok) {
            const error = new Error(data.error ?? "Login failed") as AuthError;
            error.code = (data.code as AuthError["code"]) ?? "SERVER_ERROR";
            throw error;
        }

        const user = data.user!;
        setCurrentUser(user);
        localStorage.setItem(AUTH_STORAGE_KEY, user.id);
    }, []);

    const signup = useCallback(async (data: SignupData): Promise<void> => {
        const res = await fetch(`/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...data,
                avatar: generateAvatar(data.name),
                memberSince: new Date().toISOString().split("T")[0],
            }),
        });

        const body = await res.json() as { user?: User; code?: string; error?: string };

        if (!res.ok) {
            const error = new Error(body.error ?? "Signup failed") as AuthError;
            error.code = (body.code as AuthError["code"]) ?? "SERVER_ERROR";
            throw error;
        }

        const user = body.user!;
        setCurrentUser(user);
        localStorage.setItem(AUTH_STORAGE_KEY, user.id);
    }, []);

    const logout = useCallback((): void => {
        setCurrentUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }, []);

    const value = useMemo(
        () => ({ currentUser, login, signup, logout, isLoading }),
        [currentUser, login, signup, logout, isLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth — consume the auth context in any component.
 */
export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
