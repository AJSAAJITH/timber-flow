import { AlertTriangle } from "lucide-react";

export function LowStockAlert({ count }: { count: number }) {
    if (count === 0) return null;
    return (
        <div className="rounded-lg border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/10 p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">Low Stock Alert</p>
                <p className="text-sm text-amber-800 dark:text-amber-200">{count} item(s) below minimum stock level</p>
            </div>
        </div>
    );
}