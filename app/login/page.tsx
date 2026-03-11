"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/context/AuthContext";

import { Suspense } from "react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/";
    const { currentUser, login, isLoading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isLoading && currentUser) {
            router.push(redirect);
        }
    }, [currentUser, isLoading, redirect, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            login(email, password);
            router.push(redirect);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
        );
    }

    if (currentUser) {
        return null;
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-500">Sign in to continue to ToolHive</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />

                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />

                    <Button
                        variant="primary"
                        size="lg"
                        type="submit"
                        fullWidth
                        loading={submitting}
                    >
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-500 text-sm">
                        Don&apos;t have an account?{" "}
                        <Link
                            href={redirect === "/" ? "/signup" : `/signup?redirect=${encodeURIComponent(redirect)}`}
                            className="text-[#FF385C] font-semibold hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                <p className="text-sm text-gray-600 font-medium mb-2">Demo accounts:</p>
                <div className="text-xs text-gray-500 space-y-1">
                    <p>Email: alex.martinez@email.com</p>
                    <p>Password: demo123</p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <Container>
                <Suspense fallback={
                    <div className="max-w-md mx-auto text-center">
                        <div className="animate-pulse text-gray-400">Loading auth...</div>
                    </div>
                }>
                    <LoginForm />
                </Suspense>
            </Container>
        </div>
    );
}
