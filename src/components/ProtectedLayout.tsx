"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { IoLockClosedOutline } from "react-icons/io5";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { currentUser, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !currentUser) {
            const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
            router.push(loginUrl);
        }
    }, [currentUser, isLoading, pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Container>
                    <div className="max-w-md mx-auto text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IoLockClosedOutline className="text-3xl text-gray-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
                        <p className="text-gray-500 mb-6">Please log in to access this page.</p>
                        <Button
                            variant="primary"
                            onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}
                        >
                            Go to Login
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    return <>{children}</>;
}
