"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/Container";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Avatar from "@/components/Avatar";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import { Spinner } from "@/components/Loader";
import { getToolById } from "@/services/browseService";
import { createRequest } from "@/services/requestService";
import { get } from "@/services/apiClient";
import { useAuth } from "@/context/AuthContext";
import { IoLocationOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { Tool, User } from "@/types";
import { getAllTools } from "@/services/browseService";

export default function ToolDetailsPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { currentUser } = useAuth();

    const [tool, setTool] = useState<Tool | null>(null);
    const [owner, setOwner] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [form, setForm] = useState({ startDate: "", endDate: "", message: "" });

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const t = await getToolById(id);
                if (!t) { router.push("/browse"); return; }
                setTool(t);
                const users = await get<User[]>("/users");
                setOwner(users.find((u) => u.id === t.ownerId) ?? null);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id, router]);

    const days =
        form.startDate && form.endDate
            ? Math.max(1, Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
            : 1;

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !tool) return;
        setRequestLoading(true);
        try {
            await createRequest({
                toolId: tool.id,
                requesterId: currentUser.id,
                ownerId: tool.ownerId,
                startDate: form.startDate,
                endDate: form.endDate,
                message: form.message,
                status: "pending",
                createdAt: new Date().toISOString(),
            });
            setRequestSent(true);
            setModalOpen(false);
        } finally {
            setRequestLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
    if (!tool) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Container className="py-8">
                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 cursor-pointer transition-colors"
                >
                    ← Back to Browse
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Image + details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero image */}
                        <div className="relative w-full h-80 md:h-[420px] rounded-2xl overflow-hidden shadow-lg">
                            <Image
                                src={tool.image}
                                alt={tool.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 66vw"
                                priority
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <Badge variant={tool.availability ? "success" : "danger"}>
                                    {tool.availability ? "✓ Available" : "Unavailable"}
                                </Badge>
                                <Badge variant="default">{tool.category}</Badge>
                            </div>
                        </div>

                        {/* Details card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{tool.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                <span className="flex items-center gap-1"><IoLocationOutline className="text-base" /> {tool.location}</span>
                                <span>★ <strong className="text-gray-900">{tool.rating}</strong> ({tool.reviewCount} reviews)</span>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{tool.description}</p>
                        </div>
                    </div>

                    {/* Right: Booking card + Owner */}
                    <div className="space-y-4">
                        {/* Booking panel */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sticky top-24">
                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-3xl font-extrabold text-gray-900">₹{tool.pricePerDay}</span>
                                <span className="text-gray-500 mb-1 text-sm">/day</span>
                            </div>

                            {requestSent ? (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                                    <p className="text-emerald-700 font-semibold flex flex-row items-center justify-center gap-1.5"><IoCheckmarkCircleOutline className="text-xl" /> Request sent!</p>
                                    <p className="text-emerald-600 text-sm mt-1">The owner will respond soon.</p>
                                </div>
                            ) : (
                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    disabled={!tool.availability || currentUser?.id === tool.ownerId}
                                    onClick={() => setModalOpen(true)}
                                >
                                    {!tool.availability ? "Currently Unavailable" :
                                        currentUser?.id === tool.ownerId ? "Your Listing" : "Request to Borrow"}
                                </Button>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Category</span>
                                    <span className="font-medium text-gray-900">{tool.category}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Location</span>
                                    <span className="font-medium text-gray-900">{tool.location}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Rating</span>
                                    <span className="font-medium text-gray-900">★ {tool.rating} ({tool.reviewCount})</span>
                                </div>
                            </div>
                        </div>

                        {/* Owner card */}
                        {owner && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">Listed by</h3>
                                <div className="flex items-center gap-3 mb-3">
                                    <Avatar src={owner.avatar} name={owner.name} size="lg" />
                                    <div>
                                        <p className="font-bold text-gray-900">{owner.name}</p>
                                        <p className="text-xs text-gray-500">{owner.location}</p>
                                        <p className="text-xs text-amber-500 font-medium">★ {owner.rating} · {owner.reviewCount} reviews</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 italic">&ldquo;{owner.bio}&rdquo;</p>
                                <p className="text-xs text-gray-400 mt-2">Member since {new Date(owner.memberSince).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
                            </div>
                        )}
                    </div>
                </div>
            </Container>

            {/* Request Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Request to Borrow">
                <form onSubmit={handleRequest} className="flex flex-col gap-4">
                    <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700">
                        <span className="font-semibold">{tool.name}</span> — ₹{tool.pricePerDay}/day
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            id="start-date"
                            label="Start Date"
                            type="date"
                            value={form.startDate}
                            onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                            required
                        />
                        <Input
                            id="end-date"
                            label="End Date"
                            type="date"
                            value={form.endDate}
                            onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                            required
                        />
                    </div>

                    {form.startDate && form.endDate && (
                        <div className="text-sm text-gray-600 bg-blue-50 rounded-xl px-4 py-3">
                            {days} day{days > 1 ? "s" : ""} · <strong>₹{Math.round(tool.pricePerDay * days)}</strong> total
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="req-msg" className="text-sm font-semibold text-gray-700">Message to owner</label>
                        <textarea
                            id="req-msg"
                            rows={3}
                            placeholder="Tell the owner why you need it and how you'll use it…"
                            value={form.message}
                            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900
                        resize-none outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 transition-all"
                        />
                    </div>

                    <Button variant="primary" size="lg" type="submit" fullWidth loading={requestLoading}>
                        Send Request
                    </Button>
                </form>
            </Modal>
        </div>
    );
}
