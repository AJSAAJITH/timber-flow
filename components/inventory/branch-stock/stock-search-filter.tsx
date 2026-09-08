"use client";

import { Search, X, RotateCcw } from "lucide-react";

interface StockSearchFilterProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
    categories: string[];
    onReset: () => void;
}

export default function StockSearchFilter({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    categories,
    onReset,
}: StockSearchFilterProps) {
    const hasActiveFilters =
        searchQuery.trim() !== "" ||
        selectedCategory !== "ALL" ||
        selectedStatus !== "ALL";

    return (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3.5 sm:p-4 rounded-xl border transition-all">
            {/* Search Input Bar (Product Name, SKU, Category) */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search by Product Name, SKU, or Category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground/70"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition"
                        title="Clear search"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Filter Controls (Category, Status Dropdowns & Reset Button) */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                {/* Category Dropdown Filter */}
                <div className="w-full sm:w-auto min-w-[150px]">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary transition"
                    >
                        <option value="ALL">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Dropdown Filter */}
                <div className="w-full sm:w-auto min-w-[140px]">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary transition"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="IN_STOCK">In Stock</option>
                        <option value="LOW_STOCK">Low Stock</option>
                        <option value="OUT_OF_STOCK">Out of Stock</option>
                    </select>
                </div>

                {/* Reset Filters Button */}
                {hasActiveFilters && (
                    <button
                        onClick={onReset}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-dashed rounded-lg hover:bg-muted transition whitespace-nowrap"
                        title="Reset all filters"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
}