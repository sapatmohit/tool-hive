/**
 * Loader.jsx — Spinner and skeleton loaders.
 * SINGLE SOURCE OF TRUTH.
 */

interface SpinnerProps {
    size?: "sm" | "md" | "lg";
}

export function Spinner({ size = "md" }: SpinnerProps) {
    const s = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" }[size] ?? "w-8 h-8";
    return (
        <div className="flex items-center justify-center py-12">
            <div
                className={`${s} border-4 border-gray-200 border-t-[#FF385C] rounded-full animate-spin`}
            />
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 animate-pulse">
            <div className="w-full h-52 bg-gray-200" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                <div className="h-3 bg-gray-200 rounded-full w-1/2" />
                <div className="h-3 bg-gray-200 rounded-full w-1/3" />
            </div>
        </div>
    );
}

export default function Loader() {
    return <Spinner />;
}
