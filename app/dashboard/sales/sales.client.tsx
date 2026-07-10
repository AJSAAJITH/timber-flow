"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Search,
    AlertTriangle,
    Copy,
    Eye,
    Clock,
    AlertCircle,
    Printer,
    DollarSign,
} from "lucide-react"

// Types
interface SaleItem {
    id: string
    productName: string
    quantity: number
    priceAtSale: number
    originalPrice: number
}

interface Sale {
    id: string
    invoiceNumber: string
    date: string
    time: string
    timestamp: string
    branch: string
    customer: string | null
    cashier: string
    items: SaleItem[]
    subtotal: number
    totalAmount: number
    checkoutMethod: "CASH" | "CREDIT" | "BANK_TRANSFER"
    paymentStatus: "PAID" | "PENDING" | "PARTIALLY_PAID"
    dueAmount: number
}

// Mock Sales Data
const MOCK_SALES: Sale[] = [
    {
        id: "s1",
        invoiceNumber: "INV-2026-001245",
        date: "2026-07-10",
        time: "14:32",
        timestamp: "2026-07-10 14:32:00",
        branch: "Main Branch",
        customer: "Roshan Kumar",
        cashier: "Jayasuriya",
        items: [
            { id: "i1", productName: "Wood Pallet 48x40", quantity: 5, priceAtSale: 2500, originalPrice: 2500 },
            { id: "i2", productName: "Metal Angle 40x40x3mm", quantity: 12, priceAtSale: 450, originalPrice: 450 },
        ],
        subtotal: 17900,
        totalAmount: 17900,
        checkoutMethod: "CASH",
        paymentStatus: "PAID",
        dueAmount: 0,
    },
    {
        id: "s2",
        invoiceNumber: "INV-2026-001244",
        date: "2026-07-10",
        time: "12:15",
        timestamp: "2026-07-10 12:15:00",
        branch: "Main Branch",
        customer: null,
        cashier: "Perera",
        items: [
            { id: "i3", productName: "Treated Wood Board (2x4)", quantity: 8, priceAtSale: 850, originalPrice: 850 },
        ],
        subtotal: 6800,
        totalAmount: 6800,
        checkoutMethod: "BANK_TRANSFER",
        paymentStatus: "PAID",
        dueAmount: 0,
    },
    {
        id: "s3",
        invoiceNumber: "INV-2026-001243",
        date: "2026-07-09",
        time: "16:45",
        timestamp: "2026-07-09 16:45:00",
        branch: "Negombo Branch",
        customer: "Priya Perera",
        cashier: "Silva",
        items: [
            { id: "i4", productName: "Premium Wood Pallet", quantity: 3, priceAtSale: 3200, originalPrice: 3200 },
            { id: "i5", productName: "Plastic Sheet 4x8ft", quantity: 2, priceAtSale: 2200, originalPrice: 2200 },
        ],
        subtotal: 14200,
        totalAmount: 14200,
        checkoutMethod: "CREDIT",
        paymentStatus: "PENDING",
        dueAmount: 14200,
    },
    {
        id: "s4",
        invoiceNumber: "INV-2026-001242",
        date: "2026-07-09",
        time: "10:20",
        timestamp: "2026-07-09 10:20:00",
        branch: "Galle Branch",
        customer: "Anura Silva",
        cashier: "Fernando",
        items: [
            { id: "i6", productName: "Steel Channel 50x50", quantity: 4, priceAtSale: 1200, originalPrice: 1200 },
        ],
        subtotal: 4800,
        totalAmount: 4800,
        checkoutMethod: "CASH",
        paymentStatus: "PARTIALLY_PAID",
        dueAmount: 2400,
    },
    {
        id: "s5",
        invoiceNumber: "INV-2026-001241",
        date: "2026-07-08",
        time: "09:30",
        timestamp: "2026-07-08 09:30:00",
        branch: "Main Branch",
        customer: "Nimal Jayasuriya",
        cashier: "Jayasuriya",
        items: [
            { id: "i7", productName: "Plywood 4x8 Grade A", quantity: 1, priceAtSale: 5400, originalPrice: 5400 },
        ],
        subtotal: 5400,
        totalAmount: 5400,
        checkoutMethod: "CREDIT",
        paymentStatus: "PENDING",
        dueAmount: 5400,
    },
]

