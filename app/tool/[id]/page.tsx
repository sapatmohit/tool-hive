"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/Container";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Avatar from "@/components/Avatar";
import PaymentModal from "@/components/PaymentModal";
import { Spinner } from "@/components/Loader";
import { getToolById } from "@/services/browseService";
import { createRequest } from "@/services/requestService";
import { get } from "@/services/apiClient";
import { useAuth } from "@/context/AuthContext";
import {
    IoLocationOutline,
    IoCheckmarkCircleOutline,
    IoCardOutline,
    IoShieldCheckmarkOutline,
    IoCopyOutline,
} from "react-icons/io5";
import { Tool, User } from "@/types";
import { PaymentResult } from "@/services/paymentService";

interface BookingForm {
    startDate: string;
    endDate: string;
    message: string;
}

export default function ToolDetailsPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { currentUser } = useAuth();

    const [tool, setTool] = useState<Tool | null>(null);
    const [owner, setOwner] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [payModalOpen, setPayModalOpen] = useState(false);

    // Payment result state
    const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
    const [confirmedBooking, setConfirmedBooking] = useState<BookingForm | null>(null);
    const [copiedTxn, setCopiedTxn] = useState(false);

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

    const handlePaymentSuccess = useCallback(async (result: PaymentResult, booking: BookingForm) => {
        setPaymentResult(result);
        setConfirmedBooking(booking);

        // Also persist the borrow request in "the system"
        if (currentUser && tool) {
            await createRequest({
                toolId: tool.id,
                requesterId: currentUser.id,
                ownerId: tool.ownerId,
                startDate: booking.startDate,
                endDate: booking.endDate,
                message: booking.message,
                status: "approved", // auto-approved on payment success
                createdAt: new Date().toISOString(),
<<<<<<< authentication
            }, currentUser?.id ?? null);
            setRequestSent(true);
            setModalOpen(false);
        } catch (error) {
            if (error instanceof Error && error.name === "AuthenticationError") {
                alert(error.message);
            } else {
                alert("Failed to send request. Please try again.");
            }
        } finally {
            setRequestLoading(false);
=======
            });
        }
    }, [currentUser, tool]);

    const copyTxn = () => {
        if (paymentResult?.transactionId) {
            navigator.clipboard.writeText(paymentResult.transactionId);
            setCopiedTxn(true);
            setTimeout(() => setCopiedTxn(false), 2000);
>>>>>>> main
        }
    };

    const calcDays = (start: string, end: string) =>
        start && end
            ? Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000) + 1)
            : 1;

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
    if (!tool) return null;

    const isPaid = paymentResult?.status === "success";

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

                        {/* Payment confirmation card (shown after successful payment) */}
                        {isPaid && confirmedBooking && paymentResult && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <IoCheckmarkCircleOutline className="text-2xl text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-emerald-800">Booking Confirmed!</p>
                                        <p className="text-sm text-emerald-600">Your payment was processed successfully.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-white rounded-xl p-3 border border-emerald-100">
                                        <span className="text-gray-400 text-xs font-semibold block mb-0.5">From</span>
                                        <span className="font-bold text-gray-900">
                                            {new Date(confirmedBooking.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                    </div>
                                    <div className="bg-white rounded-xl p-3 border border-emerald-100">
                                        <span className="text-gray-400 text-xs font-semibold block mb-0.5">To</span>
                                        <span className="font-bold text-gray-900">
                                            {new Date(confirmedBooking.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                    </div>
                                    <div className="bg-white rounded-xl p-3 border border-emerald-100">
                                        <span className="text-gray-400 text-xs font-semibold block mb-0.5">Amount Paid</span>
                                        <span className="font-bold text-gray-900">₹{paymentResult.amount}</span>
                                    </div>
                                    <div className="bg-white rounded-xl p-3 border border-emerald-100">
                                        <span className="text-gray-400 text-xs font-semibold block mb-0.5">Method</span>
                                        <span className="font-bold text-gray-900 capitalize flex items-center gap-1">
                                            <IoCardOutline className="text-sm" /> {paymentResult.method}
                                        </span>
                                    </div>
                                </div>
                                {/* Transaction ID */}
                                <div className="bg-white rounded-xl border border-emerald-100 p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-400 font-semibold">Transaction ID</span>
                                        <button
                                            onClick={copyTxn}
                                            className="flex items-center gap-1 text-xs text-[#FF385C] font-semibold hover:underline cursor-pointer"
                                        >
                                            <IoCopyOutline /> {copiedTxn ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                    <p className="font-mono text-xs text-gray-700 break-all">{paymentResult.transactionId}</p>
                                </div>
                                <Link href="/borrowed">
                                    <Button variant="secondary" size="md" fullWidth>
                                        View in My Borrowed →
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right: Booking card + Owner */}
                    <div className="space-y-4 sticky top-24 self-start">
                        {/* Booking panel */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-3xl font-extrabold text-gray-900">₹{tool.pricePerDay}</span>
                                <span className="text-gray-500 mb-1 text-sm">/day</span>
                            </div>

                            {isPaid ? (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                                    <p className="text-emerald-700 font-semibold flex flex-row items-center justify-center gap-1.5">
                                        <IoCheckmarkCircleOutline className="text-xl" /> Booked & Paid
                                    </p>
                                    <p className="text-emerald-600 text-sm mt-1">Enjoy your rental!</p>
                                </div>
                            ) : !currentUser ? (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    fullWidth
                                    onClick={() => router.push(`/login?redirect=/tool/${tool.id}`)}
                                >
                                    Login to Borrow
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    disabled={!tool.availability || currentUser?.id === tool.ownerId}
                                    onClick={() => setPayModalOpen(true)}
                                    className="shadow-lg shadow-[#FF385C]/25 hover:shadow-[#FF385C]/40 hover:-translate-y-0.5 transition-all"
                                >
                                    {!tool.availability ? "Currently Unavailable" :
                                        currentUser?.id === tool.ownerId ? "Your Listing" : "Borrow & Pay Now"}
                                </Button>
                            )}

                            {/* Trust badges */}
                            {!isPaid && tool.availability && currentUser?.id !== tool.ownerId && (
                                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                                    <IoShieldCheckmarkOutline className="text-emerald-500" />
                                    Secure mock payment · No real charge
                                </div>
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

            {/* Payment Modal */}
            {tool && (
                <PaymentModal
                    isOpen={payModalOpen}
                    onClose={() => setPayModalOpen(false)}
                    tool={tool}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
}
