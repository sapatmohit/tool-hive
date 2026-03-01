/**
 * Button.jsx — Global shared button component.
 * SINGLE SOURCE OF TRUTH: never recreate in modules.
 *
 * Variants: primary | secondary | outline | ghost | danger
 * Sizes:    sm | md | lg
 */

"use client";

const variants = {
    primary:
        "bg-[#FF385C] hover:bg-[#E31C5F] text-white shadow-sm hover:shadow-md",
    secondary:
        "bg-gray-900 hover:bg-gray-700 text-white shadow-sm hover:shadow-md",
    outline:
        "border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
    ghost: "text-gray-700 hover:bg-gray-100",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
};

const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
};

interface ButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
    className?: string;
}

export default function Button({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    fullWidth = false,
    onClick,
    type = "button",
    className = "",
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={[
                "inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
                "transition-all duration-200 cursor-pointer",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant] ?? variants.primary,
                sizes[size] ?? sizes.md,
                fullWidth ? "w-full" : "",
                className,
            ].join(" ")}
        >
            {loading && (
                <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}
