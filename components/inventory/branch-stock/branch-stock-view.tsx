"use client";

import { useState, useEffect, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { BranchOption, CatalogProductOption, StockItem } from "@/lib/types";
import { useBranch } from "@/lib/branch-context"; // 💡 Branch Context එක Import කරන ලදී
import {
    addStockToBranch,
    adjustStock,
    deleteBranchInventory,
    getBranchInventory
} from "@/actions/inventory/brach-stock.action";

import DesktopStockTable from "@/components/inventory/branch-stock/desktop-stock-table";
import { AddStockDialog } from "@/components/inventory/branch-stock/add-stock-dialog";
import { AdjustStockDialog, InventoryLogType } from "@/components/inventory/branch-stock/adjust-stock-dialog";
import { AddStockActionHeader } from "@/components/inventory/branch-stock/add-stock-action-header";

interface BranchStockViewProps {
    branches: BranchOption[];
    catalogProducts: CatalogProductOption[];
    currentUserId: string;
}

export default function BranchStockView({
    branches,
    catalogProducts,
    currentUserId,
}: BranchStockViewProps) {
    // 💡 BranchContext මගින් User Data ලබාගැනීම
    const { user } = useBranch();
    const isSuperAdmin = user?.role === "SUPER_ADMIN";

    // 💡 SUPER_ADMIN නොවේ නම් User ගේ තමන්ගේ Branch ID එක Default ලෙස set කරයි
    const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
        if (!isSuperAdmin && user?.branch?.id) {
            return user.branch.id;
        }
        return branches[0]?.id || "";
    });

    const [stockItems, setStockItems] = useState<StockItem[]>([]);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ text: string; isError?: boolean } | null>(null);

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [selectedItemForAdjust, setSelectedItemForAdjust] = useState<StockItem | null>(null);

    // Adjust Form state
    const [adjustForm, setAdjustForm] = useState<{
        type: InventoryLogType;
        quantity: number;
        reason: string;
    }>({
        type: "STOCK_IN",
        quantity: 0,
        reason: "",
    });

    // 💡 Non-SUPER_ADMIN පරිශීලකයින් සඳහා ඔවුන්ගේ අදාළ Branch ID එක lock කිරීම
    useEffect(() => {
        if (!isSuperAdmin && user?.branch?.id) {
            setSelectedBranchId(user.branch.id);
        }
    }, [isSuperAdmin, user?.branch?.id]);

    // Message එක තත්පර 5කින් auto disappear වන ලෙස සැකසූ useEffect එක
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    // Fetch Stock Items when Branch changes
    const fetchInventory = (branchId: string) => {
        if (!branchId) return;
        startTransition(async () => {
            const res = await getBranchInventory(branchId);
            if (res.success && res.data) {
                setStockItems(res.data);
            } else {
                setMessage({
                    text: !res.success ? res.error : "දත්ත ලබා ගැනීමට නොහැකි විය.",
                    isError: true,
                });
            }
        });
    };

    useEffect(() => {
        if (selectedBranchId) {
            fetchInventory(selectedBranchId);
        }
    }, [selectedBranchId]);

    // Handle Add Stock Confirmation
    const handleAddStockConfirm = async (data: {
        branch: string;
        productId: string;
        quantity: number;
        minStock: number;
    }) => {
        setMessage(null);
        const targetBranchId = branches.find((b) => b.name === data.branch)?.id || selectedBranchId;

        const res = await addStockToBranch({
            branchId: targetBranchId,
            productId: data.productId,
            quantity: Number(data.quantity),
            minStock: Number(data.minStock),
            userId: currentUserId,
        });

        if (res.success) {
            setMessage({ text: res.message || "සාර්ථකව එකතු කරන ලදී!" });
            fetchInventory(selectedBranchId);
        } else {
            setMessage({ text: res.error || "දෝෂයක් සිදු විය.", isError: true });
        }
    };

    // Handle Adjust Stock
    const handleAdjustStockSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!selectedItemForAdjust) return;

        setMessage(null);
        const res = await adjustStock({
            inventoryId: selectedItemForAdjust.id,
            type: adjustForm.type,
            quantity: Number(adjustForm.quantity),
            reason: adjustForm.reason,
            userId: currentUserId,
        });

        if (res.success) {
            setMessage({ text: res.message || "Stock Adjust කිරීම සාර්ථකයි!" });
            setIsAdjustModalOpen(false);
            setSelectedItemForAdjust(null);
            setAdjustForm({ type: "STOCK_IN", quantity: 0, reason: "" });
            fetchInventory(selectedBranchId);
        } else {
            setMessage({ text: res.error || "දෝෂයක් සිදු විය.", isError: true });
        }
    };

    // Handle Delete Stock
    const handleDeleteStock = async (inventoryId: string) => {
        if (!confirm("මෙම Product එක මෙම Branch එකෙන් ඉවත් කිරීමට ඔබට විශ්වාසද?")) return;

        setMessage(null);
        const res = await deleteBranchInventory(inventoryId);
        if (res.success) {
            setMessage({ text: res.message || "ඉවත් කිරීම සාර්ථකයි!" });
            fetchInventory(selectedBranchId);
        } else {
            setMessage({ text: res.error || "ඉවත් කිරීමට නොහැකි විය.", isError: true });
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
            {/* Message Banner */}
            {message && (
                <div
                    className={`p-3 rounded-lg text-sm font-medium border transition-all ${message.isError
                            ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <AddStockActionHeader onOpenAddModal={() => setIsAddModalOpen(true)} />

            {/* Branch Selector Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium whitespace-nowrap">Select Branch:</label>

                    {/* 🔴 Select Dropdown - Super Admin නොවන අයට disabled කර ඇත */}
                    <select
                        value={selectedBranchId}
                        onChange={(e) => setSelectedBranchId(e.target.value)}
                        disabled={!isSuperAdmin}
                        className={`border rounded-md px-3 py-1.5 text-sm bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary ${!isSuperAdmin ? "opacity-70 cursor-not-allowed bg-muted" : ""
                            }`}
                    >
                        {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => fetchInventory(selectedBranchId)}
                        className="p-2 text-muted-foreground hover:text-foreground transition rounded border hover:bg-muted"
                        title="Refresh Stock"
                    >
                        <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
                    </button>
                </div>

                {/* 💡 SUPER_ADMIN නොවන විට කුඩා Badge එකක් පෙන්වීමට (Optional UI UX Improvement) */}
                {!isSuperAdmin && (
                    <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full w-fit">
                        Locked to your assigned branch
                    </span>
                )}
            </div>

            {/* Stock Table */}
            <DesktopStockTable
                items={stockItems}
                isLoading={isPending}
                onAdjustStock={(item) => {
                    setSelectedItemForAdjust(item);
                    setIsAdjustModalOpen(true);
                }}
                onDeleteStock={handleDeleteStock}
            />

            {/* MODAL 1: ADD STOCK DIALOG */}
            <AddStockDialog
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                branches={branches.map((b) => b.name)}
                products={catalogProducts}
                onConfirm={handleAddStockConfirm}
            />

            {/* MODAL 2: ADJUST STOCK DIALOG */}
            {isAdjustModalOpen && selectedItemForAdjust && (
                <AdjustStockDialog
                    isOpen={isAdjustModalOpen}
                    onClose={() => {
                        setIsAdjustModalOpen(false);
                        setSelectedItemForAdjust(null);
                    }}
                    item={selectedItemForAdjust}
                    type={adjustForm.type}
                    setType={(type) =>
                        setAdjustForm((prev) => ({
                            ...prev,
                            type: type,
                        }))
                    }
                    qty={String(adjustForm.quantity)}
                    setQty={(q) => setAdjustForm((prev) => ({ ...prev, quantity: Number(q) }))}
                    note={adjustForm.reason}
                    setNote={(n) => setAdjustForm((prev) => ({ ...prev, reason: n }))}
                    onConfirm={handleAdjustStockSubmit}
                />
            )}
        </div>
    );
}