"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Tool } from "@/types";

const CATEGORIES = [
    "Power Tools",
    "Outdoor",
    "Safety & Climbing",
    "Painting",
    "Air Tools",
    "Construction",
];

const DEFAULT_FORM = {
    name: "",
    description: "",
    category: "Power Tools",
    location: "",
    pricePerDay: "",
    image: "",
    availability: true,
};

/**
 * ToolForm.jsx — Add/Edit tool form.
 * Uses shared Input and Button components.
 */
interface ToolFormProps {
    initial?: Tool | null;
    onSubmit: (data: Partial<Tool>) => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function ToolForm({ initial = null, onSubmit, onCancel, loading = false }: ToolFormProps) {
    const [form, setForm] = useState<Partial<Tool>>(initial ?? DEFAULT_FORM as unknown as Partial<Tool>);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const set = (key: keyof Tool, val: any) => setForm((p) => ({ ...p, [key]: val }));

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name?.trim()) e.name = "Tool name is required";
        if (!form.description?.trim()) e.description = "Description is required";
        if (!form.location?.trim()) e.location = "Location is required";
        if (!form.pricePerDay || Number(form.pricePerDay) <= 0)
            e.pricePerDay = "Enter a valid price";
        return e;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        onSubmit({
            ...form,
            pricePerDay: Number(form.pricePerDay),
            image:
                form.image?.trim() ||
                "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                id="tool-name"
                label="Tool Name"
                placeholder="e.g. DeWalt Cordless Drill"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                error={errors.name}
                required
            />

            <div className="flex flex-col gap-1.5">
                <label htmlFor="tool-desc" className="text-sm font-semibold text-gray-700">
                    Description <span className="text-[#FF385C]">*</span>
                </label>
                <textarea
                    id="tool-desc"
                    rows={3}
                    placeholder="Describe your tool, included accessories, condition…"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className={[
                        "w-full rounded-xl border px-4 py-3 text-sm text-gray-900 resize-none",
                        "outline-none transition-all placeholder:text-gray-400",
                        errors.description
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : "border-gray-200 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20",
                    ].join(" ")}
                />
                {errors.description && (
                    <p className="text-xs text-red-500">{errors.description}</p>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="tool-cat" className="text-sm font-semibold text-gray-700">
                    Category
                </label>
                <select
                    id="tool-cat"
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900
                     bg-white outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 transition-all"
                >
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Input
                    id="tool-location"
                    label="Location"
                    placeholder="e.g. Austin, TX"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    error={errors.location}
                    required
                />
                <Input
                    id="tool-price"
                    label="Price per Day"
                    type="number"
                    placeholder="12"
                    value={form.pricePerDay}
                    onChange={(e) => set("pricePerDay", e.target.value)}
                    prefix="₹"
                    error={errors.pricePerDay}
                    required
                />
            </div>

            <Input
                id="tool-image"
                label="Image URL (optional)"
                placeholder="https://images.unsplash.com/…"
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
            />

            <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                    className={[
                        "w-11 h-6 rounded-full transition-colors duration-200 relative",
                        form.availability ? "bg-[#FF385C]" : "bg-gray-300",
                    ].join(" ")}
                    onClick={() => set("availability", !form.availability)}
                >
                    <div
                        className={[
                            "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
                            form.availability ? "translate-x-6" : "translate-x-1",
                        ].join(" ")}
                    />
                </div>
                <span className="text-sm font-medium text-gray-700">
                    Available to borrow immediately
                </span>
            </label>

            <div className="flex gap-3 pt-2">
                <Button variant="outline" size="md" onClick={onCancel} type="button" fullWidth>
                    Cancel
                </Button>
                <Button variant="primary" size="md" type="submit" loading={loading} fullWidth>
                    {initial ? "Save Changes" : "List Tool"}
                </Button>
            </div>
        </form>
    );
}
