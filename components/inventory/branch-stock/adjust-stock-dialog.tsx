// adjust-stock-dialog.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AdjustStockDialogProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
    type: "in" | "out";
    setType: (type: "in" | "out") => void;
    qty: string;
    setQty: (qty: string) => void;
    note: string;
    setNote: (note: string) => void;
    onConfirm: () => void;
}

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
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Adjust Stock: {item?.productName}</DialogTitle>
                    <DialogDescription>
                        Record a stock in/out or adjustment for this product
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-foreground">Current Stock</label>
                        <p className="text-2xl font-bold text-primary mt-1">{item?.currentStock ?? 0}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">Adjustment Type</label>
                        <div className="flex gap-2 mt-1">
                            <button
                                type="button"
                                onClick={() => setType("in")}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${type === "in"
                                        ? "bg-green-600 text-white"
                                        : "bg-secondary text-foreground hover:bg-secondary/80"
                                    }`}
                            >
                                Stock In
                            </button>
                            <button
                                type="button"
                                onClick={() => setType("out")}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${type === "out"
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
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">Note</label>
                        <textarea
                            placeholder="Enter reason or note (optional)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary min-h-20 resize-none"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={!qty}
                        className={
                            type === "in"
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-red-600 hover:bg-red-700 text-white"
                        }
                    >
                        {type === "in" ? "Stock In" : "Stock Out"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}