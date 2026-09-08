"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    PlusCircle,
    Building2,
    Package,
    Layers,
    AlertTriangle,
    Search,
    ChevronDown,
    Check
} from "lucide-react";

interface ProductOption {
    id: string;
    name: string;
    sku?: string | null;
    unitPrice?: number | string | null;
}

interface AddStockDialogProps {
    isOpen: boolean;
    onClose: () => void;
    branches: string[];
    products: ProductOption[];
    onConfirm: (data: {
        branch: string;
        productId: string;
        productName: string;
        sku: string;
        quantity: number;
        minStock: number;
    }) => void;
}

export function AddStockDialog({
    isOpen,
    onClose,
    branches,
    products,
    onConfirm,
}: AddStockDialogProps) {
    const [selectedBranch, setSelectedBranch] = useState(branches[0] || "");
    const [selectedProductId, setSelectedProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [minStock, setMinStock] = useState("10");

    // 💡 Search සහ Dropdown Control සඳහා States
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Selected product එක සොයා ගැනීම
    const selectedProduct = products.find((p) => p.id === selectedProductId);

    // Product Name හෝ SKU එක මත Search Filter කිරීම
    const filteredProducts = products.filter((p) => {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = p.name.toLowerCase().includes(query);
        const skuMatch = p.sku ? p.sku.toLowerCase().includes(query) : false;
        return nameMatch || skuMatch;
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProductId || !selectedBranch || !quantity) return;

        const product = products.find((p) => p.id === selectedProductId);
        if (!product) return;

        onConfirm({
            branch: selectedBranch,
            productId: product.id,
            productName: product.name,
            sku: product.sku || "N/A",
            quantity: parseInt(quantity) || 0,
            minStock: parseInt(minStock) || 10,
        });

        // Reset form
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setSelectedProductId("");
        setSearchQuery("");
        setIsDropdownOpen(false);
        setQuantity("");
        setMinStock("10");
    };

    const formatPrice = (price?: number | string | null) => {
        if (price === undefined || price === null || price === "") return "";
        const numPrice = typeof price === "string" ? parseFloat(price) : price;
        if (isNaN(numPrice)) return "";
        return `Rs. ${numPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                resetForm();
                onClose();
            }
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <PlusCircle className="h-5 w-5 text-primary" />
                        Add Product Stock to Branch
                    </DialogTitle>
                    <DialogDescription>
                        Assign a product from catalog to a branch inventory with initial stock.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* 1. Select Branch */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                            Select Branch <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                        >
                            {branches.map((branch) => (
                                <option key={branch} value={branch}>
                                    {branch}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 2. Searchable Product Selector */}
                    <div className="space-y-1.5 relative">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <Package className="h-3.5 w-3.5 text-muted-foreground" />
                            Select Product <span className="text-red-500">*</span>
                        </label>

                        {/* Custom Input Trigger */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={selectedProduct ? selectedProduct.name : "Search product by name or SKU..."}
                                value={isDropdownOpen ? searchQuery : (selectedProduct ? selectedProduct.name : "")}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (!isDropdownOpen) setIsDropdownOpen(true);
                                }}
                                onFocus={() => {
                                    setIsDropdownOpen(true);
                                }}
                                className="w-full pl-9 pr-8 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                            />
                            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5 pointer-events-none" />
                            <ChevronDown
                                className={`h-4 w-4 text-muted-foreground absolute right-3 top-2.5 pointer-events-none transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                            />
                        </div>

                        {/* Dropdown Overlay & Items List */}
                        {isDropdownOpen && (
                            <>
                                {/* Click outside handler */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsDropdownOpen(false)}
                                />

                                <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-popover border border-border rounded-lg shadow-xl py-1 divide-y divide-border/30">
                                    {filteredProducts.length === 0 ? (
                                        <div className="p-3 text-xs text-center text-muted-foreground">
                                            No products found matching "{searchQuery}"
                                        </div>
                                    ) : (
                                        filteredProducts.map((p) => {
                                            const isSelected = selectedProductId === p.id;
                                            const priceStr = formatPrice(p.unitPrice);

                                            return (
                                                <div
                                                    key={p.id}
                                                    onClick={() => {
                                                        setSelectedProductId(p.id);
                                                        setIsDropdownOpen(false);
                                                        setSearchQuery("");
                                                    }}
                                                    className={`px-3 py-2.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground flex items-center justify-between gap-2 transition-colors ${isSelected ? "bg-primary/10 font-medium text-primary" : ""
                                                        }`}
                                                >
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="truncate font-medium text-foreground">
                                                            {p.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-2">
                                                            {p.sku && <span>SKU: {p.sku}</span>}
                                                            {p.sku && priceStr && <span>•</span>}
                                                            {priceStr && <span className="text-emerald-600 font-semibold">{priceStr}</span>}
                                                        </span>
                                                    </div>

                                                    {isSelected && (
                                                        <Check className="h-4 w-4 text-primary shrink-0" />
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* 3. Add Quantity */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                                Initial Qty <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                required
                            />
                        </div>

                        {/* 4. Threshold Level (Min Stock) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                                Alert Threshold
                            </label>
                            <input
                                type="number"
                                min="1"
                                placeholder="10"
                                value={minStock}
                                onChange={(e) => setMinStock(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-3">
                        <Button type="button" variant="outline" onClick={() => {
                            resetForm();
                            onClose();
                        }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!selectedProductId || !quantity}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            <PlusCircle className="h-4 w-4 mr-1.5" />
                            Add Stock
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}