"use client";

import { useState, useEffect, useCallback } from "react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import EmptyState from "@/components/EmptyState";
import { SkeletonCard } from "@/components/Loader";
import MyToolCard from "@/components/MyToolCard";
import ToolForm from "@/components/ToolForm";
import { getMyTools, addTool, updateTool, deleteTool } from "@/services/toolsService";
import { useAuth } from "@/context/AuthContext";
import { IoConstructOutline, IoAddOutline } from "react-icons/io5";
import { Tool } from "@/types";

export default function MyToolsPage() {
    const { currentUser } = useAuth();
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Tool | null>(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await getMyTools(currentUser.id);
            setTools(data);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => { load(); }, [load]);

    const handleAdd = () => { setEditTarget(null); setModalOpen(true); };
    const handleEdit = (tool: Tool) => { setEditTarget(tool); setModalOpen(true); };

    const handleSubmit = async (data: Partial<Tool>) => {
        if (!currentUser) return;
        setSaving(true);
        try {
            if (editTarget) {
                const updated = await updateTool(editTarget.id, { ...editTarget, ...data }, currentUser.id);
                setTools((prev) => prev.map((t) => (t.id === editTarget.id ? updated : t)));
            } else {
                const newTool = await addTool({ ...data, ownerId: currentUser.id, rating: 0, reviewCount: 0, id: `tool-${Date.now()}` }, currentUser.id);
                setTools((prev) => [...prev, newTool]);
            }
            setModalOpen(false);
        } catch (error) {
            if (error instanceof Error && error.name === "AuthenticationError") {
                alert(error.message);
            } else {
                alert("Failed to save. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Remove this tool listing?")) return;
        if (!currentUser) return;
        try {
            await deleteTool(id, currentUser.id);
            setTools((prev) => prev.filter((t: Tool) => t.id !== id));
        } catch (error) {
            if (error instanceof Error && error.name === "AuthenticationError") {
                alert(error.message);
            } else {
                alert("Failed to delete. Please try again.");
            }
        }
    };

    const handleToggle = async (tool: Tool) => {
        if (!currentUser) return;
        try {
            const updated = await updateTool(tool.id, { ...tool, availability: !tool.availability }, currentUser.id);
            setTools((prev) => prev.map((t: Tool) => (t.id === updated.id ? { ...t, availability: updated.availability } : t)));
        } catch (error) {
            if (error instanceof Error && error.name === "AuthenticationError") {
                alert(error.message);
            } else {
                alert("Failed to update. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 py-8">
                <Container>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">My Tools</h1>
                            <p className="text-gray-500 mt-1">
                                {tools.length} tool{tools.length !== 1 ? "s" : ""} listed
                            </p>
                        </div>
                        <Button variant="primary" size="md" onClick={handleAdd}>
                            <IoAddOutline className="inline mr-1 text-lg mb-0.5" /> List a Tool
                        </Button>
                    </div>
                </Container>
            </div>

            {/* Grid */}
            <Container className="py-8">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : tools.length === 0 ? (
                    <EmptyState
                        icon={<IoConstructOutline />}
                        title="No tools listed yet"
                        description="Share your tools with the neighborhood and earn while you're not using them."
                        action={<Button variant="primary" onClick={handleAdd}>List Your First Tool</Button>}
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {tools.map((tool) => (
                            <MyToolCard
                                key={tool.id}
                                tool={tool}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggleAvailability={handleToggle}
                            />
                        ))}
                    </div>
                )}
            </Container>

            {/* Add / Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editTarget ? "Edit Tool Listing" : "List a New Tool"}
                size="lg"
            >
                <ToolForm
                    initial={editTarget}
                    onSubmit={handleSubmit}
                    onCancel={() => setModalOpen(false)}
                    loading={saving}
                />
            </Modal>
        </div>
    );
}
