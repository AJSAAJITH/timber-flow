"use client";

import { useState, useMemo } from "react";
import { LowStockAlert } from "./low-stock-alert";
import { StockControls } from "./stock-controls";
import { MobileStockList } from "./mobile-stock-list";
import { DesktopStockTable } from "./desktop-stock-table";
import { AdjustStockDialog } from "./adjust-stock-dialog";
import { TabsContent } from "@/components/ui/tabs";
import { MOCK_STOCK } from "@/lib/constants";


export function BranchStockView() {
    // 1. State definitions
    const [stockItems, setStockItems] = useState(MOCK_STOCK);
    const [searchQueryStock, setSearchQueryStock] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("Main Branch");

    // Dialog state
    const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState<any>(null);
    const [adjustmentType, setAdjustmentType] = useState<"in" | "out">("in");
    const [adjustmentQty, setAdjustmentQty] = useState("");
    const [adjustmentNote, setAdjustmentNote] = useState("");

    // 2. Filters (Logic)
    const filteredStockItems = useMemo(() => {
        return stockItems.filter((item) => {
            const matchesSearch =
                item.productName.toLowerCase().includes(searchQueryStock.toLowerCase()) ||
                item.sku.toLowerCase().includes(searchQueryStock.toLowerCase());
            const matchesBranch = item.branch === selectedBranch;
            return matchesSearch && matchesBranch;
        });
    }, [searchQueryStock, selectedBranch, stockItems]);

    const lowStockItems = useMemo(() =>
        filteredStockItems.filter((item) => item.currentStock <= item.minStock),
        [filteredStockItems]
    );

    // 3. Handler function
    const handleAdjustStock = () => {
        if (!selectedStock || !adjustmentQty) return;

        const qty = parseInt(adjustmentQty);
        const newQty = adjustmentType === "in"
            ? selectedStock.currentStock + qty
            : Math.max(0, selectedStock.currentStock - qty);

        setStockItems(stockItems.map((item) =>
            item.id === selectedStock.id
                ? { ...item, currentStock: newQty }
                : item
        ));

        setIsAdjustDialogOpen(false);
        setAdjustmentQty("");
        setAdjustmentNote("");
    };

    // 2. ඔයා අලුතින් හදපු stock helpers
    const getStockStatus = (current: number, min: number): string => {
        if (current === 0) return "Out of Stock";
        if (current <= min) return "Low Stock";
        return "In Stock";
    };

    const getStockStatusColor = (current: number, min: number): string => {
        if (current === 0) return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
        if (current <= min) return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300";
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
    };

    return (
        <TabsContent value="stock" className="space-y-6 mt-6">
            <LowStockAlert count={lowStockItems.length} />

            <StockControls
                searchQuery={searchQueryStock}
                onSearchChange={setSearchQueryStock}
                selectedBranch={selectedBranch}
                onBranchChange={setSelectedBranch}
                branches={["Main Branch", "Negombo Branch", "Galle Branch", "Kandy Branch"]}
            />

            <MobileStockList
                items={filteredStockItems}
                onAdjust={(item: any) => { setSelectedStock(item); setIsAdjustDialogOpen(true); }}
                getStatus={getStockStatus}
                getColor={getStockStatusColor}
            />

            <DesktopStockTable
                items={filteredStockItems}
                onAdjust={(item: any) => { setSelectedStock(item); setIsAdjustDialogOpen(true); }}
                getStatus={getStockStatus}
                getColor={getStockStatusColor}
            />

            <AdjustStockDialog
                isOpen={isAdjustDialogOpen}
                onClose={() => setIsAdjustDialogOpen(false)}
                item={selectedStock}
                type={adjustmentType}
                setType={setAdjustmentType}
                qty={adjustmentQty}
                setQty={setAdjustmentQty}
                note={adjustmentNote}
                setNote={setAdjustmentNote}
                onConfirm={handleAdjustStock}
            />
        </TabsContent>
    );
}