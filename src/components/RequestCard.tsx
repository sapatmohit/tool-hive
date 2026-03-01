"use client";

import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { IoHourglassOutline, IoCheckmarkOutline, IoCloseOutline, IoConstructOutline, IoCalendarOutline } from "react-icons/io5";
import { BorrowRequest } from "@/types";

interface StatusConfig {
    variant: "warning" | "success" | "danger" | "info" | "default" | "airbnb";
    label: React.ReactNode;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
    pending: { variant: "warning", label: <><IoHourglassOutline className="inline mr-1" /> Pending</> },
    approved: { variant: "success", label: <><IoCheckmarkOutline className="inline mr-1" /> Approved</> },
    rejected: { variant: "danger", label: <><IoCloseOutline className="inline mr-1" /> Rejected</> },
};

/**
 * RequestCard.jsx — Requests module request display.
 * Uses shared Card, Avatar, Badge, Button.
 */
interface RequestCardProps {
    request: BorrowRequest;
    viewMode?: "owner" | "borrower";
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export default function RequestCard({
    request,
    viewMode = "owner", // "owner" | "borrower"
    onApprove,
    onReject,
}: RequestCardProps) {
    const { tool, requester, owner, startDate, endDate, status, message } = request;
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

    const person = viewMode === "owner" ? requester : owner;
    const toolName = tool?.name ?? "Unknown Tool";

    const days =
        Math.max(
            1,
            Math.ceil(
                (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
            ) + 1
        );
    const total = ((tool?.pricePerDay ?? 0) * days).toFixed(2);

    return (
        <Card className="flex flex-col gap-4">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Avatar src={person?.avatar} name={person?.name} size="md" />
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{person?.name}</p>
                        <p className="text-xs text-gray-500">{person?.location}</p>
                    </div>
                </div>
                <Badge variant={cfg.variant}>{cfg.label}</Badge>
            </div>

            {/* Tool info */}
            <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-semibold text-sm text-gray-900 mb-1"><IoConstructOutline className="inline mr-1 text-gray-400" /> {toolName}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span><IoCalendarOutline className="inline mr-1" /> {startDate} → {endDate}</span>
                    <span>• {days} day{days > 1 ? "s" : ""}</span>
                    <span className="ml-auto font-semibold text-gray-900">₹{total}</span>
                </div>
            </div>

            {/* Message */}
            {message && (
                <p className="text-sm text-gray-600 italic bg-blue-50 rounded-xl px-3 py-2 border-l-4 border-blue-300">
                    &ldquo;{message}&rdquo;
                </p>
            )}

            {/* Actions — owner only for pending */}
            {viewMode === "owner" && status === "pending" && (
                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => onApprove(request.id)}
                    >
                        <IoCheckmarkOutline className="inline mr-1" /> Approve
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        fullWidth
                        onClick={() => onReject(request.id)}
                    >
                        <IoCloseOutline className="inline mr-1" /> Reject
                    </Button>
                </div>
            )}
        </Card>
    );
}
