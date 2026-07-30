// components/inventory/branch-stock/add-stock-dialog.tsx
"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building2, Package, Layers, AlertTriangle } from "lucide-react";

interface ProductOption {
    id: string;
    name: string;
    sku?: string | null;
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
    const [minStock, setMinStock] = useState("10"); // Default threshold

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
        setSelectedProductId("");
        setQuantity("");
        setMinStock("10");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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

                    {/* 2. Select Product */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <Package className="h-3.5 w-3.5 text-muted-foreground" />
                            Select Product <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                        >
                            <option value="" disabled>-- Choose a product --</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} {p.sku ? `(${p.sku})` : ""}
                                </option>
                            ))}
                        </select>
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
                        <Button type="button" variant="outline" onClick={onClose}>
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