/**
 * Card.jsx — Global base card shell.
 * SINGLE SOURCE OF TRUTH: modules extend this, never recreate.
 */

"use client";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    hoverable?: boolean;
    padding?: boolean;
}

export default function Card({
    children,
    className = "",
    onClick,
    hoverable = false,
    padding = true,
}: CardProps) {
    return (
        <div
            onClick={onClick}
            className={[
                "bg-white rounded-2xl border border-gray-100 shadow-sm",
                "transition-all duration-300",
                hoverable
                    ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                    : "",
                padding ? "p-4" : "",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}
