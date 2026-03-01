"use client";

import { useState, useEffect, useCallback } from "react";
import Container from "@/components/Container";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";
import { Spinner } from "@/components/Loader";
import RequestCard from "@/components/RequestCard";
import { getRequestsForOwner, updateRequestStatus } from "@/services/requestService";
import { useAuth } from "@/context/AuthContext";
import { IoMailOpenOutline } from "react-icons/io5";
import { BorrowRequest } from "@/types";

const TAB_FILTERS: Record<string, (r: BorrowRequest) => boolean> = {
    all: (r) => true,
    pending: (r: BorrowRequest) => r.status === "pending",
    approved: (r: BorrowRequest) => r.status === "approved",
    rejected: (r: BorrowRequest) => r.status === "rejected",
};

export default function RequestsPage() {
    const { currentUser } = useAuth();
    const [requests, setRequests] = useState<BorrowRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    const load = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await getRequestsForOwner(currentUser.id);
            setRequests(data);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => { load(); }, [load]);

    const handleApprove = async (id: string) => {
        await updateRequestStatus(id, "approved");
        setRequests((prev) => prev.map((r: BorrowRequest) => (r.id === id ? { ...r, status: "approved" } : r)));
    };

    const handleReject = async (id: string) => {
        await updateRequestStatus(id, "rejected");
        setRequests((prev) => prev.map((r: BorrowRequest) => (r.id === id ? { ...r, status: "rejected" } : r)));
    };

    const visible = requests.filter(TAB_FILTERS[activeTab] ?? TAB_FILTERS.all);
    const pendingCount = requests.filter((r: BorrowRequest) => r.status === "pending").length;

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
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-extrabold text-gray-900">Incoming Requests</h1>
                        {pendingCount > 0 && (
                            <Badge variant="airbnb">{pendingCount} pending</Badge>
                        )}
                    </div>
                    <p className="text-gray-500 mt-1">
                        Borrow requests for your tools
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
                                {key === "pending" && pendingCount > 0 && (
                                    <span className="ml-1.5 bg-[#FF385C] text-white text-xs rounded-full px-1.5 py-0.5">
                                        {pendingCount}
                                    </span>
                                )}
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
                        icon={<IoMailOpenOutline />}
                        title="No requests here"
                        description="When neighbors request to borrow your tools, they'll appear here."
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {visible.map((req) => (
                            <RequestCard
                                key={req.id}
                                request={req}
                                viewMode="owner"
                                onApprove={handleApprove}
                                onReject={handleReject}
                            />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}
