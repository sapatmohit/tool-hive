"use client";

import { useState } from "react";
import { IoChevronDownOutline, IoChevronUpOutline, IoFilterOutline, IoCloseOutline } from "react-icons/io5";

export interface FilterState {
    category: string;
    available: boolean;
    sort: string;
    location: string;
    minPrice: number;
    maxPrice: number;
    userContextLocation?: string;
}

interface FilterSidebarProps {
    categories: string[];
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    onClearFilters: () => void;
    onCloseMobile?: () => void;
}

export default function FilterSidebar({ categories, filters, onFilterChange, onClearFilters, onCloseMobile }: FilterSidebarProps) {
    const defaultMaxPrice = 2000;
    
    // Accordion states
    const [openSections, setOpenSections] = useState({
        location: true,
        category: true,
        price: true,
        availability: true,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, isMin: boolean) => {
        const val = parseInt(e.target.value) || 0;
        if (isMin) {
            onFilterChange({ ...filters, minPrice: val });
        } else {
            onFilterChange({ ...filters, maxPrice: val });
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col max-h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2 text-gray-900 font-extrabold text-lg">
                    <IoFilterOutline className="text-xl text-[#FF385C]" /> Filters
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClearFilters}
                        className="text-sm font-semibold text-gray-500 hover:text-[#FF385C] transition-colors"
                    >
                        Clear All
                    </button>
                    {onCloseMobile && (
                        <button onClick={onCloseMobile} className="lg:hidden p-1 text-gray-500 hover:text-gray-900 bg-gray-50 rounded-full">
                            <IoCloseOutline className="text-xl" />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-6 overflow-y-auto pr-2 pb-4 -mr-2 custom-scrollbar">
                {/* LOCATION SECTION */}
                <div>
                    <button 
                        onClick={() => toggleSection('location')}
                        className="flex items-center justify-between w-full text-left font-bold text-gray-900 mb-4"
                    >
                        Location
                        {openSections.location ? <IoChevronUpOutline className="text-gray-400" /> : <IoChevronDownOutline className="text-gray-400" />}
                    </button>
                    
                    {openSections.location && (
                        <div className="space-y-3">
                            {[
                                { id: "all", label: "Everywhere" },
                                { id: "nearby", label: "Nearby (Same City)" },
                                { id: "state", label: "My State" }
                            ].map((loc) => (
                                <label key={loc.id} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center w-5 h-5">
                                        <input
                                            type="radio"
                                            name="location"
                                            value={loc.id}
                                            checked={filters.location === loc.id}
                                            onChange={() => onFilterChange({ ...filters, location: loc.id })}
                                            className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#FF385C] transition-colors cursor-pointer"
                                        />
                                        <div className={`absolute w-2.5 h-2.5 bg-[#FF385C] rounded-full transition-transform scale-0 ${filters.location === loc.id ? 'scale-100' : ''}`} />
                                    </div>
                                    <span className={`text-sm font-medium transition-colors ${filters.location === loc.id ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                        {loc.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* CATEGORY SECTION */}
                <div className="pt-6 border-t border-gray-100">
                    <button 
                        onClick={() => toggleSection('category')}
                        className="flex items-center justify-between w-full text-left font-bold text-gray-900 mb-4"
                    >
                        Category
                        {openSections.category ? <IoChevronUpOutline className="text-gray-400" /> : <IoChevronDownOutline className="text-gray-400" />}
                    </button>
                    
                    {openSections.category && (
                        <div className="space-y-3">
                            {categories.map((cat) => (
                                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                     <div className="relative flex items-center justify-center w-5 h-5">
                                        <input
                                            type="radio"
                                            name="category"
                                            value={cat}
                                            checked={filters.category === cat}
                                            onChange={() => onFilterChange({ ...filters, category: cat })}
                                            className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#FF385C] transition-colors cursor-pointer"
                                        />
                                        <div className={`absolute w-2.5 h-2.5 bg-[#FF385C] rounded-full transition-transform scale-0 ${filters.category === cat ? 'scale-100' : ''}`} />
                                    </div>
                                    <span className={`text-sm font-medium transition-colors ${filters.category === cat ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                        {cat}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* PRICE SECTION */}
                <div className="pt-6 border-t border-gray-100">
                    <button 
                        onClick={() => toggleSection('price')}
                        className="flex items-center justify-between w-full text-left font-bold text-gray-900 mb-4"
                    >
                        Price (per day)
                        {openSections.price ? <IoChevronUpOutline className="text-gray-400" /> : <IoChevronDownOutline className="text-gray-400" />}
                    </button>
                    
                    {openSections.price && (
                        <div className="space-y-5">
                             {/* Price Range Slider visualization (CSS only for look) */}
                             <div className="px-2">
                                <div className="h-2 w-full bg-gray-100 rounded-full relative">
                                    <div className="absolute h-full bg-[#FF385C]/20 rounded-full" 
                                        style={{ 
                                            left: `${(filters.minPrice / defaultMaxPrice) * 100}%`, 
                                            right: `${100 - (filters.maxPrice / defaultMaxPrice) * 100}%` 
                                        }} 
                                    />
                                </div>
                             </div>

                             <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                                    <input 
                                        type="number" 
                                        min="0"
                                        value={filters.minPrice}
                                        onChange={(e) => handlePriceChange(e, true)}
                                        className="w-full pl-7 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 outline-none focus:border-[#FF385C] focus:bg-white transition-colors"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-gray-400">Min</span>
                                </div>
                                <div className="w-3 h-[2px] bg-gray-300 rounded-full shrink-0" />
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                                    <input 
                                        type="number" 
                                        min="0"
                                        value={filters.maxPrice}
                                        onChange={(e) => handlePriceChange(e, false)}
                                        className="w-full pl-7 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 outline-none focus:border-[#FF385C] focus:bg-white transition-colors"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-gray-400">Max</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* AVAILABILITY SECTION */}
                <div className="pt-6 border-t border-gray-100">
                    <button 
                        onClick={() => toggleSection('availability')}
                        className="flex items-center justify-between w-full text-left font-bold text-gray-900 mb-4"
                    >
                        Availability
                        {openSections.availability ? <IoChevronUpOutline className="text-gray-400" /> : <IoChevronDownOutline className="text-gray-400" />}
                    </button>
                    
                    {openSections.availability && (
                         <label className="flex items-center justify-between cursor-pointer group p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <span className="text-sm font-medium text-gray-900">Show available only</span>
                            <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${filters.available ? "bg-[#FF385C]" : "bg-gray-300"} relative`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${filters.available ? "translate-x-6" : "translate-x-1"}`} />
                            </div>
                            <input 
                                type="checkbox"
                                className="hidden"
                                checked={filters.available}
                                onChange={(e) => onFilterChange({ ...filters, available: e.target.checked })}
                            />
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
}
