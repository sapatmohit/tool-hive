"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/";
    const { currentUser, signup, isLoading } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [location, setLocation] = useState("");
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

        if (!name.trim()) {
            setError("Name is required.");
            return;
        }

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);

        try {
            signup({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
                location: location.trim() || undefined,
            });
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
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-500">Join ToolHive and start sharing tools</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            <Input
                                id="name"
                                label="Full Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                required
                            />

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
                                id="location"
                                label="Location (optional)"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g., Mumbai, MH"
                            />

                            <Input
                                id="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                required
                            />

                            <Input
                                id="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />

                            <Button
                                variant="primary"
                                size="lg"
                                type="submit"
                                fullWidth
                                loading={submitting}
                            >
                                Create Account
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                            <p className="text-gray-500 text-sm">
                                Already have an account?{" "}
                                <Link
                                    href={redirect === "/" ? "/login" : `/login?redirect=${encodeURIComponent(redirect)}`}
                                    className="text-[#FF385C] font-semibold hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
