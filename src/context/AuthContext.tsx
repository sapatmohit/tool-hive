"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import defaultUsersData from "@/data/users.json";
import { User } from "@/types";

const AUTH_STORAGE_KEY = "toolhive_auth_user_id";
const LOCAL_USERS_KEY = "toolhive_local_users";

interface SignupData {
    name: string;
    email: string;
    password: string;
    location?: string;
}

interface AuthError extends Error {
    code: "INVALID_EMAIL" | "INVALID_PASSWORD" | "EMAIL_EXISTS";
}

interface AuthContextType {
    currentUser: User | null;
    login: (email: string, password: string) => void;
    signup: (data: SignupData) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getStoredUserId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_STORAGE_KEY);
}

function getLocalUsers(): User[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(LOCAL_USERS_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored) as User[];
    } catch {
        return [];
    }
}

function saveLocalUsers(users: User[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function getAllUsers(): User[] {
    const localUsers = getLocalUsers();
    return [...defaultUsersData as User[], ...localUsers];
}

function findUserById(userId: string | null): User | null {
    if (!userId) return null;
    const allUsers = getAllUsers();
    return allUsers.find((u) => u.id === userId) ?? null;
}

function findUserByEmail(email: string): User | null {
    const allUsers = getAllUsers();
    return allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

function generateAvatar(name: string): string {
    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff`;
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
        return isHydrated ? findUserById(initialUserId) : null;
    }, [initialUserId, isHydrated]);

    const login = (email: string, password: string): void => {
        const user = findUserByEmail(email);
        
        if (!user) {
            const error = new Error("No account found with this email address.") as AuthError;
            error.code = "INVALID_EMAIL";
            throw error;
        }

        if (user.password !== password) {
            const error = new Error("Incorrect password. Please try again.") as AuthError;
            error.code = "INVALID_PASSWORD";
            throw error;
        }

        setInitialUserId(user.id);
        if (typeof window !== "undefined") {
            localStorage.setItem(AUTH_STORAGE_KEY, user.id);
        }
    };

    const signup = (data: SignupData): void => {
        const existingUser = findUserByEmail(data.email);
        
        if (existingUser) {
            const error = new Error("An account with this email already exists.") as AuthError;
            error.code = "EMAIL_EXISTS";
            throw error;
        }

        const localUsers = getLocalUsers();
        const newUser: User = {
            id: `user-${crypto.randomUUID()}`,
            name: data.name,
            email: data.email,
            password: data.password,
            avatar: generateAvatar(data.name),
            location: data.location || "",
            rating: 0,
            reviewCount: 0,
            bio: "",
            memberSince: new Date().toISOString(),
        };

        const updatedLocalUsers = [...localUsers, newUser];
        saveLocalUsers(updatedLocalUsers);

        setInitialUserId(newUser.id);
        if (typeof window !== "undefined") {
            localStorage.setItem(AUTH_STORAGE_KEY, newUser.id);
        }
    };

    const logout = (): void => {
        setInitialUserId(null);
        if (typeof window !== "undefined") {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    };

    const value = useMemo(
        () => ({
            currentUser,
            login,
            signup,
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
 */
export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
