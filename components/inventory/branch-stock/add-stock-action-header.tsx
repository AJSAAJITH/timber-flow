// components/inventory/branch-stock/add-stock-action-header.tsx
"use client";

import { Plus, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddStockActionHeaderProps {
    onOpenAddModal: () => void;
}

export function AddStockActionHeader({ onOpenAddModal }: AddStockActionHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card/60 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                    <PackagePlus className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-foreground">Branch Inventory Management</h3>
                    <p className="text-xs text-muted-foreground">
                        Assign new products to branch stock or adjust existing levels
                    </p>
                </div>
            </div>

            <Button
                onClick={onOpenAddModal}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-medium"
            >
                <Plus className="h-4 w-4" />
                Add Stock to Branch
            </Button>
        </div>
    );
}