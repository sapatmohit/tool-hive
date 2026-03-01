"use client";

import { useState } from "react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";

/**
 * SearchBar.jsx — Browse module keyword + location search.
 * Business-specific component; lives in browse module.
 */
interface SearchBarProps {
    onSearch: (query: string) => void;
    initialQuery?: string;
}

export default function SearchBar({ onSearch, initialQuery = "" }: SearchBarProps) {
    const [query, setQuery] = useState(initialQuery);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center gap-3 bg-white rounded-2xl border-2 border-gray-200
                      shadow-md hover:shadow-lg transition-shadow duration-300 p-2">

                {/* Search icon + input */}
                <div className="flex items-center gap-2 flex-1 px-2">
                    <span className="text-gray-400 flex-shrink-0"><IoSearchOutline className="text-xl" /></span>
                    <input
                        type="text"
                        placeholder="What tool are you looking for?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full text-sm text-gray-800 placeholder:text-gray-400
                       outline-none bg-transparent py-2"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => { setQuery(""); onSearch(""); }}
                            className="text-gray-400 hover:text-gray-600 flex-shrink-0 text-xs cursor-pointer"
                        >
                            <IoCloseOutline className="text-lg" />
                        </button>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-200 flex-shrink-0" />

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold
                     rounded-xl px-5 py-2.5 text-sm transition-colors cursor-pointer flex-shrink-0"
                >
                    Search
                </button>
            </div>
        </form>
    );
}
