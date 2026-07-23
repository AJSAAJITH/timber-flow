"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { StockItem } from "@/lib/types"

interface AdjustStockDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    selectedStock: StockItem | null
    onAdjustStock: (qty: number, type: "in" | "out", note: string) => void
}

export function AdjustStockDialog({
    isOpen,
    onOpenChange,
    selectedStock,
    onAdjustStock,
}: AdjustStockDialogProps) {
    const [adjustmentType, setAdjustmentType] = useState<"in" | "out">("in")
    const [adjustmentQty, setAdjustmentQty] = useState("")
    const [adjustmentNote, setAdjustmentNote] = useState("")

    const handleSubmit = () => {
        if (!adjustmentQty) return
        onAdjustStock(parseInt(adjustmentQty), adjustmentType, adjustmentNote)
        setAdjustmentQty("")
        setAdjustmentNote("")
        onOpenChange(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Adjust Stock: {selectedStock?.productName}</DialogTitle>
                    <DialogDescription>
                        Record a stock in/out or adjustment for this product
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-foreground">Current Stock</label>
                        <p className="text-2xl font-bold text-primary mt-1">{selectedStock?.currentStock}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">Adjustment Type</label>
                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={() => setAdjustmentType("in")}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${adjustmentType === "in"
                                        ? "bg-green-600 text-white"
                                        : "bg-secondary text-foreground hover:bg-secondary/80"
                                    }`}
                            >
                                Stock In
                            </button>
                            <button
                                onClick={() => setAdjustmentType("out")}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${adjustmentType === "out"
                                        ? "bg-red-600 text-white"
                                        : "bg-secondary text-foreground hover:bg-secondary/80"
                                    }`}
                            >
                                Stock Out
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            value={adjustmentQty}
                            onChange={(e) => setAdjustmentQty(e.target.value)}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">Note</label>
                        <textarea
                            placeholder="Enter reason or note (optional)"
                            value={adjustmentNote}
                            onChange={(e) => setAdjustmentNote(e.target.value)}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary min-h-20 resize-none"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!adjustmentQty}
                        className={
                            adjustmentType === "in"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                        }
                    >
                        {adjustmentType === "in" ? "Stock In" : "Stock Out"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}