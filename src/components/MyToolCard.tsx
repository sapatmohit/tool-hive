"use client";

import Image from "next/image";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { IoLocationOutline, IoStar, IoCheckmarkOutline, IoCloseOutline, IoPencilOutline, IoPauseOutline, IoPlayOutline, IoTrashOutline } from "react-icons/io5";
import { Tool } from "@/types";

/**
 * MyToolCard.jsx — Tools module owner's tool card.
 * Extends shared Card; adds edit, delete, and availability toggle.
 */
interface MyToolCardProps {
    tool: Tool;
    onEdit: (tool: Tool) => void;
    onDelete: (id: string) => void;
    onToggleAvailability: (tool: Tool) => void;
}

export default function MyToolCard({ tool, onEdit, onDelete, onToggleAvailability }: MyToolCardProps) {
    const { name, image, location, availability, pricePerDay, rating, reviewCount, category } = tool;

    return (
        <Card hoverable={false} padding={false} className="overflow-hidden">
            {/* Image */}
            <div className="relative w-full h-44 overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                    <Badge variant={availability ? "success" : "danger"}>
                        {availability ? <><IoCheckmarkOutline className="inline mr-1" /> Available</> : <><IoCloseOutline className="inline mr-1" /> Unavailable</>}
                    </Badge>
                </div>
                <div className="absolute top-3 right-3">
                    <Badge variant="default">{category}</Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm truncate mb-1">{name}</h3>
                <p className="text-gray-500 text-xs flex items-center gap-1 mb-1">
                    <IoLocationOutline className="text-base" />{location}
                </p>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500">
                        <IoStar className="text-amber-400" />{" "}
                        <span className="font-medium text-gray-700">{rating}</span> ({reviewCount})
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                        ${pricePerDay}<span className="text-xs font-normal text-gray-500">/day</span>
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(tool)}
                        className="flex-1"
                    >
                        <IoPencilOutline className="inline mr-1" /> Edit
                    </Button>
                    <Button
                        variant={availability ? "ghost" : "primary"}
                        size="sm"
                        onClick={() => onToggleAvailability(tool)}
                        className="flex-1"
                    >
                        {availability ? <><IoPauseOutline className="inline mr-1" /> Pause</> : <><IoPlayOutline className="inline mr-1" /> Activate</>}
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(tool.id)}
                    >
                        <IoTrashOutline className="text-lg" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