const BRANCHES = ["All Branches", "Main Branch", "Negombo Branch", "Galle Branch", "Kandy Branch"]
const DATE_RANGES = ["Today", "Yesterday", "Last 7 Days", "Custom Range"]
const PAYMENT_METHODS = ["All Methods", "Cash", "Credit", "Bank Transfer"]
const PAYMENT_STATUSES = ["All Status", "Paid", "Pending", "Partially Paid"]

export default function SalesHistoryClientPage() {
    const [selectedBranch, setSelectedBranch] = useState("All Branches")
    const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days")
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("All Methods")
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All Status")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
    const [copiedInvoice, setCopiedInvoice] = useState<string | null>(null)

    // Filter sales
    const filteredSales = useMemo(() => {
        return MOCK_SALES.filter((sale) => {
            const matchesSearch =
                sale.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (sale.customer && sale.customer.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesBranch = selectedBranch === "All Branches" || sale.branch === selectedBranch

            let matchesPaymentMethod = true
            if (selectedPaymentMethod !== "All Methods") {
                const methodMap = { Cash: "CASH", Credit: "CREDIT", "Bank Transfer": "BANK_TRANSFER" }
                matchesPaymentMethod = sale.checkoutMethod === methodMap[selectedPaymentMethod as keyof typeof methodMap]
            }

            let matchesPaymentStatus = true
            if (selectedPaymentStatus !== "All Status") {
                const statusMap = { Paid: "PAID", Pending: "PENDING", "Partially Paid": "PARTIALLY_PAID" }
                matchesPaymentStatus = sale.paymentStatus === statusMap[selectedPaymentStatus as keyof typeof statusMap]
            }

            return matchesSearch && matchesBranch && matchesPaymentMethod && matchesPaymentStatus
        })
    }, [searchQuery, selectedBranch, selectedPaymentMethod, selectedPaymentStatus])

    // Attention required items (Pending + Partially Paid)
    const attentionRequired = useMemo(
        () =>
            filteredSales.filter(
                (sale) => sale.paymentStatus === "PENDING" || sale.paymentStatus === "PARTIALLY_PAID"
            ),
        [filteredSales]
    )

    // Copy to clipboard
    const copyInvoiceNumber = (invoiceNumber: string) => {
        navigator.clipboard.writeText(invoiceNumber)
        setCopiedInvoice(invoiceNumber)
        setTimeout(() => setCopiedInvoice(null), 2000)
    }

    // Format currency
    const formatCurrency = (amount: number) => `LKR ${amount.toLocaleString()}`

    // Get payment method badge color
    const getPaymentMethodColor = (method: string) => {
        switch (method) {
            case "CASH":
                return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
            case "CREDIT":
                return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
            case "BANK_TRANSFER":
                return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            default:
                return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300"
        }
    }

    // Get payment status badge color
    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "PAID":
                return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
            case "PENDING":
                return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
            case "PARTIALLY_PAID":
                return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
            default:
                return "bg-gray-100 dark:bg-gray-900/30"
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="border-b border-border bg-card/50 p-4 sm:p-6 md:p-8">
                <h1 className="text-3xl font-bold text-foreground">Sales History</h1>
                <p className="mt-1 text-muted-foreground">View and manage your sales transactions</p>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8 space-y-8">
                {/* Attention Required Section */}
                {attentionRequired.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            <h2 className="text-lg font-bold text-foreground">Attention Required: Pending & Partial Payments</h2>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-3">
                            {attentionRequired.map((sale) => (
                                <div
                                    key={sale.id}
                                    className="rounded-lg border border-red-200 dark:border-red-900/30 bg-gradient-to-r from-red-50 to-transparent dark:from-red-950/10 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-foreground">{sale.invoiceNumber}</p>
                                            <p className="text-sm text-muted-foreground">{sale.branch}</p>
                                        </div>
                                        <span
                                            className={`inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getPaymentStatusColor(sale.paymentStatus)}`}
                                        >
                                            {sale.paymentStatus === "PENDING" ? "PENDING" : "PARTIAL"}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5 text-sm mb-3">
                                        <p className="text-muted-foreground">Customer: {sale.customer || "Walk-In"}</p>
                                        <p className="font-bold text-red-700 dark:text-red-300">
                                            Due: {formatCurrency(sale.dueAmount)}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setSelectedSale(sale)
                                            setIsDetailSheetOpen(true)
                                        }}
                                        className="w-full min-h-[36px] bg-primary text-primary-foreground rounded font-medium text-sm hover:bg-primary/90 transition-colors"
                                    >
                                        Record Payment
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Carousel */}
                        <div className="hidden md:grid grid-cols-1 lg:grid-cols-5 gap-4">
                            {attentionRequired.map((sale) => (
                                <div
                                    key={sale.id}
                                    className="rounded-lg border border-red-200 dark:border-red-900/30 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4"
                                >
                                    <div className="space-y-3">
                                        <div>
                                            <p className="font-semibold text-foreground truncate text-sm">{sale.invoiceNumber}</p>
                                            <p className="text-xs text-muted-foreground">{sale.branch}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Outstanding Due</p>
                                            <p className="text-xl font-bold text-red-700 dark:text-red-300">
                                                {formatCurrency(sale.dueAmount)}
                                            </p>
                                        </div>

                                        <p className="text-xs text-muted-foreground">Customer: {sale.customer || "Walk-In"}</p>

                                        <button
                                            onClick={() => {
                                                setSelectedSale(sale)
                                                setIsDetailSheetOpen(true)
                                            }}
                                            className="w-full min-h-[36px] bg-green-600 hover:bg-green-700 text-white rounded font-medium text-sm transition-colors"
                                        >
                                            Record Payment
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filters Section */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Filters</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Branch Filter */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground block mb-2">Branch</label>
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                {BRANCHES.map((branch) => (
                                    <option key={branch}>{branch}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Range Filter */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground block mb-2">Date Range</label>
                            <select
                                value={selectedDateRange}
                                onChange={(e) => setSelectedDateRange(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                {DATE_RANGES.map((range) => (
                                    <option key={range}>{range}</option>
                                ))}
                            </select>
                        </div>

                        {/* Payment Method Filter */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground block mb-2">Payment Method</label>
                            <select
                                value={selectedPaymentMethod}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                {PAYMENT_METHODS.map((method) => (
                                    <option key={method}>{method}</option>
                                ))}
                            </select>
                        </div>

                        {/* Payment Status Filter */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground block mb-2">Payment Status</label>
                            <select
                                value={selectedPaymentStatus}
                                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                {PAYMENT_STATUSES.map((status) => (
                                    <option key={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-2">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by invoice number or customer name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Sales Records Display */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Sales Records</h3>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                        {filteredSales.map((sale) => (
                            <div key={sale.id} className="rounded-lg border border-border bg-card p-4">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-foreground truncate">{sale.invoiceNumber}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <Clock className="h-3 w-3" />
                                            {sale.date} {sale.time}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedSale(sale)
                                            setIsDetailSheetOpen(true)
                                        }}
                                        className="min-h-[36px] min-w-[36px] flex items-center justify-center hover:bg-secondary rounded transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                    <div>
                                        <p className="text-muted-foreground text-xs">Total Amount</p>
                                        <p className="font-bold text-foreground">{formatCurrency(sale.totalAmount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs">Status</p>
                                        <span
                                            className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${getPaymentStatusColor(sale.paymentStatus)}`}
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
                                        <p className="font-medium text-red-600 dark:text-red-400">Due: {formatCurrency(sale.dueAmount)}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
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
                                {filteredSales.map((sale) => (
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
                                                    onClick={() => copyInvoiceNumber(sale.invoiceNumber)}
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

                                        <TableCell className="text-sm text-muted-foreground">{sale.branch}</TableCell>

                                        <TableCell className="text-sm text-foreground">
                                            {sale.customer || <span className="text-muted-foreground italic">Walk-In</span>}
                                        </TableCell>

                                        <TableCell className="text-sm">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentMethodColor(sale.checkoutMethod)}`}>
                                                {sale.checkoutMethod === "CASH" && "Cash"}
                                                {sale.checkoutMethod === "CREDIT" && "Credit"}
                                                {sale.checkoutMethod === "BANK_TRANSFER" && "Bank Transfer"}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-sm">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(sale.paymentStatus)}`}>
                                                {sale.paymentStatus === "PAID" && "Paid"}
                                                {sale.paymentStatus === "PENDING" && "Pending"}
                                                {sale.paymentStatus === "PARTIALLY_PAID" && "Partial"}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-right text-sm font-semibold text-foreground">
                                            {formatCurrency(sale.totalAmount)}
                                        </TableCell>

                                        <TableCell
                                            className={`text-right text-sm font-semibold ${sale.dueAmount > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                                                }`}
                                        >
                                            {formatCurrency(sale.dueAmount)}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedSale(sale)
                                                    setIsDetailSheetOpen(true)
                                                }}
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

                    {filteredSales.length === 0 && (
                        <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-12 text-center">
                            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No sales records found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Invoice Detail Sheet */}
            <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                    {selectedSale && (
                        <>
                            <SheetHeader className="border-b border-border pb-4">
                                <SheetTitle>Invoice Details</SheetTitle>
                            </SheetHeader>

                            <div className="py-4 space-y-6">
                                {/* Header Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-bold text-lg text-foreground">{selectedSale.invoiceNumber}</h3>
                                        <button
                                            onClick={() => copyInvoiceNumber(selectedSale.invoiceNumber)}
                                            className="min-h-[32px] min-w-[32px] flex items-center justify-center hover:bg-secondary rounded transition-colors"
                                            title="Copy invoice number"
                                        >
                                            {copiedInvoice === selectedSale.invoiceNumber ? (
                                                <span className="text-sm text-green-600">✓ Copied</span>
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {selectedSale.timestamp}
                                    </p>
                                </div>

                                {/* Receipt-style breakdown */}
                                <div className="bg-secondary/50 rounded-lg p-4 space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Cashier:</span>
                                        <span className="font-medium text-foreground">{selectedSale.cashier}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Branch:</span>
                                        <span className="font-medium text-foreground">{selectedSale.branch}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Customer:</span>
                                        <span className="font-medium text-foreground">{selectedSale.customer || "Walk-In"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Method:</span>
                                        <span className={`font-medium inline-block px-2.5 py-1 rounded-full text-xs ${getPaymentMethodColor(selectedSale.checkoutMethod)}`}>
                                            {selectedSale.checkoutMethod === "CASH" && "Cash"}
                                            {selectedSale.checkoutMethod === "CREDIT" && "Credit"}
                                            {selectedSale.checkoutMethod === "BANK_TRANSFER" && "Bank Transfer"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <span className={`font-medium inline-block px-2.5 py-1 rounded-full text-xs ${getPaymentStatusColor(selectedSale.paymentStatus)}`}>
                                            {selectedSale.paymentStatus === "PAID" && "Paid"}
                                            {selectedSale.paymentStatus === "PENDING" && "Pending"}
                                            {selectedSale.paymentStatus === "PARTIALLY_PAID" && "Partial"}
                                        </span>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-foreground">Items Purchased</h4>
                                    <div className="space-y-2">
                                        {selectedSale.items.map((item) => (
                                            <div key={item.id} className="border border-border rounded-lg p-3 text-sm space-y-1">
                                                <p className="font-medium text-foreground">{item.productName}</p>
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Quantity:</span>
                                                    <span className="font-medium text-foreground">{item.quantity}</span>
                                                </div>
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Price at Sale:</span>
                                                    <span className="font-medium text-foreground">{formatCurrency(item.priceAtSale)}</span>
                                                </div>
                                                {item.priceAtSale !== item.originalPrice && (
                                                    <div className="flex justify-between text-amber-600 dark:text-amber-400 text-xs">
                                                        <span>Original:</span>
                                                        <span>{formatCurrency(item.originalPrice)}</span>
                                                    </div>
                                                )}
                                                <div className="border-t border-border pt-1 flex justify-between font-semibold">
                                                    <span>Subtotal:</span>
                                                    <span>{formatCurrency(item.priceAtSale * item.quantity)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="border-t border-border pt-4 space-y-2">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Subtotal:</span>
                                        <span>{formatCurrency(selectedSale.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-foreground bg-primary/10 rounded p-3">
                                        <span>Grand Total:</span>
                                        <span>{formatCurrency(selectedSale.totalAmount)}</span>
                                    </div>
                                    {selectedSale.dueAmount > 0 && (
                                        <div className="flex justify-between text-base font-bold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20 rounded p-3">
                                            <span>Due Amount:</span>
                                            <span>{formatCurrency(selectedSale.dueAmount)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2 pt-4 border-t border-border">
                                    <Button className="w-full gap-2 min-h-[44px]">
                                        <Printer className="h-4 w-4" />
                                        Print Receipt
                                    </Button>
                                    {selectedSale.dueAmount > 0 && (
                                        <Button variant="outline" className="w-full gap-2 min-h-[44px]">
                                            <DollarSign className="h-4 w-4" />
                                            Record Payment
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
