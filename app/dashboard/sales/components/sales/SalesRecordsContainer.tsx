"use client"

import React, { useState, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { SalesFilterHeader } from "./SalesFilterHeader";
import { SalesTable } from "./SalesTable";
import { SalesMobileCards } from "./SalesMobileCards";
import { SaleDetailSheet } from "./SaleDetailSheet";
import { SaleRecord } from "../../types/sales.types";

const INITIAL_SALES: SaleRecord[] = [
    {
        id: "1",
        invoiceNumber: "INV-2026-001",
        date: "2026-07-22",
        time: "10:30 AM",
        timestamp: "July 22, 2026 at 10:30 AM",
        branch: "Main Branch",
        customer: "Kamal Perera",
        cashier: "Nimali Silva",
        checkoutMethod: "CASH",
        paymentStatus: "PAID",
        subtotal: 12500,
        totalAmount: 12500,
        dueAmount: 0,
        items: [
            {
                id: "item-1",
                productName: "Lawn Mower Blade 18\"",
                quantity: 2,
                priceAtSale: 3500,
                originalPrice: 3500,
            },
            {
                id: "item-2",
                productName: "Organic Fertilizer 5kg",
                quantity: 1,
                priceAtSale: 5500,
                originalPrice: 6000,
            },
        ],
    },
    {
        id: "2",
        invoiceNumber: "INV-2026-002",
        date: "2026-07-22",
        time: "11:15 AM",
        timestamp: "July 22, 2026 at 11:15 AM",
        branch: "City Center",
        customer: "Sunil Shantha",
        cashier: "Kasun Fernando",
        checkoutMethod: "CREDIT",
        paymentStatus: "PARTIALLY_PAID",
        subtotal: 45000,
        totalAmount: 45000,
        dueAmount: 15000,
        items: [
            {
                id: "item-3",
                productName: "Grass Trimmer 250W",
                quantity: 1,
                priceAtSale: 45000,
                originalPrice: 45000,
            },
        ],
    },
    {
        id: "3",
        invoiceNumber: "INV-2026-003",
        date: "2026-07-21",
        time: "03:45 PM",
        timestamp: "July 21, 2026 at 03:45 PM",
        branch: "Main Branch",
        customer: "",
        cashier: "Nimali Silva",
        checkoutMethod: "BANK_TRANSFER",
        paymentStatus: "PENDING",
        subtotal: 8200,
        totalAmount: 8200,
        dueAmount: 8200,
        items: [
            {
                id: "item-4",
                productName: "Garden Hose Pipe 15m",
                quantity: 1,
                priceAtSale: 8200,
                originalPrice: 8500,
            },
        ],
    },
]

export default function SalesRecordsContainer() {
    const [sales] = useState<SaleRecord[]>(INITIAL_SALES)
    const [selectedStatus, setSelectedStatus] = useState("ALL")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null)
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
    const [copiedInvoice, setCopiedInvoice] = useState<string | null>(null)

    const handleCopyInvoice = (invoiceNumber: string) => {
        navigator.clipboard.writeText(invoiceNumber)
        setCopiedInvoice(invoiceNumber)
        setTimeout(() => setCopiedInvoice(null), 2000)
    }

    const handleOpenDetail = (sale: SaleRecord) => {
        setSelectedSale(sale)
        setIsDetailSheetOpen(true)
    }

    const filteredSales = useMemo(() => {
        return sales.filter((sale) => {
            const matchesStatus =
                selectedStatus === "ALL" || sale.paymentStatus === selectedStatus

            const query = searchQuery.toLowerCase().trim()
            const matchesQuery =
                !query ||
                sale.invoiceNumber.toLowerCase().includes(query) ||
                (sale.customer && sale.customer.toLowerCase().includes(query))

            return matchesStatus && matchesQuery
        })
    }, [sales, selectedStatus, searchQuery])

    return (
        <div className="space-y-6 p-4 sm:p-6">
            {/* Search & Filter Component */}
            <SalesFilterHeader
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Sales Records</h3>

                {/* Mobile View */}
                <SalesMobileCards
                    sales={filteredSales}
                    onSelectSale={handleOpenDetail}
                />

                {/* Desktop View */}
                <SalesTable
                    sales={filteredSales}
                    copiedInvoice={copiedInvoice}
                    onCopyInvoice={handleCopyInvoice}
                    onSelectSale={handleOpenDetail}
                />

                {/* Empty State */}
                {filteredSales.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-12 text-center">
                        <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                            No sales records found matching your criteria
                        </p>
                    </div>
                )}
            </div>

            {/* Invoice Detail Dialog / Sheet */}
            <SaleDetailSheet
                isOpen={isDetailSheetOpen}
                onOpenChange={setIsDetailSheetOpen}
                sale={selectedSale}
                copiedInvoice={copiedInvoice}
                onCopyInvoice={handleCopyInvoice}
            />
        </div>
    )
}