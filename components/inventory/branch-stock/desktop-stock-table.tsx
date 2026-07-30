"use client";

import { StockItem } from "@/lib/types";
import {
    ArrowUpDown,
    Trash2,
    AlertTriangle,
    CheckCircle2,
    XCircle
} from "lucide-react";

interface DesktopStockTableProps {
    items: StockItem[];
    isLoading: boolean;
    onAdjustStock: (item: StockItem) => void;
    onDeleteStock: (inventoryId: string) => void;
}

export default function DesktopStockTable({
    items,
    isLoading,
    onAdjustStock,
    onDeleteStock,
}: DesktopStockTableProps) {
    if (isLoading) {
        return (
            <div className="w-full h-48 flex items-center justify-center border rounded-lg bg-card text-muted-foreground">
                දත්ත Load වෙමින් පවතී...
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="w-full h-48 flex items-center justify-center border rounded-lg bg-card text-muted-foreground">
                මෙම Branch එක සඳහා කිසිදු Stock වාර්තාවක් හමු නොවීය.
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-x-auto bg-card">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b text-xs uppercase font-medium text-muted-foreground">
                    <tr>
                        <th className="px-4 py-3">Product Name</th>
                        <th className="px-4 py-3">SKU</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3 text-center">Current Stock</th>
                        <th className="px-4 py-3 text-center">Min Stock</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {items.map((item) => {
                        const isOutOfStock = item.currentStock <= 0;
                        const isLowStock = !isOutOfStock && item.currentStock <= item.minStock;

                        return (
                            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 font-medium text-foreground">
                                    {item.productName}
                                </td>
                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                    {item.sku || "-"}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {item.categoryName || "General"}
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-base">
                                    {item.currentStock}
                                </td>
                                <td className="px-4 py-3 text-center text-muted-foreground">
                                    {item.minStock}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {isOutOfStock ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                                            <XCircle className="w-3.5 h-3.5" /> Out of Stock
                                        </span>
                                    ) : isLowStock ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                            <AlertTriangle className="w-3.5 h-3.5" /> Low Stock
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <button
                                        onClick={() => onAdjustStock(item)}
                                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 font-medium rounded border hover:bg-muted transition"
                                        title="Stock Adjust කරන්න"
                                    >
                                        <ArrowUpDown className="w-3.5 h-3.5" /> Adjust
                                    </button>
                                    <button
                                        onClick={() => onDeleteStock(item.id)}
                                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 font-medium rounded border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition"
                                        title="මකන්න"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}