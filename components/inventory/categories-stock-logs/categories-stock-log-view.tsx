"use client"

import React, { useState } from "react"
import { Category, StockItem, StockLog } from "@/lib/types"
import { CategoryManager } from "./category-manager"
import { StockLogsViewer } from "./stock-logs-viewer"
import { AdjustStockDialog } from "./adjust-stock-dialog"

interface CtgoriesStockLogsProps {
    categories: Category[]
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>
    logs: StockLog[]
    setLogs: React.Dispatch<React.SetStateAction<StockLog[]>>
    stockItems: StockItem[]
    setStockItems: React.Dispatch<React.SetStateAction<StockItem[]>>
}

export default function Ctgories_Stock_Logs({
    categories,
    setCategories,
    logs,
    setLogs,
    stockItems,
    setStockItems,
}: CtgoriesStockLogsProps) {
    const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false)
    const [selectedStock, setSelectedStock] = useState<StockItem | null>(null)

    const handleAdjustStock = (qty: number, type: "in" | "out", note: string) => {
        if (!selectedStock) return

        const newQty =
            type === "in"
                ? selectedStock.currentStock + qty
                : Math.max(0, selectedStock.currentStock - qty)

        setStockItems(
            stockItems.map((item) =>
                item.id === selectedStock.id
                    ? { ...item, currentStock: newQty }
                    : item
            )
        )

        const logEntry: StockLog = {
            id: Date.now().toString(),
            branchId: (selectedStock as any).branchId || "main-branch", // 💡 branchId එක මෙතැනට එකතු කරන ලදී
            timestamp: new Date().toLocaleString(),
            branch: selectedStock.branch || "Main Branch",
            product: selectedStock.productName,
            logType: type === "in" ? "STOCK_IN" : "ADJUSTMENT",
            quantity: type === "in" ? qty : -qty,
            note: note || (type === "in" ? "Stock received" : "Stock adjustment"),
        }
        setLogs([logEntry, ...logs])
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Category Management */}
                <div className="lg:col-span-1">
                    <CategoryManager
                        categories={categories}
                        setCategories={setCategories}
                    />
                </div>

                {/* Inventory Logs */}
                <div className="lg:col-span-2">
                    <StockLogsViewer logs={logs} />
                </div>
            </div>

            {/* Adjust Stock Dialog */}
            <AdjustStockDialog
                isOpen={isAdjustDialogOpen}
                onOpenChange={setIsAdjustDialogOpen}
                selectedStock={selectedStock}
                onAdjustStock={handleAdjustStock}
            />
        </div>
    )
}