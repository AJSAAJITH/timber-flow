"use client"

import React, { RefObject } from "react"
import { Search } from "lucide-react"
import { Product } from "../../types/pos.types"

interface ProductCatalogProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    categories: string[]
    selectedCategory: string
    onSelectCategory: (category: string) => void
    products: Product[]
    onAddToCart: (product: Product) => void
    searchInputRef: RefObject<HTMLInputElement | null>
}

export function ProductCatalog({
    searchQuery,
    onSearchChange,
    categories,
    selectedCategory,
    onSelectCategory,
    products,
    onAddToCart,
    searchInputRef,
}: ProductCatalogProps) {
    return (
        <div className="lg:flex lg:flex-col lg:h-screen lg:overflow-hidden">
            {/* Search & Category Bar */}
            <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur p-3 sm:p-4 space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search by Product Name or SKU..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onSelectCategory(cat)}
                            className={`px-3 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap rounded-full transition-colors ${selectedCategory === cat
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:pb-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
                    {products.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => onAddToCart(product)}
                            disabled={product.stock === 0}
                            className={`group relative flex flex-col justify-between text-left bg-card border border-border/80 rounded-xl p-3 sm:p-3.5 transition-all hover:border-primary/50 hover:shadow-sm min-h-[135px] sm:min-h-[150px] ${product.stock === 0
                                ? "opacity-50 cursor-not-allowed bg-muted/30"
                                : "hover:bg-secondary/40 active:scale-[0.98] touch-manipulation"
                                }`}
                        >
                            {/* Card Top Header: SKU Badge & Stock Status */}
                            <div className="flex items-center justify-between gap-1.5 w-full mb-1.5">
                                {/* SKU Badge */}
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-mono font-medium bg-muted text-muted-foreground border border-border/50 truncate max-w-[60%]">
                                    {product.sku || "N/A"}
                                </span>

                                {/* Stock Quantity Badge */}
                                <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold shrink-0 ${product.stock === 0
                                        ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                                        : product.stock < 10
                                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                        }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${product.stock === 0
                                            ? "bg-red-500"
                                            : product.stock < 10
                                                ? "bg-amber-500"
                                                : "bg-emerald-500"
                                            }`}
                                    />
                                    {product.stock === 0 ? "Out" : `${product.stock} Qty`}
                                </span>
                            </div>

                            {/* Product Name */}
                            <div className="flex-1 flex flex-col justify-center my-1">
                                <h4 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                    {product.name}
                                </h4>
                            </div>

                            {/* Card Footer: Price Display */}
                            <div className="pt-2 mt-auto border-t border-border/50 flex items-baseline justify-between w-full">
                                <span className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                    Price
                                </span>
                                <div className="text-sm sm:text-base font-bold text-primary tracking-tight">
                                    <span className="text-[10px] sm:text-xs font-normal text-muted-foreground mr-1">LKR</span>
                                    {product.price.toLocaleString()}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                        No products found
                    </div>
                )}
            </div>
        </div>
    )
}