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
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, #FF385C 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <Container className="relative py-24 md:py-32">
          <div className="max-w-3xl">
            <Badge variant="airbnb" className="mb-6 text-sm px-4 py-1.5 flex w-max items-center">
              <IoStar className="mr-1.5 text-yellow-400 text-lg mb-0.5" /> Share tools, build community
            </Badge>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
              The tools you need{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF385C] to-[#E91E8C]">
                from your neighbors
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
              ToolHive connects your neighborhood — borrow what you need, share what you have. Skip the hardware store.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/browse">
                <Button variant="primary" size="lg" className="text-base font-bold px-8 py-4">
                  <IoSearchOutline className="inline mr-2 text-xl -mt-0.5" /> Find Tools Nearby
                </Button>
              </Link>
              <Link href="/my-tools">
                <Button variant="outline" size="lg"
                  className="text-base font-bold px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900">
                  + List Your Tools
                </Button>
              </Link>
            </div>
          </div>
        </Container>

        {/* Floating tool images */}
        <div className="absolute right-0 top-0 h-full w-1/3 hidden lg:block overflow-hidden">
          <div className="relative h-full">
            <div className="absolute top-8 right-12 w-48 h-32 rounded-2xl overflow-hidden shadow-2xl rotate-3 opacity-80">
              <Image
                src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80"
                alt="Tool"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
            <div className="absolute top-44 right-4 w-40 h-28 rounded-2xl overflow-hidden shadow-2xl -rotate-2 opacity-70">
              <Image
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80"
                alt="Tool"
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
            <div className="absolute bottom-16 right-16 w-44 h-30 rounded-2xl overflow-hidden shadow-2xl rotate-1 opacity-75">
              <Image
                src="https://images.unsplash.com/photo-1589923188651-268a9765e432?w=400&q=80"
                alt="Tool"
                fill
                className="object-cover"
                sizes="180px"
              />
            </div>
          </div>
        </div>
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
