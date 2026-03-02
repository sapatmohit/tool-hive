"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import usersData from "@/data/users.json";
import { User } from "@/types";
import { IoLocationOutline, IoStarOutline } from "react-icons/io5";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/";
    const { currentUser, login, isLoading } = useAuth();
    const [selectedUserId, setSelectedUserId] = useState<string>("");

    useEffect(() => {
        if (!isLoading && currentUser) {
            router.push(redirect);
        }
    }, [currentUser, isLoading, redirect, router]);

    const handleLogin = () => {
        if (selectedUserId) {
            login(selectedUserId);
            router.push(redirect);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
        );
    }

    if (currentUser) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <Container>
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome to ToolHive</h1>
                        <p className="text-gray-500">Select a user to continue</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-700">Select User</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {usersData.map((user: User) => (
                                <button
                                    key={user.id}
                                    onClick={() => setSelectedUserId(user.id)}
                                    className={`w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors ${
                                        selectedUserId === user.id ? "bg-[#FF385C]/5" : ""
                                    }`}
                                >
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                                        <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 truncate">{user.name}</div>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <IoLocationOutline className="text-sm" />
                                                {user.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <IoStarOutline className="text-sm" />
                                                {user.rating}
                                            </span>
                                        </div>
                                    </div>
                                    {selectedUserId === user.id && (
                                        <div className="w-5 h-5 rounded-full bg-[#FF385C] flex items-center justify-center shrink-0">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full mt-6"
                        disabled={!selectedUserId}
                        onClick={handleLogin}
                    >
                        Continue as Selected User
                    </Button>

                    <p className="text-center text-sm text-gray-400 mt-4">
                        This is a demo. In Phase 2, real authentication will be added.
                    </p>
                </div>
            </Container>
        </div>
    );
}
