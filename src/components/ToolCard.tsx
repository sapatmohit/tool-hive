"use client";

import Image from "next/image";
import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { IoLocationOutline, IoStar, IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import { Tool } from "@/types";

/**
 * ToolCard.jsx — Browse module tool listing card.
 * Uses shared Card as base — never recreates Card from scratch.
 */
interface ToolCardProps {
    tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
    const { id, name, image, location, availability, pricePerDay, rating, reviewCount, category } = tool;

    return (
        <Link href={`/tool/${id}`} className="block group">
            <Card hoverable padding={false}>
                {/* Image */}
                <div className="relative w-full h-52 overflow-hidden rounded-t-2xl">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {/* Availability overlay */}
                    <div className="absolute top-3 left-3">
                        <Badge variant={availability ? "success" : "danger"}>
                            {availability ? <><IoCheckmarkOutline className="inline mr-1" /> Available</> : <><IoCloseOutline className="inline mr-1" /> Unavailable</>}
                        </Badge>
                    </div>
                    {/* Category */}
                    <div className="absolute top-3 right-3">
                        <Badge variant="default">{category}</Badge>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate mb-1">
                        {name}
                    </h3>
                    <p className="text-gray-500 text-xs flex items-center gap-1 mb-2">
                        <IoLocationOutline className="text-base" />
                        {location}
                    </p>

                    <div className="flex items-center justify-between">
                        {/* Rating */}
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <IoStar className="text-amber-400" />
                            <span className="font-medium text-gray-700">{rating}</span>
                            <span>({reviewCount})</span>
                        </span>
                        {/* Price */}
                        <span className="text-sm font-bold text-gray-900">
                            ₹{pricePerDay}
                            <span className="text-xs font-normal text-gray-500">/day</span>
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
