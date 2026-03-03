"use client";

import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { IoHourglassOutline, IoCheckmarkOutline, IoCloseOutline, IoConstructOutline, IoCalendarOutline, IoTimeOutline } from "react-icons/io5";
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

    // Duration calculation
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const totalAmount = ((tool?.pricePerDay ?? 0) * days).toFixed(2);

    // Time left calculation
    const now = new Date();
    const isStarted = now >= start;
    const isEnded = now > end;

    let timeLeftDisplay = null;
    if (status === "approved" && !isEnded) {
        if (!isStarted) {
            const daysToStart = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            timeLeftDisplay = `Starts in ${daysToStart}d`;
        } else {
            const daysLeft = Math.max(1, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
            timeLeftDisplay = `${daysLeft} days left`;
        }
    }

    return (
        <Card className="flex flex-col gap-4 hover:shadow-md transition-shadow">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Avatar src={person?.avatar} name={person?.name} size="md" border />
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{person?.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{person?.location}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    {timeLeftDisplay && (
                        <Badge variant="airbnb" className="animate-pulse">
                            <IoTimeOutline className="inline mr-1" /> {timeLeftDisplay}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Tool info */}
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-100">
                            <IoConstructOutline className="text-gray-400" />
                        </div>
                        <h4 className="font-bold text-gray-900 group-hover:text-[#FF385C] transition-colors">
                            {toolName}
                        </h4>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Paid</p>
                        <p className="text-sm font-black text-gray-900">₹{totalAmount}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold pt-3 border-t border-gray-200/60">
                    <span className="flex items-center gap-1.5">
                        <IoCalendarOutline className="text-[#FF385C]" />
                        {startDate} → {endDate}
                    </span>
                    <span className="bg-gray-200/50 px-2 py-0.5 rounded-full text-gray-600">
                        {days} day{days > 1 ? "s" : ""}
                    </span>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className="relative">
                    <p className="text-sm text-gray-600 italic bg-blue-50/50 rounded-2xl px-4 py-3 border-l-4 border-[#FF385C]/30 leading-relaxed">
                        &ldquo;{message}&rdquo;
                    </p>
                </div>
            )}

            {/* Actions — owner only for pending */}
            {viewMode === "owner" && status === "pending" && (
                <div className="flex gap-2.5 mt-1">
                    <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => onApprove(request.id)}
                        className="rounded-xl"
                    >
                        <IoCheckmarkOutline className="inline mr-1" /> Approve
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        onClick={() => onReject(request.id)}
                        className="rounded-xl border border-gray-200 bg-white"
                    >
                        <IoCloseOutline className="inline mr-1" /> Reject
                    </Button>
                </div>
            )}
        </Card>
    );
}
