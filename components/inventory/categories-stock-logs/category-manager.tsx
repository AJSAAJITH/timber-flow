// components/inventory/categories-stock-logs/category-manager.tsx
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Tag, Pencil, Trash2, Check, X, Loader2 } from "lucide-react"
import { Category } from "@prisma/client"

import { toast } from "sonner" // හෝ ඔබගේ Toast notification library එක
import { createCategory, deleteCategory, updateCategory } from "@/actions/inventory/category.action"

interface CategoryManagerProps {
    categories: Category[]
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>
}

export function CategoryManager({ categories, setCategories }: CategoryManagerProps) {
    const [newCategoryName, setNewCategoryName] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Inline Editing States
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingName, setEditingName] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)

    // Deleting State
    const [deletingId, setDeletingId] = useState<string | null>(null)

    // Handle Create
    const handleAdd = async () => {
        if (!newCategoryName.trim()) return

        setIsSubmitting(true)
        const res = await createCategory(newCategoryName)
        setIsSubmitting(false)

        if (res.success) {
            setCategories((prev) => [...prev, res.data])
            setNewCategoryName("")
            toast.success(res.message || "Category added successfully")
        } else {
            toast.error(res.error)
        }
    }

    // Start Editing
    const startEditing = (category: Category) => {
        setEditingId(category.id)
        setEditingName(category.name)
    }

    // Cancel Editing
    const cancelEditing = () => {
        setEditingId(null)
        setEditingName("")
    }

    // Handle Update
    const handleUpdate = async (id: string) => {
        if (!editingName.trim()) return

        setIsUpdating(true)
        const res = await updateCategory(id, editingName)
        setIsUpdating(false)

        if (res.success) {
            setCategories((prev) =>
                prev.map((cat) => (cat.id === id ? res.data : cat))
            )
            cancelEditing()
            toast.success(res.message || "Category updated successfully")
        } else {
            toast.error(res.error)
        }
    }

    // Handle Delete
    const handleDelete = async (id: string) => {
        setDeletingId(id)
        const res = await deleteCategory(id)
        setDeletingId(null)

        if (res.success) {
            setCategories((prev) => prev.filter((cat) => cat.id !== id))
            toast.success(res.message || "Category deleted successfully")
        } else {
            toast.error(res.error)
        }
    }

    return (
        <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Categories ({categories.length})
                </h3>
            </div>

            {/* List of Categories */}
            <div className="space-y-2 mb-4 max-h-80 overflow-y-auto pr-1">
                {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Categoies Empty (දැනට Categories නොමැත)
                    </p>
                ) : (
                    categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center justify-between gap-2 p-2 rounded bg-secondary/30 hover:bg-secondary/60 group transition-colors"
                        >
                            {editingId === category.id ? (
                                /* Inline Edit Form */
                                <div className="flex items-center gap-2 w-full">
                                    <Input
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        className="h-8 text-sm"
                                        autoFocus
                                        disabled={isUpdating}
                                    />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleUpdate(category.id)}
                                        disabled={isUpdating}
                                        className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                    >
                                        {isUpdating ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Check className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={cancelEditing}
                                        disabled={isUpdating}
                                        className="h-8 w-8 p-0 text-muted-foreground hover:bg-secondary"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                /* Category View Item */
                                <>
                                    <span className="text-sm text-foreground font-medium">
                                        {category.name}
                                    </span>
                                    <div className="flex gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => startEditing(category)}
                                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDelete(category.id)}
                                            disabled={deletingId === category.id}
                                            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                                        >
                                            {deletingId === category.id ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-3.5 w-3.5" />
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add Category Form */}
            <div className="flex gap-2 pt-2 border-t border-border">
                <Input
                    type="text"
                    placeholder="New category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    disabled={isSubmitting}
                    className="flex-1 text-sm h-9"
                />
                <Button
                    onClick={handleAdd}
                    disabled={isSubmitting || !newCategoryName.trim()}
                    size="sm"
                    className="h-9 px-3"
                >
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="h-4 w-4 mr-1" />
                    )}
                    Add
                </Button>
            </div>
        </div>
    )
}