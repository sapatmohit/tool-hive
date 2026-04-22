"use client";

/**
 * AuthContext.tsx
 *
 * Migrated to NextAuth.js. Now uses SessionProvider internally
 * but maintains the useAuth hook for easy consumption across components.
 */

import { createContext, useContext, useMemo } from "react";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { User } from "@/types";

interface SignupData {
    name: string;
    email: string;
    password: string;
    location?: string;
}

interface AuthContextType {
    currentUser: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function generateAvatar(name: string): string {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff`;
}

function AuthInternalProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    
    const currentUser = useMemo(() => {
        if (!session?.user) return null;
        return {
            id: (session.user as any).id || "",
            email: session.user.email || "",
            name: session.user.name || "",
            avatar: session.user.image || "",
            password: "",
            rating: 0,
            reviewCount: 0,
            location: "",
            memberSince: "",
            bio: ""
        } as User;
    }, [session]);

    const login = async (email: string, password: string) => {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            throw new Error(result.error);
        }
    };

    const signup = async (data: SignupData) => {
        const res = await fetch(`/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...data,
                avatar: generateAvatar(data.name),
                memberSince: new Date().toISOString().split("T")[0],
            }),
        });

        const body = await res.json();

        if (!res.ok) {
            throw new Error(body.error || "Signup failed");
        }

        // Auto login after signup
        await login(data.email, data.password);
    };

    const logout = () => signOut({ callbackUrl: "/" });

    const value = useMemo(
        () => ({ 
            currentUser, 
            login, 
            signup, 
            logout, 
            isLoading: status === "loading" 
        }),
        [currentUser, status]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthInternalProvider>{children}</AuthInternalProvider>
        </SessionProvider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
