"use client";

import { createContext, useContext, useState } from "react";
import usersData from "@/data/users.json";
import { User } from "@/types";

interface AuthContextType {
    currentUser: User | null;
    login: (userId: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * AuthProvider — wraps the app and exposes the mock logged-in user.
 * In P2, replace the useState initializer with a real auth fetch.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Mock: current user is always users.json[0] (Alex Martinez)
    const [currentUser, setCurrentUser] = useState<User | null>(usersData[0] as User);

    const login = (userId: string) => {
        const user = usersData.find((u: any) => u.id === userId) as User ?? usersData[0] as User;
        setCurrentUser(user);
    };

    const logout = () => setCurrentUser(null);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
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
