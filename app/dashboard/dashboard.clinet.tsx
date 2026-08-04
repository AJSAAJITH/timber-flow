// app/dashboard/dashboard.client.tsx
"use client";

import React, { useEffect, useState, useTransition, useRef } from "react";
import Link from "next/link";
import { useBranch } from "@/lib/branch-context";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
    DollarSign,
    Clock,
    PackageCheck,
    ArrowUpRight,
    AlertCircle,
} from "lucide-react";
import { DashboardData } from "@/lib/types";
import { getDashboardMetrics } from "@/actions/dashboard.action";

const formatLKR = (amount: number) => {
    return `LKR ${amount.toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

interface DashboardPageProps {
    initialData?: DashboardData | null;
}

export default function DashboardPage({ initialData }: DashboardPageProps) {
    const { user, selectedBranchId, selectedBranchName } = useBranch();
    const [data, setData] = useState<DashboardData | null>(initialData || null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    // Prevent re-fetching on mount if initial server data exists for "ALL"
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            // If we already have initialData and selectedBranchId is ALL, skip initial client fetch
            if (initialData && selectedBranchId === "ALL") {
                return;
            }
        }

        let isMounted = true;

        startTransition(async () => {
            setError(null);
            const res = await getDashboardMetrics(selectedBranchId);

            if (!isMounted) return;

            if (res.success) {
                setData(res.data);
            } else {
                setError(res.error || "Something went wrong loading data.");
            }
        });

        return () => {
            isMounted = false;
        };
    }, [selectedBranchId, initialData]);

    const stats = [
        {
            label: "Today's Total Sales",
            value: data ? formatLKR(data.stats.todayTotalSales) : "LKR 0.00",
            subtext: `${data?.stats.todayInvoiceCount || 0} Invoices generated today`,
            icon: DollarSign,
            color: "text-emerald-600 dark:text-emerald-400",
        },
        {
            label: "Total Pending Due",
            value: data ? formatLKR(data.stats.totalPendingDue) : "LKR 0.00",
            subtext: `${data?.stats.pendingInvoiceCount || 0} Credit / Partial sales pending`,
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
        },
        {
            label: "Today's Stock Issued",
            value: `${data?.stats.todayStockIssuedUnits || 0} Units / Pcs`,
            subtext: "Items deducted from inventory today",
            icon: PackageCheck,
            color: "text-blue-600 dark:text-blue-400",
        },
    ];

    return (
        <div className="w-full p-4 sm:p-6 md:p-8 space-y-6">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Welcome back, {user?.name || "User"}!
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Current Active Filter:{" "}
                        <span className="font-semibold text-primary">
                            {selectedBranchId === "ALL"
                                ? "🏢 All Branches (Global Overview)"
                                : `📍 Selected Branch: ${selectedBranchName}`}
                        </span>
                    </p>
                </div>
            </div>

            {/* Error Message Display */}
            {error && (
                <div className="p-4 rounded-lg bg-destructive/15 border border-destructive text-destructive text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}

            {/* Today's Key Performance Indicators (Stats Cards) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={stat.label}
                            className="flex flex-col border-border bg-card p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </h3>
                                <div className={`p-2 rounded-lg bg-secondary/80 ${stat.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>
                            <div>
                                {isPending && !data ? (
                                    <Skeleton className="h-8 w-3/4 mb-2" />
                                ) : (
                                    <p className="text-xl font-bold text-foreground md:text-2xl">
                                        {stat.value}
                                    </p>
                                )}
                                <p className="mt-1 text-xs font-medium text-muted-foreground">
                                    {stat.subtext}
                                </p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
                {/* 1. Today Sales List */}
                <Card className="lg:col-span-2 border-border bg-card p-6 space-y-4">
                    {/* Fixed Header */}
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Today Sales
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Overview of all invoices created today
                            </p>
                        </div>
                        <Link
                            href="/dashboard/sales"
                            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                            View All Sales <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {/* Scrollable List Container */}
                    <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 sm:pr-2">
                        {isPending && !data ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="p-4 border border-border rounded-lg space-y-2"
                                >
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            ))
                        ) : data?.todaySales && data.todaySales.length > 0 ? (
                            data.todaySales.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-border p-4 hover:bg-accent/40 transition-colors gap-3"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-mono text-xs font-bold bg-muted px-2 py-0.5 rounded text-foreground">
                                                {tx.invoiceNumber}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {tx.time}
                                            </span>
                                            <span className="text-xs text-muted-foreground">•</span>
                                            <span className="text-xs font-medium text-primary">
                                                {tx.customerName}
                                            </span>
                                        </div>
                                        <p className="font-medium text-sm text-foreground line-clamp-1">
                                            {tx.itemsSummary}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Branch: <span className="text-foreground">{tx.branchName}</span>
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:items-end justify-between gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                                        <p className="font-bold text-sm sm:text-base text-foreground">
                                            {formatLKR(tx.totalAmount)}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            {tx.dueAmount > 0 && (
                                                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                                    Due: {formatLKR(tx.dueAmount)}
                                                </span>
                                            )}
                                            <span
                                                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${tx.status === "PAID"
                                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                        : tx.status === "PARTIALLY_PAID"
                                                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                                            : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                                                    }`}
                                            >
                                                {tx.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-xs text-muted-foreground">
                                No sales recorded today for this branch.
                            </div>
                        )}
                    </div>
                </Card>

                {/* 2. Quick Actions */}
                <Card className="border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">
                        Quick ERP Actions
                    </h2>
                    <div className="space-y-2">
                        {[
                            { label: "New Bill (POS)", href: "/dashboard/pos" },
                            { label: "Add New Stock", href: "/dashboard/inventory" },
                        ].map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="block w-full text-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-all"
                            >
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}