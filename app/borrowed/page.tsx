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
import { IoHomeOutline } from "react-icons/io5";
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

    const tabs = [
        { key: "all", label: "All" },
        { key: "pending", label: "Pending" },
        { key: "approved", label: "Approved" },
        { key: "rejected", label: "Rejected" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 py-8">
                <Container>
                    <h1 className="text-3xl font-extrabold text-gray-900">My Borrowed Tools</h1>
                    <p className="text-gray-500 mt-1">
                        Track all your borrow requests and active loans
                    </p>
                </Container>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
                <Container>
                    <div className="flex gap-1 py-2">
                        {tabs.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={[
                                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                                    activeTab === key
                                        ? "bg-[#FF385C]/10 text-[#FF385C]"
                                        : "text-gray-600 hover:bg-gray-100",
                                ].join(" ")}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </Container>
            </div>

            {/* Content */}
            <Container className="py-8">
                {loading ? (
                    <div className="flex justify-center"><Spinner /></div>
                ) : visible.length === 0 ? (
                    <EmptyState
                        icon={<IoHomeOutline />}
                        title={activeTab === "all" ? "No borrows yet" : `No ${activeTab} requests`}
                        description="Start by browsing tools in your neighborhood."
                        action={
                            <Link href="/browse">
                                <Button variant="primary">Browse Tools</Button>
                            </Link>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
