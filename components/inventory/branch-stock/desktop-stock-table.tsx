// desktop-stock-table.tsx
import { Wrench } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DesktopStockTableProps {
    items: any[];
    onAdjust: (item: any) => void;
    getStatus: (current: number, min: number) => string;
    getColor: (current: number, min: number) => string;
}

export function DesktopStockTable({ items, onAdjust, getStatus, getColor }: DesktopStockTableProps) {
    return (
        <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-secondary/50">
                        <TableHead>Product Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Current</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item: any) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{item.sku}</TableCell>
                            <TableCell>{item.currentStock}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor(item.currentStock, item.minStock)}`}>
                                    {getStatus(item.currentStock, item.minStock)}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <button
                                    type="button"
                                    onClick={() => onAdjust(item)}
                                    className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                                >
                                    <Wrench className="h-4 w-4" />
                                    Adjust
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}