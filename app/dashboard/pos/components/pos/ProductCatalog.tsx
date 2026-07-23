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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3">
                    {products.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => onAddToCart(product)}
                            disabled={product.stock === 0}
                            className={`group relative flex flex-col bg-card border border-border rounded-lg p-2 sm:p-3 transition-all min-h-[110px] sm:min-h-[140px] ${product.stock === 0
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-secondary/50 active:scale-95 touch-manipulation"
                                }`}
                        >
                            <div
                                className={`absolute top-1 right-1 sm:top-2 sm:right-2 px-2 py-1 rounded text-xs font-bold ${product.stock === 0
                                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                    : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                    }`}
                            >
                                {product.stock === 0 ? "Out" : `${product.stock}`}
                            </div>

                            <div className="flex-1 flex flex-col justify-start mb-2">
                                <p className="text-sm font-semibold text-foreground line-clamp-2">
                                    {product.name}
                                </p>
                                <p className="text-xs font-mono text-muted-foreground mt-1">
                                    {product.sku}
                                </p>
                            </div>

                            <div className="text-lg sm:text-xl font-bold text-primary">
                                LKR {product.price.toLocaleString()}
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