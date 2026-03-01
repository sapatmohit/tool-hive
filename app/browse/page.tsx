"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import { SkeletonCard } from "@/components/Loader";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import ToolCard from "@/components/ToolCard";
import { searchTools, getCategories } from "@/services/browseService";
import { IoSearchOutline } from "react-icons/io5";
import { Tool } from "@/types";

function BrowseContent() {
    const searchParams = useSearchParams();
    const initialQ = searchParams.get("q") ?? "";

    const [tools, setTools] = useState<Tool[]>([]);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: "All",
        available: false,
        sort: "default",
    });
    const [query, setQuery] = useState(initialQ);

    const load = useCallback(async (q: string, f: any) => {
        setLoading(true);
        try {
            const [results, cats] = await Promise.all([
                searchTools(q, f),
                getCategories(),
            ]);
            setTools(results);
            setCategories(cats);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(query, filters); }, [query, filters, load]);

    const handleSearch = (q: string) => { setQuery(q); };
    const handleFilter = (f: any) => { setFilters(f); };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero strip */}
            <div className="bg-white border-b border-gray-100 py-8">
                <Container>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Find tools near you
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Browse {tools.length > 0 ? tools.length : "…"} tools available from your neighbors
                    </p>
                    <SearchBar onSearch={handleSearch} initialQuery={query} />
                </Container>
            </div>

            {/* Filter bar */}
            <div className="bg-white border-b border-gray-100 py-4 sticky top-16 z-30">
                <Container>
                    <FilterBar
                        categories={categories}
                        filters={filters}
                        onFilterChange={handleFilter}
                    />
                </Container>
            </div>

            {/* Grid */}
            <Container className="py-8">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : tools.length === 0 ? (
                    <EmptyState
                        icon={<IoSearchOutline />}
                        title="No tools found"
                        description="Try adjusting your search or filters to find what you're looking for."
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {tools.map((tool) => (
                            <ToolCard key={tool.id} tool={tool} />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}

export default function BrowsePage() {
    return (
        <Suspense fallback={
            <Container className="py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </Container>
        }>
            <BrowseContent />
        </Suspense>
    );
}
