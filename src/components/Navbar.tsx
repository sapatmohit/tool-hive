/**
 * Navbar.jsx — Top navigation bar — Airbnb style.
 * SINGLE SOURCE OF TRUTH: never recreate in modules.
 *
 * Layout: Logo (left) | Search (center) | Nav links (right)
 */

"use client";

import Link from "next/link";
import { IoSearchOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Avatar from "./Avatar";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
    { href: "/browse", label: "Browse" },
    { href: "/my-tools", label: "My Tools" },
    { href: "/borrowed", label: "Borrowed" },
    { href: "/requests", label: "Requests" },
];

export default function Navbar() {
    const pathname = usePathname();
    const { currentUser, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* ── Logo ── */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 flex-shrink-0 group"
                    >
                        <div className="w-9 h-9 bg-gradient-to-br from-[#FF385C] to-[#E31C5F] rounded-xl
                            flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                            <span className="text-white text-lg font-black">T</span>
                        </div>
                        <span className="hidden sm:block font-extrabold text-xl tracking-tight text-gray-900">
                            Tool<span className="text-[#FF385C]">Hive</span>
                        </span>
                    </Link>

                    {/* ── Center Search ── */}
                    <div className="flex-1 max-w-md hidden md:block">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchQuery.trim()) {
                                    window.location.href = `/browse?q=${encodeURIComponent(searchQuery.trim())}`;
                                }
                            }}
                        >
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <IoSearchOutline className="text-lg" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search tools near you…"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-gray-200
                             text-sm text-gray-800 placeholder:text-gray-400
                             focus:outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20
                             transition-all duration-200"
                                />
                            </div>
                        </form>
                    </div>

                    {/* ── Right Nav ── */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={[
                                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                                    pathname === href
                                        ? "bg-[#FF385C]/10 text-[#FF385C]"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                ].join(" ")}
                            >
                                {label}
                            </Link>
                        ))}

                        {/* Divider */}
                        <div className="w-px h-6 bg-gray-200 mx-2" />

                        {/* Profile Dropdown */}
                        <div className="relative group">
                            <button
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200
                                hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
                            >
                                <IoMenuOutline className="text-gray-500 text-xl" />
                                <Avatar
                                    src={currentUser?.avatar}
                                    name={currentUser?.name}
                                    size="sm"
                                />
                            </button>

                            {/* Dropdown Menu (Hover-based or Click-based) */}
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 
                                z-50 py-2 overflow-hidden transform origin-top-right group-hover:translate-y-0 translate-y-2">
                                
                                {currentUser ? (
                                    <>
                                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Signed in as</p>
                                            <p className="text-sm font-bold text-gray-900 truncate">{currentUser.name}</p>
                                        </div>
                                        <Link href="/my-tools" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                                            My Dashboard
                                        </Link>
                                        <Link href="/borrowed" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                                            Borrowed Tools
                                        </Link>
                                        <Link href="/requests" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                                            Lending Requests
                                        </Link>
                                        <div className="h-px bg-gray-100 my-1" />
                                        <button 
                                            onClick={() => logout()}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-bold"
                                        >
                                            Log out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="block px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors font-bold">
                                            Log in
                                        </Link>
                                        <Link href="/signup" className="block px-4 py-2.5 text-sm text-[#FF385C] hover:bg-[#FF385C]/5 transition-colors font-bold">
                                            Sign up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>

                    {/* ── Mobile hamburger ── */}
                    <button
                        className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => setMobileOpen((p) => !p)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <IoCloseOutline className="text-2xl" /> : <IoMenuOutline className="text-2xl" />}
                    </button>
                </div>
            </div>

            {/* ── Mobile menu ── */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
                    {/* Mobile search */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setMobileOpen(false);
                            if (searchQuery.trim()) {
                                window.location.href = `/browse?q=${encodeURIComponent(searchQuery.trim())}`;
                            }
                        }}
                        className="mb-3"
                    >
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <IoSearchOutline className="text-lg" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search tools near you…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200
                           text-sm focus:outline-none focus:border-[#FF385C] transition-colors"
                            />
                        </div>
                    </form>

                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className={[
                                "block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                                pathname === href
                                    ? "bg-[#FF385C]/10 text-[#FF385C]"
                                    : "text-gray-700 hover:bg-gray-100",
                            ].join(" ")}
                        >
                            {label}
                        </Link>
                    ))}
                    
                    <div className="h-px bg-gray-100 my-2 mx-4" />
                    
                    {currentUser ? (
                        <>
                            <div className="px-4 py-2">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Account</p>
                                <div className="flex items-center gap-3">
                                    <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    setMobileOpen(false);
                                    logout();
                                }}
                                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <div className="space-y-1">
                            <Link
                                href="/login"
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-[#FF385C] hover:bg-[#FF385C]/5 transition-colors"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
