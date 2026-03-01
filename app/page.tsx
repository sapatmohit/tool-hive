"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { SkeletonCard } from "@/components/Loader";
import ToolCard from "@/components/ToolCard";
import { getAllTools } from "@/services/browseService";
import {
  IoFlashOutline, IoLeafOutline, IoShieldCheckmarkOutline,
  IoColorPaletteOutline, IoCloudOutline, IoBusinessOutline,
  IoSearchOutline, IoCalendarOutline, IoPeopleOutline, IoStar
} from "react-icons/io5";
import { Tool } from "@/types";

const CATEGORIES = [
  { icon: <IoFlashOutline />, label: "Power Tools" },
  { icon: <IoLeafOutline />, label: "Outdoor" },
  { icon: <IoShieldCheckmarkOutline />, label: "Safety & Climbing" },
  { icon: <IoColorPaletteOutline />, label: "Painting" },
  { icon: <IoCloudOutline />, label: "Air Tools" },
  { icon: <IoBusinessOutline />, label: "Construction" },
];

const STATS = [
  { value: "500+", label: "Tools Listed" },
  { value: "1,200+", label: "Borrows Completed" },
  { value: "50+", label: "Neighborhoods" },
  { value: "4.9★", label: "Average Rating" },
];

const HOW_IT_WORKS = [
  { icon: <IoSearchOutline />, step: "01", title: "Browse nearby tools", desc: "Search for the tool you need in your neighborhood." },
  { icon: <IoCalendarOutline />, step: "02", title: "Request & Schedule", desc: "Send a request with your dates and a message to the owner." },
  { icon: <IoPeopleOutline />, step: "03", title: "Pick up & return", desc: "Meet your neighbor, use the tool, and return it on time." },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const tools = await getAllTools();
      setFeatured(tools.filter((t) => t.availability).slice(0, 8));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white pt-20 pb-24 lg:pt-32 lg:pb-32">
        {/* Abstract shapes / Glows for a modern feel */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-[#FF385C]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left Box: Copy */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF385C]/10 text-[#FF385C] font-semibold text-sm mb-8 border border-[#FF385C]/20 shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF385C] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF385C]"></span>
                </span>
                The local neighborhood tool network
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight capitalize">
                Borrow the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF385C] to-[#E91E8C]">
                  perfect tool
                </span><br />
                from a neighbor.
              </h1>

              <p className="text-lg lg:text-xl text-gray-600 mb-10 leading-relaxed max-w-lg font-medium">
                Why buy a power drill you&apos;ll use exactly once? Join ToolHive to borrow what you need, share what you have, and instantly connect with your neighborhood.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/browse">
                  <Button variant="primary" size="lg" className="text-base font-bold px-8 py-4 shadow-lg shadow-[#FF385C]/30 hover:shadow-[#FF385C]/40 hover:-translate-y-0.5 transition-all">
                    <IoSearchOutline className="inline mr-2 text-xl" /> Browse Tools
                  </Button>
                </Link>
                <Link href="/my-tools">
                  <Button variant="outline" size="lg"
                    className="text-base font-bold px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 transition-colors">
                    + List Your Tools
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-gray-500 font-semibold">
                <div className="flex items-center gap-2">
                  <IoShieldCheckmarkOutline className="text-xl text-emerald-500" /> Verified users
                </div>
                <div className="flex items-center gap-2">
                  <IoPeopleOutline className="text-xl text-blue-500" /> 50+ neighborhoods
                </div>
              </div>
            </div>

            {/* Right Box: Visuals */}
            <div className="relative hidden lg:block h-[620px] w-full">
              {/* Main big image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[440px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-200 z-10 border-8 border-white group">
                <Image
                  src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&q=80"
                  alt="Neighbor sharing tool"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative shadow-md">
                      <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" alt="Avatar" fill className="object-cover" />
                    </div>
                    <span className="font-semibold text-sm drop-shadow-md tracking-wide text-gray-100">Sarah from Bengaluru, KA</span>
                  </div>
                  <h3 className="text-2xl font-black drop-shadow-lg mb-1 tracking-tight">DeWalt Cordless Drill</h3>
                  <p className="text-sm text-white/90 drop-shadow-md flex items-center gap-1 font-semibold"><IoStar className="text-yellow-400 text-lg" /> 5.0 · ₹400/day</p>
                </div>
              </div>

              {/* Floating Element 1 - Top Right */}
              <div className="absolute top-16 -right-8 bg-white/90 backdrop-blur-md px-5 py-4 rounded-2xl shadow-xl border border-white z-20 animate-[bounce_6s_ease-in-out_infinite]">
                <div className="flex items-center gap-3 w-max">
                  <div className="w-12 h-12 bg-emerald-100/80 text-emerald-600 rounded-full flex items-center justify-center text-xl shadow-inner">
                    <IoShieldCheckmarkOutline />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">Status</p>
                    <p className="text-sm font-black text-gray-900">Request Approved</p>
                  </div>
                </div>
              </div>

              {/* Floating Element 2 - Bottom Left */}
              <div className="absolute bottom-28 -left-12 bg-white/90 backdrop-blur-md px-5 py-4 rounded-2xl shadow-xl border border-white z-20 animate-[bounce_5s_ease-in-out_infinite_reverse]">
                <div className="flex items-center gap-4 w-max">
                  <div className="w-14 h-14 relative rounded-xl overflow-hidden shadow-md border-2 border-gray-100">
                    <Image src="https://images.unsplash.com/photo-1589923188651-268a9765e432?w=200&q=80" alt="Tool" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 leading-tight">Orbital Sander</p>
                    <p className="text-xs text-gray-500 font-medium mb-1.5">Rented by Mark</p>
                    <div className="flex items-center gap-1.5 bg-[#FF385C]/10 px-2 py-0.5 rounded-md w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF385C] animate-pulse"></span>
                      <span className="text-[11px] font-bold text-[#FF385C] uppercase tracking-wide">Due Today</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative dotted pattern */}
              <div className="absolute top-1/4 -right-12 w-32 h-32 opacity-20"
                style={{ backgroundImage: "radial-gradient(#FF385C 2px, transparent 2px)", backgroundSize: "16px 16px" }}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#FF385C] text-white py-10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-black mb-1">{value}</div>
                <div className="text-white/80 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CATEGORY SHORTCUTS ── */}
      <section className="py-14 bg-gray-50">
        <Container>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {CATEGORIES.map(({ icon, label }) => (
              <Link
                key={label}
                href={`/browse?category=${encodeURIComponent(label)}`}
                className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4
                           border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1
                           transition-all duration-200 cursor-pointer group"
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-xs font-semibold text-gray-700 text-center leading-tight group-hover:text-[#FF385C] transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── FEATURED TOOLS ── */}
      <section className="py-14">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Featured Tools</h2>
              <p className="text-gray-500 text-sm mt-1">Top-rated tools available near you</p>
            </div>
            <Link href="/browse">
              <Button variant="outline" size="sm">View all →</Button>
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-14 bg-gray-50">
        <Container narrow>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3 text-center">How ToolHive Works</h2>
          <p className="text-gray-500 text-center mb-12">Three simple steps to borrow any tool</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ icon, step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF385C] to-[#E91E8C]
                                rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">{icon}</span>
                </div>
                <div className="text-xs font-bold text-[#FF385C] mb-2 tracking-widest">STEP {step}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center">
        <Container narrow>
          <h2 className="text-3xl font-extrabold mb-4">Have tools collecting dust?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            List them on ToolHive and let neighbors borrow them. It&apos;s free to list.
          </p>
          <Link href="/my-tools">
            <Button variant="primary" size="lg" className="text-base px-10 py-4 font-bold">
              Start Listing Today →
            </Button>
          </Link>
        </Container>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF385C] to-[#E31C5F] rounded-xl
                              flex items-center justify-center">
                <span className="text-white text-sm font-black">T</span>
              </div>
              <span className="font-bold text-white text-lg">
                Tool<span className="text-[#FF385C]">Hive</span>
              </span>
            </div>
            <p className="text-sm">© 2026 ToolHive. Share tools, build community.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/browse" className="hover:text-white transition-colors">Browse</Link>
              <Link href="/my-tools" className="hover:text-white transition-colors">List Tools</Link>
              <Link href="/requests" className="hover:text-white transition-colors">Requests</Link>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
