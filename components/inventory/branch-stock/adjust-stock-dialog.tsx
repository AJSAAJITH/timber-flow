"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type InventoryLogType = "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT" | "DAMAGE" | "RETURN";

interface AdjustStockDialogProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
    type: InventoryLogType;
    setType: (type: InventoryLogType) => void;
    qty: string;
    setQty: (qty: string) => void;
    note: string;
    setNote: (note: string) => void;
    onConfirm: () => void;
}

const ADJUSTMENT_OPTIONS: {
    id: InventoryLogType;
    label: string;
    desc: string;
    activeClass: string;
}[] = [
        {
            id: "STOCK_IN",
            label: "Stock In",
            desc: "+ එකතු කිරීම",
            activeClass: "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold ring-1 ring-emerald-500",
        },
        {
            id: "STOCK_OUT",
            label: "Stock Out",
            desc: "- ඉවත් කිරීම",
            activeClass: "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold ring-1 ring-blue-500",
        },
        {
            id: "ADJUSTMENT",
            label: "Adjustment",
            desc: "ගණන් හැදීම",
            activeClass: "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold ring-1 ring-amber-500",
        },
        {
            id: "DAMAGE",
            label: "Damage",
            desc: "අලාභ හානි",
            activeClass: "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold ring-1 ring-rose-500",
        },
        {
            id: "RETURN",
            label: "Return",
            desc: "ආපසු භාරදීම",
            activeClass: "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold ring-1 ring-purple-500",
        },
    ];

export function AdjustStockDialog({
    isOpen,
    onClose,
    item,
    type,
    setType,
    qty,
    setQty,
    note,
    setNote,
    onConfirm,
}: AdjustStockDialogProps) {

    const getSubmitButtonClass = (selectedType: InventoryLogType) => {
        switch (selectedType) {
            case "STOCK_IN":
                return "bg-emerald-600 hover:bg-emerald-700 text-white";
            case "STOCK_OUT":
                return "bg-blue-600 hover:bg-blue-700 text-white";
            case "ADJUSTMENT":
                return "bg-amber-600 hover:bg-amber-700 text-white";
            case "DAMAGE":
                return "bg-rose-600 hover:bg-rose-700 text-white";
            case "RETURN":
                return "bg-purple-600 hover:bg-purple-700 text-white";
            default:
                return "bg-primary text-primary-foreground";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Adjust Stock: {item?.productName || item?.product?.name}</DialogTitle>
                    <DialogDescription>
                        Record stock adjustments, damages, returns, or manual stock changes.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Current Stock Banner */}
                    <div className="p-3 bg-muted/50 rounded-lg border flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Current Available Stock:</span>
                        <span className="text-2xl font-bold text-primary">{item?.currentStock ?? item?.stockLevel ?? 0}</span>
                    </div>

                    {/* Adjustment Type Selection Grid */}
                    <div>
                        <label className="text-sm font-medium text-foreground">Adjustment Type</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1.5">
                            {ADJUSTMENT_OPTIONS.map((opt) => {
                                const isSelected = type === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setType(opt.id)}
                                        className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${isSelected
                                                ? opt.activeClass
                                                : "bg-background border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                            }`}
                                    >
                                        <span className="text-xs font-bold">{opt.label}</span>
                                        <span className="text-[10px] opacity-75">{opt.desc}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quantity Field */}
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            min="1"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Reason / Note Field */}
                    <div>
                        <label className="text-sm font-medium text-foreground">Note / Reason</label>
                        <textarea
                            placeholder="Enter reason or note (optional)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-20 resize-none"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={!qty || Number(qty) <= 0}
                        className={getSubmitButtonClass(type)}
                    >
                        Confirm {type.replace("_", " ")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}