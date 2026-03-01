"use client";

/**
 * FilterBar.jsx — Browse module filter controls.
 * Category chips, availability toggle, sort selector.
 */
interface FilterBarProps {
    categories: string[];
    filters: { category?: string; available?: boolean; sort?: string };
    onFilterChange: (filters: { category?: string; available?: boolean; sort?: string }) => void;
}

export default function FilterBar({ categories, filters, onFilterChange }: FilterBarProps) {
    const sortOptions = [
        { value: "default", label: "Recommended" },
        { value: "price_asc", label: "Price: Low → High" },
        { value: "price_desc", label: "Price: High → Low" },
        { value: "rating", label: "Top Rated" },
    ];

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">

            {/* Category chips */}
            <div className="flex items-center gap-2 flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onFilterChange({ ...filters, category: cat })}
                        className={[
                            "px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer",
                            filters.category === cat
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
                        ].join(" ")}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Availability toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                    className={[
                        "w-11 h-6 rounded-full transition-colors duration-200 relative",
                        filters.available ? "bg-[#FF385C]" : "bg-gray-300",
                    ].join(" ")}
                    onClick={() => onFilterChange({ ...filters, available: !filters.available })}
                >
                    <div
                        className={[
                            "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
                            filters.available ? "translate-x-6" : "translate-x-1",
                        ].join(" ")}
                    />
                </div>
                <span className="text-sm font-medium text-gray-700">Available only</span>
            </label>

            {/* Sort dropdown */}
            <select
                value={filters.sort || "default"}
                onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2
                   text-gray-700 bg-white focus:outline-none focus:border-[#FF385C]
                   cursor-pointer transition-colors"
            >
                {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
