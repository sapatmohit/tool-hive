/**
 * Avatar.jsx — User avatar with image or fallback initials.
 * SINGLE SOURCE OF TRUTH: never recreate in modules.
 */

"use client";

import Image from "next/image";

const sizes = {
    xs: { container: "w-6 h-6", text: "text-[10px]" },
    sm: { container: "w-8 h-8", text: "text-xs" },
    md: { container: "w-10 h-10", text: "text-sm" },
    lg: { container: "w-14 h-14", text: "text-base" },
    xl: { container: "w-20 h-20", text: "text-xl" },
};

function getInitials(name = "") {
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

interface AvatarProps {
    src?: string | null;
    name?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    border?: boolean;
    className?: string;
}

export default function Avatar({ src, name = "", size = "md", border = false, className = "" }: AvatarProps) {
    const s = sizes[size] ?? sizes.md;
    return (
        <div
            className={[
                s.container,
                "rounded-full overflow-hidden flex-shrink-0 relative",
                "bg-gradient-to-br from-[#FF385C] to-[#E31C5F]",
                border ? "border-2 border-white shadow-sm" : "",
                className,
            ].join(" ")}
        >
            {src ? (
                <Image
                    src={src}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="80px"
                />
            ) : (
                <span
                    className={[
                        s.text,
                        "font-semibold text-white w-full h-full flex items-center justify-center",
                    ].join(" ")}
                >
                    {getInitials(name)}
                </span>
            )}
        </div>
    );
}
