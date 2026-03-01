/**
 * EmptyState.jsx — Illustrated empty placeholder.
 * SINGLE SOURCE OF TRUTH.
 */

import { IoFolderOpenOutline } from "react-icons/io5";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    action?: React.ReactNode;
}

export default function EmptyState({
    icon = <IoFolderOpenOutline />,
    title = "Nothing here yet",
    description = "",
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="text-6xl mb-5 select-none text-gray-300" aria-hidden>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            {description && (
                <p className="text-gray-500 text-sm max-w-sm mb-6">{description}</p>
            )}
            {action && <div>{action}</div>}
        </div>
    );
}
