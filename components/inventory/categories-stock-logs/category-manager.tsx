"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Tag } from "lucide-react"
import { Category } from "@/lib/types"

interface CategoryManagerProps {
    categories: Category[]
    onAddCategory: (categoryName: string) => void
}

export function CategoryManager({ categories, onAddCategory }: CategoryManagerProps) {
    const [newCategoryName, setNewCategoryName] = useState("")

    const handleAdd = () => {
        if (!newCategoryName.trim()) return
        onAddCategory(newCategoryName)
        setNewCategoryName("")
    }

    return (
        <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Categories
                </h3>
            </div>

            <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="flex items-center justify-between gap-2 p-2 rounded hover:bg-secondary/50 group"
                    >
                        <span className="text-sm text-foreground">{category.name}</span>
                        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                            <button className="min-h-[28px] min-w-[28px] flex items-center justify-center hover:bg-secondary rounded text-xs">
                                ✏️
                            </button>
                            <button className="min-h-[28px] min-w-[28px] flex items-center justify-center hover:bg-destructive/10 rounded text-xs text-destructive">
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="New category"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                    onClick={handleAdd}
                    size="sm"
                    className="min-h-[40px] min-w-[40px] p-0"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}