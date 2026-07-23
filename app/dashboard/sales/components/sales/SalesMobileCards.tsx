"use client"

import React from "react"
import { Clock, Eye } from "lucide-react"
import { SaleRecord } from "../../types/sales.types"
import { formatCurrency, getPaymentStatusColor } from "../../utils/sales-helpers"

interface SalesMobileCardsProps {
    sales: SaleRecord[]
    onSelectSale: (sale: SaleRecord) => void
}

export const SalesMobileCards: React.FC<SalesMobileCardsProps> = ({
    sales,
    onSelectSale,
}) => {
    return (
        <div className="md:hidden space-y-3">
            {sales.map((sale) => (
                <div
                    key={sale.id}
                    className="rounded-lg border border-border bg-card p-4"
                >
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">
                                {sale.invoiceNumber}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                {sale.date} {sale.time}
                            </p>
                        </div>
                        <button
                            onClick={() => onSelectSale(sale)}
                            className="min-h-[36px] min-w-[36px] flex items-center justify-center hover:bg-secondary rounded transition-colors"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                            <p className="text-muted-foreground text-xs">Total Amount</p>
                            <p className="font-bold text-foreground">
                                {formatCurrency(sale.totalAmount)}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">Status</p>
                            <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${getPaymentStatusColor(
                                    sale.paymentStatus
                                )}`}
                            >
                                {sale.paymentStatus === "PAID" && "Paid"}
                                {sale.paymentStatus === "PENDING" && "Pending"}
                                {sale.paymentStatus === "PARTIALLY_PAID" && "Partial"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border pt-3">
                        <p>Branch: {sale.branch}</p>
                        <p>Customer: {sale.customer || "Walk-In"}</p>
                        {sale.dueAmount > 0 && (
                            <p className="font-medium text-red-600 dark:text-red-400">
                                Due: {formatCurrency(sale.dueAmount)}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}