// components/sales/SalesRecordsContainer.tsx
"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import {
    Search,
    Calendar,
    Filter,
    RefreshCw,
    Receipt,
    DollarSign,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Eye,
} from "lucide-react";

import { useBranch } from "@/lib/branch-context"; // Branch Context Path එක නිවැරදිදැයි බලන්න


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SaleDetailSheet } from "./SaleDetailSheet"; // ඔබ ලඟ ඇති Sheet Component එක
import { CheckoutMethod, PaymentStatus, SaleRecord, SalesSummaryStats } from "../../types/sales.types";
import { getSalesHistory } from "@/actions/sales.action";
import { formatCurrency, getPaymentMethodColor, getPaymentStatusColor } from "../../utils/sales-helpers";
import { Badge } from "@/components/ui/badge";

export default function SalesRecordsContainer() {
    const { selectedBranchId, selectedBranchName } = useBranch();
    const [isPending, startTransition] = useTransition();

    // Data State
    const [sales, setSales] = useState<SaleRecord[]>([]);
    const [stats, setStats] = useState<SalesSummaryStats>({
        totalRevenue: 0,
        totalSalesCount: 0,
        totalDueAmount: 0,
        totalPaidAmount: 0,
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        totalPages: 1,
        limit: 10,
    });

    // Filters State
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<CheckoutMethod | "ALL">("ALL");
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "ALL">("ALL");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    // Sheet / Modal State
    const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
    const [copiedInvoice, setCopiedInvoice] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Fetch Sales Function
    const fetchSales = useCallback(
        (pageNumber: number = 1) => {
            setErrorMessage(null);
            startTransition(async () => {
                const res = await getSalesHistory({
                    branchId: selectedBranchId,
                    searchQuery,
                    paymentMethod,
                    paymentStatus,
                    startDate: startDate || undefined,
                    endDate: endDate || undefined,
                    page: pageNumber,
                    limit: 10,
                });

                if (res.success) {
                    setSales(res.data);
                    setStats(res.stats);
                    setPagination(res.pagination);
                } else {
                    setErrorMessage(res.error || "Failed to load sales data.");
                }
            });
        },
        [selectedBranchId, searchQuery, paymentMethod, paymentStatus, startDate, endDate]
    );

    // Context හෝ Filters වෙනස්වන විට auto-refetch
    useEffect(() => {
        fetchSales(1);
    }, [fetchSales]);

    // Handle Copy Invoice
    const handleCopyInvoice = (invoiceNumber: string) => {
        navigator.clipboard.writeText(invoiceNumber);
        setCopiedInvoice(invoiceNumber);
        setTimeout(() => setCopiedInvoice(null), 2000);
    };

    // Open Details Sheet
    const handleViewDetails = (sale: SaleRecord) => {
        setSelectedSale(sale);
        setIsSheetOpen(true);
    };

    // Reset Filters
    const handleResetFilters = () => {
        setSearchQuery("");
        setPaymentMethod("ALL");
        setPaymentStatus("ALL");
        setStartDate("");
        setEndDate("");
    };

    return (
        <div className="space-y-6 p-2 md:p-4">
            {/* Header Status & Branch Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Active Filter Scope
                    </p>
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <span>{selectedBranchName}</span>
                        {selectedBranchId === "ALL" && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                                Global View
                            </Badge>
                        )}
                    </h2>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchSales(pagination.page)}
                    disabled={isPending}
                    className="self-start sm:self-auto gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
                    Refresh Records
                </Button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card border-border shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Total Sales Count</p>
                            {isPending ? (
                                <Skeleton className="h-7 w-20 mt-1" />
                            ) : (
                                <p className="text-2xl font-bold text-foreground mt-0.5">
                                    {stats.totalSalesCount}
                                </p>
                            )}
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <Receipt className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Total Revenue</p>
                            {isPending ? (
                                <Skeleton className="h-7 w-28 mt-1" />
                            ) : (
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                    {formatCurrency(stats.totalRevenue)}
                                </p>
                            )}
                        </div>
                        <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Total Collected</p>
                            {isPending ? (
                                <Skeleton className="h-7 w-28 mt-1" />
                            ) : (
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                                    {formatCurrency(stats.totalPaidAmount)}
                                </p>
                            )}
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Outstanding Due</p>
                            {isPending ? (
                                <Skeleton className="h-7 w-28 mt-1" />
                            ) : (
                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                                    {formatCurrency(stats.totalDueAmount)}
                                </p>
                            )}
                        </div>
                        <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Toolbar */}
            <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {/* Search Input */}
                        <div className="relative lg:col-span-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by Invoice, Customer, Cashier..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Payment Method Select */}
                        <Select
                            value={paymentMethod}
                            onValueChange={(val) => setPaymentMethod(val as CheckoutMethod | "ALL")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Payment Method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Methods</SelectItem>
                                <SelectItem value="CASH">Cash</SelectItem>
                                <SelectItem value="CREDIT">Credit</SelectItem>
                                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Payment Status Select */}
                        <Select
                            value={paymentStatus}
                            onValueChange={(val) => setPaymentStatus(val as PaymentStatus | "ALL")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Payment Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Statuses</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Reset Filters Button */}
                        <Button
                            variant="ghost"
                            onClick={handleResetFilters}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Clear Filters
                        </Button>
                    </div>

                    {/* Date Filters Row */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-border/50 text-sm">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground text-xs font-medium">From:</span>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="h-9 w-full sm:w-auto text-xs"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-muted-foreground text-xs font-medium">To:</span>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="h-9 w-full sm:w-auto text-xs"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sales Data Table */}
            <Card className="bg-card border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground font-medium">
                            <tr>
                                <th className="py-3 px-4">Invoice No</th>
                                <th className="py-3 px-4">Date & Time</th>
                                <th className="py-3 px-4">Branch</th>
                                <th className="py-3 px-4">Customer</th>
                                <th className="py-3 px-4">Cashier</th>
                                <th className="py-3 px-4">Method</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Total Amount</th>
                                <th className="py-3 px-4 text-right">Due Amount</th>
                                <th className="py-3 px-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isPending ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={idx}>
                                        <td className="p-4" colSpan={10}>
                                            <Skeleton className="h-6 w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : sales.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="py-12 text-center text-muted-foreground">
                                        <Receipt className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                        <p className="font-medium text-base">No sales records found</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Try adjusting your filters or date range.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr
                                        key={sale.id}
                                        className="hover:bg-muted/40 transition-colors group cursor-pointer"
                                        onClick={() => handleViewDetails(sale)}
                                    >
                                        <td className="py-3.5 px-4 font-semibold text-foreground">
                                            {sale.invoiceNumber}
                                        </td>
                                        <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                                            <div>{sale.date}</div>
                                            <div className="text-[11px] opacity-80">{sale.time}</div>
                                        </td>
                                        <td className="py-3.5 px-4 text-foreground font-medium">
                                            {sale.branch}
                                        </td>
                                        <td className="py-3.5 px-4 text-foreground">
                                            {sale.customer}
                                        </td>
                                        <td className="py-3.5 px-4 text-muted-foreground">
                                            {sale.cashier}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPaymentMethodColor(
                                                    sale.checkoutMethod
                                                )}`}
                                            >
                                                {sale.checkoutMethod}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPaymentStatusColor(
                                                    sale.paymentStatus
                                                )}`}
                                            >
                                                {sale.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right font-bold text-foreground">
                                            {formatCurrency(sale.totalAmount)}
                                        </td>
                                        <td className="py-3.5 px-4 text-right font-semibold">
                                            {sale.dueAmount > 0 ? (
                                                <span className="text-red-600 dark:text-red-400">
                                                    {formatCurrency(sale.dueAmount)}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </td>
                                        <td
                                            className="py-3.5 px-4 text-center"
                                            onClick={(e) => e.stopPropagation()} // Table row click event එක Override කිරීම
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewDetails(sale)}
                                                className="h-8 w-8 p-0"
                                                title="View Sale Details"
                                            >
                                                <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!isPending && sales.length > 0 && (
                    <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                        <div>
                            Showing <span className="font-semibold text-foreground">{sales.length}</span> of{" "}
                            <span className="font-semibold text-foreground">{pagination.total}</span> records
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchSales(pagination.page - 1)}
                                disabled={pagination.page <= 1 || isPending}
                                className="h-8 px-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <span className="px-2 font-medium">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchSales(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages || isPending}
                                className="h-8 px-2"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Sale Details Slide-Over Sheet */}
            <SaleDetailSheet
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                sale={selectedSale}
                copiedInvoice={copiedInvoice}
                onCopyInvoice={handleCopyInvoice}
            />
        </div>
    );
}