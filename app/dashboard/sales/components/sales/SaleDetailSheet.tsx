"use client"

import React from "react"
import { Clock, Copy, Printer, DollarSign } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SaleRecord } from "../../types/sales.types"
import { formatCurrency, getPaymentMethodColor, getPaymentStatusColor } from "../../utils/sales-helpers"

interface SaleDetailSheetProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    sale: SaleRecord | null
    copiedInvoice: string | null
    onCopyInvoice: (invoiceNumber: string) => void
}

export const SaleDetailSheet: React.FC<SaleDetailSheetProps> = ({
    isOpen,
    onOpenChange,
    sale,
    copiedInvoice,
    onCopyInvoice,
}) => {
    if (!sale) return null

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="border-b border-border pb-4">
                    <SheetTitle>Invoice Details</SheetTitle>
                </SheetHeader>

                <div className="py-4 space-y-6">
                    {/* Header Info */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-lg text-foreground">
                                {sale.invoiceNumber}
                            </h3>
                            <button
                                onClick={() => onCopyInvoice(sale.invoiceNumber)}
                                className="min-h-[32px] min-w-[32px] flex items-center justify-center hover:bg-secondary rounded transition-colors"
                                title="Copy invoice number"
                            >
                                {copiedInvoice === sale.invoiceNumber ? (
                                    <span className="text-sm text-green-600">✓ Copied</span>
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {sale.timestamp}
                        </p>
                    </div>

                    {/* Receipt Info Card */}
                    <div className="bg-secondary/50 rounded-lg p-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Cashier:</span>
                            <span className="font-medium text-foreground">{sale.cashier}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Branch:</span>
                            <span className="font-medium text-foreground">{sale.branch}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Customer:</span>
                            <span className="font-medium text-foreground">
                                {sale.customer || "Walk-In"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Method:</span>
                            <span
                                className={`font-medium inline-block px-2.5 py-1 rounded-full text-xs ${getPaymentMethodColor(
                                    sale.checkoutMethod
                                )}`}
                            >
                                {sale.checkoutMethod === "CASH" && "Cash"}
                                {sale.checkoutMethod === "CREDIT" && "Credit"}
                                {sale.checkoutMethod === "BANK_TRANSFER" && "Bank Transfer"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span
                                className={`font-medium inline-block px-2.5 py-1 rounded-full text-xs ${getPaymentStatusColor(
                                    sale.paymentStatus
                                )}`}
                            >
                                {sale.paymentStatus === "PAID" && "Paid"}
                                {sale.paymentStatus === "PENDING" && "Pending"}
                                {sale.paymentStatus === "PARTIALLY_PAID" && "Partial"}
                            </span>
                        </div>
                    </div>

                    {/* Items Purchased List */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">Items Purchased</h4>
                        <div className="space-y-2">
                            {sale.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="border border-border rounded-lg p-3 text-sm space-y-1"
                                >
                                    <p className="font-medium text-foreground">
                                        {item.productName}
                                    </p>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Quantity:</span>
                                        <span className="font-medium text-foreground">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Price at Sale:</span>
                                        <span className="font-medium text-foreground">
                                            {formatCurrency(item.priceAtSale)}
                                        </span>
                                    </div>
                                    {item.priceAtSale !== item.originalPrice && (
                                        <div className="flex justify-between text-amber-600 dark:text-amber-400 text-xs">
                                            <span>Original:</span>
                                            <span>{formatCurrency(item.originalPrice)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-border pt-1 flex justify-between font-semibold">
                                        <span>Subtotal:</span>
                                        <span>
                                            {formatCurrency(item.priceAtSale * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="border-t border-border pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(sale.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-foreground bg-primary/10 rounded p-3">
                            <span>Grand Total:</span>
                            <span>{formatCurrency(sale.totalAmount)}</span>
                        </div>
                        {sale.dueAmount > 0 && (
                            <div className="flex justify-between text-base font-bold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20 rounded p-3">
                                <span>Due Amount:</span>
                                <span>{formatCurrency(sale.dueAmount)}</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-4 border-t border-border">
                        <Button className="w-full gap-2 min-h-[44px]">
                            <Printer className="h-4 w-4" />
                            Print Receipt
                        </Button>
                        {sale.dueAmount > 0 && (
                            <Button variant="outline" className="w-full gap-2 min-h-[44px]">
                                <DollarSign className="h-4 w-4" />
                                Record Payment
                            </Button>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}