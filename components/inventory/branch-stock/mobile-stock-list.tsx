import { StockItem } from "@/lib/types";
import { Wrench } from "lucide-react";

export function MobileStockList({ items, onAdjust, getStatus, getColor }: any) {
    return (
        <div className="md:hidden space-y-3">
            {items.map((item: StockItem) => (
                <div key={item.id} className="rounded-lg border bg-card p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="font-semibold">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">{item.sku}</p>
                        </div>
                        <button onClick={() => onAdjust(item)} className="p-2 bg-primary text-primary-foreground rounded-lg"><Wrench className="h-4 w-4" /></button>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span>Stock: <strong>{item.currentStock}</strong></span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${getColor(item.currentStock, item.minStock)}`}>{getStatus(item.currentStock, item.minStock)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}