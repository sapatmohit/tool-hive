"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import usersData from "@/data/users.json";
import { User } from "@/types";

const STORAGE_KEY = "toolhive_auth_user_id";

interface AuthContextType {
    currentUser: User | null;
    login: (userId: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getStoredUserId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
}

function findUser(userId: string | null): User | null {
    if (!userId) return null;
    return (usersData.find((u: User) => u.id === userId) as User) ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [initialUserId, setInitialUserId] = useState<string | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInitialUserId(getStoredUserId());
        setIsHydrated(true);
    }, []);

    const currentUser = useMemo((): User | null => {
        return isHydrated ? findUser(initialUserId) : null;
    }, [initialUserId, isHydrated]);

    const login = (userId: string) => {
        const user = findUser(userId) ?? (usersData[0] as User);
        setInitialUserId(user.id);
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, user.id);
        }
    };

    const logout = () => {
        setInitialUserId(null);
        if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const value = useMemo(
        () => ({
            currentUser,
            login,
            logout,
            isLoading: !isHydrated,
        }),
        [currentUser, isHydrated]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * useAuth — consume the auth context in any component.
 * @returns {{ currentUser: object|null, login: function, logout: function }}
 */
export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
