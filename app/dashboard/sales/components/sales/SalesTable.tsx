"use client"

import React from "react"
import { Eye, Copy } from "lucide-react"

import {
    formatCurrency,
    getPaymentMethodColor,
    getPaymentStatusColor,
} from "../../utils/sales-helpers"
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table"
import { SaleRecord } from "../../types/sales.types"

interface SalesTableProps {
    sales: SaleRecord[]
    copiedInvoice: string | null
    onCopyInvoice: (invoice: string) => void
    onSelectSale: (sale: SaleRecord) => void
}

export const SalesTable: React.FC<SalesTableProps> = ({
    sales,
    copiedInvoice,
    onCopyInvoice,
    onSelectSale,
}) => {
    return (
        <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-border bg-secondary/50">
                        <TableHead className="h-12">Date & Time</TableHead>
                        <TableHead className="h-12">Invoice Number</TableHead>
                        <TableHead className="h-12">Branch</TableHead>
                        <TableHead className="h-12">Customer</TableHead>
                        <TableHead className="h-12">Method</TableHead>
                        <TableHead className="h-12">Status</TableHead>
                        <TableHead className="h-12 text-right">Total Amount</TableHead>
                        <TableHead className="h-12 text-right">Due Amount</TableHead>
                        <TableHead className="h-12 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sales.map((sale) => (
                        <TableRow
                            key={sale.id}
                            className={`border-b border-border hover:bg-secondary/30 transition-colors ${sale.paymentStatus !== "PAID" ? "bg-secondary/20" : ""
                                }`}
                        >
                            <TableCell className="text-sm font-mono text-muted-foreground">
                                {sale.date} {sale.time}
                            </TableCell>

                            <TableCell className="text-sm font-semibold text-foreground">
                                <div className="flex items-center gap-2">
                                    {sale.invoiceNumber}
                                    <button
                                        onClick={() => onCopyInvoice(sale.invoiceNumber)}
                                        className="opacity-0 hover:opacity-100 transition-opacity"
                                        title="Copy invoice number"
                                    >
                                        {copiedInvoice === sale.invoiceNumber ? (
                                            <span className="text-xs text-green-600">✓</span>
                                        ) : (
                                            <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        )}
                                    </button>
                                </div>
                            </TableCell>

                            <TableCell className="text-sm text-muted-foreground">
                                {sale.branch}
                            </TableCell>

                            <TableCell className="text-sm text-foreground">
                                {sale.customer || (
                                    <span className="text-muted-foreground italic">Walk-In</span>
                                )}
                            </TableCell>

                            <TableCell className="text-sm">
                                <span
                                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentMethodColor(
                                        sale.checkoutMethod
                                    )}`}
                                >
                                    {sale.checkoutMethod === "CASH" && "Cash"}
                                    {sale.checkoutMethod === "CREDIT" && "Credit"}
                                    {sale.checkoutMethod === "BANK_TRANSFER" && "Bank Transfer"}
                                </span>
                            </TableCell>

                            <TableCell className="text-sm">
                                <span
                                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(
                                        sale.paymentStatus
                                    )}`}
                                >
                                    {sale.paymentStatus === "PAID" && "Paid"}
                                    {sale.paymentStatus === "PENDING" && "Pending"}
                                    {sale.paymentStatus === "PARTIALLY_PAID" && "Partial"}
                                </span>
                            </TableCell>

                            <TableCell className="text-right text-sm font-semibold text-foreground">
                                {formatCurrency(sale.totalAmount)}
                            </TableCell>

                            <TableCell
                                className={`text-right text-sm font-semibold ${sale.dueAmount > 0
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-green-600 dark:text-green-400"
                                    }`}
                            >
                                {formatCurrency(sale.dueAmount)}
                            </TableCell>

                            <TableCell className="text-right">
                                <button
                                    onClick={() => onSelectSale(sale)}
                                    className="min-h-[36px] px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors inline-flex items-center gap-1"
                                >
                                    <Eye className="h-4 w-4" />
                                    View
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}