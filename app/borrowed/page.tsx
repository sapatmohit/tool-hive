"use client";

import { useState, useEffect, useCallback } from "react";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import { Spinner } from "@/components/Loader";
import Button from "@/components/Button";
import RequestCard from "@/components/RequestCard";
import { getBorrowedByUser } from "@/services/requestService";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { IoHomeOutline, IoWalletOutline, IoRocketOutline } from "react-icons/io5";
import { BorrowRequest } from "@/types";

const TAB_FILTERS: Record<string, (r: BorrowRequest) => boolean> = {
    all: () => true,
    pending: (r: BorrowRequest) => r.status === "pending",
    approved: (r: BorrowRequest) => r.status === "approved",
    rejected: (r: BorrowRequest) => r.status === "rejected",
};

export default function BorrowedPage() {
    const { currentUser } = useAuth();
    const [requests, setRequests] = useState<BorrowRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    const load = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await getBorrowedByUser(currentUser.id);
            setRequests(data);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => { load(); }, [load]);

    const visible = requests.filter(TAB_FILTERS[activeTab] ?? TAB_FILTERS.all);

    const approvedRequests = requests.filter(r => r.status === "approved");
    const totalSpent = approvedRequests.reduce((sum, r) => {
        const days = Math.max(1, Math.ceil((new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1);
        return sum + (r.tool?.pricePerDay ?? 0) * days;
    }, 0);

    const tabs = [
        { key: "all", label: "All Borrows" },
        { key: "pending", label: "Requested" },
        { key: "approved", label: "Active Loans" },
        { key: "rejected", label: "History" },
    ];

    return (
        <div className="min-h-screen bg-[#F7F7F7]">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 pt-10 pb-6">
                <Container>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF385C]/5 text-[#FF385C] text-xs font-bold uppercase tracking-wider mb-3">
                                <IoRocketOutline /> Borrowing Dashboard
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Borrowed Tools</h1>
                            <p className="text-gray-500 mt-2 font-medium">
                                Manage your active loans and tracking pending requests
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 min-w-[160px]">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                                    <IoWalletOutline />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Total Spent</p>
                                    <p className="text-lg font-black text-gray-900">₹{totalSpent.toFixed(0)}</p>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 min-w-[160px]">
                                <div className="w-10 h-10 rounded-xl bg-[#FF385C]/5 text-[#FF385C] flex items-center justify-center text-xl">
                                    <IoRocketOutline />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Active Loans</p>
                                    <p className="text-lg font-black text-gray-900">{approvedRequests.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Sticky Tabs */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-16 z-30">
                <Container>
                    <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar">
                        {tabs.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={[
                                    "px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap cursor-pointer",
                                    activeTab === key
                                        ? "bg-gray-900 text-white shadow-md shadow-gray-200"
                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                                ].join(" ")}
                            >
                                {label}
                                {key === "approved" && approvedRequests.length > 0 && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-[#FF385C] text-white text-[10px] rounded-full">
                                        {approvedRequests.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </Container>
            </div>

            {/* Content */}
            <Container className="py-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Spinner />
                        <p className="text-gray-400 font-bold text-sm animate-pulse">Loading your toolbox...</p>
                    </div>
                ) : visible.length === 0 ? (
                    <div className="max-w-md mx-auto">
                        <EmptyState
                            icon={<IoHomeOutline className="text-6xl text-gray-200" />}
                            title={activeTab === "all" ? "Your toolbox is empty" : `No ${activeTab} items found`}
                            description="Browse the neighborhood to find the tools you need for your next project."
                            action={
                                <Link href="/browse">
                                    <Button variant="primary" size="lg" className="px-8 rounded-2xl shadow-lg shadow-[#FF385C]/20 hover:shadow-[#FF385C]/30">
                                        Explore Tools
                                    </Button>
                                </Link>
                            }
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visible.map((req) => (
                            <RequestCard
                                key={req.id}
                                request={req}
                                viewMode="borrower"
                                onApprove={() => { }}
                                onReject={() => { }}
                            />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}
