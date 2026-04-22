"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import { SkeletonCard } from "@/components/Loader";
import SearchBar from "@/components/SearchBar";
import FilterSidebar, { FilterState } from "@/components/FilterSidebar";
import ToolCard from "@/components/ToolCard";
import { searchTools, getCategories } from "@/services/browseService";
import { IoSearchOutline, IoFilterOutline, IoSwapVerticalOutline } from "react-icons/io5";
import { Tool } from "@/types";

function BrowseContent() {
    const searchParams = useSearchParams();
    const initialQ = searchParams.get("q") ?? "";

    const [tools, setTools] = useState<Tool[]>([]);
    const [totalTools, setTotalTools] = useState(0);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [loading, setLoading] = useState(true);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        category: "All",
        available: false,
        sort: "default",
        location: "all",
        userContextLocation: "",
        minPrice: 0,
        maxPrice: 2000,
    });
    const [query, setQuery] = useState(initialQ);
    const [userLocation, setUserLocation] = useState<string>("");
    const [isLocating, setIsLocating] = useState(false);
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 9;

    const load = useCallback(async (q: string, f: any, p: number) => {
        setLoading(true);
        try {
            const [results, cats] = await Promise.all([
                searchTools(q, { ...f, page: p, limit: PAGE_SIZE }),
                getCategories(),
            ]);
            setTools(results.tools);
            setTotalTools(results.total);
            setCategories(cats);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        load(query, filters, page); 
    }, [query, filters, page, load]);

    const handleSearch = (q: string) => { 
        setQuery(q); 
        setPage(1); // Reset to first page on search
    };
    const getUserLocationString = async (): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation not supported"));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                        const data = await res.json();
                        const city = data.city || data.locality || "";
                        let state = data.principalSubdivisionCode ? data.principalSubdivisionCode.split("-").pop() : data.principalSubdivision || "";
                        resolve(`${city}, ${state}`);
                    } catch (err) {
                        reject(err);
                    }
                },
                (err) => reject(err)
            );
        });
    };

    const handleFilter = async (f: FilterState) => {
        setPage(1);
        if ((f.location === "nearby" || f.location === "state") && !userLocation) {
            setIsLocating(true);
            try {
                const locStr = await getUserLocationString();
                setUserLocation(locStr);
                setFilters({ ...f, userContextLocation: locStr });
            } catch (error) {
                console.error("Could not get location:", error);
                alert("Could not access your location. Showing all tools.");
                setFilters({ ...f, location: "all" });
            } finally {
                setIsLocating(false);
            }
        } else {
            setFilters({ ...f, userContextLocation: userLocation });
        }
    };

    const handleClearFilters = () => {
        setPage(1);
        setFilters({
            category: "All",
            available: false,
            sort: "default",
            location: "all",
            userContextLocation: userLocation,
            minPrice: 0,
            maxPrice: 2000,
        });
    };

    const totalPages = Math.ceil(totalTools / PAGE_SIZE);

    const sortOptions = [
        { value: "default", label: "Recommended" },
        { value: "price_asc", label: "Price: Low → High" },
        { value: "price_desc", label: "Price: High → Low" },
        { value: "rating", label: "Top Rated" },
    ];


    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero strip */}
            <div className="bg-white border-b border-gray-100 py-8">
                <Container>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Find tools near you
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Browse {totalTools > 0 ? totalTools : "…"} tools available from your neighbors
                    </p>
                    <div className="max-w-2xl">
                        <SearchBar onSearch={handleSearch} initialQuery={query} />
                    </div>
                </Container>
            </div>

            <Container className="py-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start relative">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block w-72 shrink-0 sticky top-24 z-20">
                        <FilterSidebar 
                            categories={categories} 
                            filters={filters} 
                            onFilterChange={handleFilter} 
                            onClearFilters={handleClearFilters} 
                        />
                    </div>

                    {/* Mobile Filters Overlay */}
                    {isMobileFiltersOpen && (
                        <div className="fixed inset-0 z-50 flex lg:hidden">
                            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
                            <div className="relative w-full max-w-sm bg-white h-full overflow-y-auto animate-slide-in-right">
                                <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10 flex justify-between items-center">
                                    <h2 className="font-bold text-gray-900 text-lg">Filters</h2>
                                    <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-gray-900">
                                        Close
                                    </button>
                                </div>
                                <div className="p-4">
                                     <FilterSidebar 
                                        categories={categories} 
                                        filters={filters} 
                                        onFilterChange={handleFilter} 
                                        onClearFilters={handleClearFilters} 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* Top Bar (Active filters / Sort / Mobile toggle) */}
                        <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setIsMobileFiltersOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-colors border border-gray-200"
                                >
                                    <IoFilterOutline /> Filters
                                </button>
                                
                                {isLocating ? (
                                    <div className="text-sm text-[#FF385C] font-semibold animate-pulse flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full border-2 border-[#FF385C] border-t-transparent animate-spin"></span>
                                        Locating...
                                    </div>
                                ) : userLocation && filters.location !== "all" ? (
                                    <div className="text-xs text-gray-500 font-medium bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        Near: <span className="text-gray-900 font-bold">{userLocation}</span>
                                    </div>
                                ) : null}
                            </div>

                            <div className="flex items-center gap-3 ml-auto">
                                <span className="text-sm font-semibold text-gray-500 hidden sm:block whitespace-nowrap">Sort by:</span>
                                <div className="relative">
                                     <select
                                        value={filters.sort || "default"}
                                        onChange={(e) => handleFilter({ ...filters, sort: e.target.value })}
                                        className="appearance-none text-sm font-semibold border-2 border-gray-100 rounded-xl pl-4 pr-10 py-2.5
                                        text-gray-800 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:border-[#FF385C] focus:bg-white
                                        cursor-pointer transition-colors"
                                        aria-label="Sort by"
                                    >
                                        {sortOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <IoSwapVerticalOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg" />
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 9 }).map((_, i) => (
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
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tools.map((tool) => (
                                        <ToolCard key={tool.id} tool={tool} />
                                    ))}
                                </div>
                                
                                {totalPages > 1 && (
                                    <div className="mt-12 flex justify-center items-center gap-4">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-6 py-2.5 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-700
                                            hover:border-[#FF385C] hover:text-[#FF385C] disabled:opacity-50 disabled:hover:border-gray-100 
                                            disabled:hover:text-gray-700 transition-all shadow-sm"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm font-bold text-gray-500">
                                            Page <span className="text-gray-900">{page}</span> of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="px-6 py-2.5 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-700
                                            hover:border-[#FF385C] hover:text-[#FF385C] disabled:opacity-50 disabled:hover:border-gray-100 
                                            disabled:hover:text-gray-700 transition-all shadow-sm"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
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
