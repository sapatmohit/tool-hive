/**
 * Badge.jsx — Status / category pill.
 * SINGLE SOURCE OF TRUTH: never recreate in modules.
 */

"use client";

const variants = {
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-600",
    info: "bg-blue-100 text-blue-700",
    default: "bg-gray-100 text-gray-600",
    airbnb: "bg-[#FF385C]/10 text-[#FF385C]",
};

interface BadgeProps {
    children: React.ReactNode;
    variant?: "success" | "warning" | "danger" | "info" | "default" | "airbnb";
    className?: string;
}

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
    return (
        <span
            className={[
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                variants[variant] ?? variants.default,
                className,
            ].join(" ")}
        >
            {children}
        </span>
    );
}
