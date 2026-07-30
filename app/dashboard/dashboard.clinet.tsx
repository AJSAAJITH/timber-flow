// app/dashboard/dashboard.client.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useBranch } from "@/lib/branch-context"; // 💡 Branch Context Import කරගන්න
import { Card } from "@/components/ui/card";
import { BarChart3, Users, DollarSign, ShoppingCart } from "lucide-react";

export default function DashboardPage() {
    // Global Branch Context එකෙන් Selected Branch එක සහ User ලබා ගනී
    const { user, selectedBranchId, selectedBranchName } = useBranch();
    const [loading, setLoading] = useState(false);

    // Switcher එකෙන් Branch එක වෙනස් කරන සෑම විටම මේ useEffect එක Run වේ
    useEffect(() => {
        async function fetchBranchData() {
            setLoading(true);
            try {
                console.log("Fetching sales & inventory data for Branch ID:", selectedBranchId);
                // 💡 මෙතැනට පසු පියවරකදී Real Server Action Call එක සම්බන්ධ කරගත හැක
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchBranchData();
    }, [selectedBranchId]);

    const stats = [
        {
            label: "Today's Gross Sales",
            value: "LKR 184,500",
            change: "+14.2% from yesterday",
            icon: DollarSign,
        },
        {
            label: "Active Wood Orders",
            value: "18 Pending",
            change: "4 Scheduled for delivery",
            icon: ShoppingCart,
        },
        {
            label: "Credit Customers Due",
            value: "LKR 420,000",
            change: "12 Customers pending pay",
            icon: Users,
        },
        {
            label: "Total Stock Available",
            value: "2,450 Items",
            change: "5 Items running low",
            icon: BarChart3,
        },
    ];

    const recentTransactions = [
        {
            id: "INV-2026-001",
            item: "Teak Wood Plank (2x4x10)",
            qty: "50 Pcs",
            branch: "Main Shop",
            amount: "LKR 75,000",
            status: "Paid",
        },
        {
            id: "INV-2026-002",
            item: "Mahogany Log (Grade A)",
            qty: "2 Logs",
            branch: "Galle Branch",
            amount: "LKR 110,000",
            status: "Credit",
        },
        {
            id: "INV-2026-003",
            item: "Plywood Board (3x3 - 6mm)",
            qty: "20 Sheets",
            branch: "Main Shop",
            amount: "LKR 24,000",
            status: "Paid",
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

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                                <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground md:text-2xl">
                                    {loading ? "..." : stat.value}
                                </p>
                                <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    {stat.change}
                                </p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
                {/* Recent Transactions List */}
                <Card className="lg:col-span-2 border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">
                        Recent Sales & Orders
                    </h2>
                    <div className="space-y-4">
                        {recentTransactions.map((tx) => (
                            <div
                                key={tx.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-border p-3.5 hover:bg-accent/50 gap-2"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm sm:text-base">
                                            {tx.item}
                                        </p>
                                        <span className="text-xs bg-muted px-2 py-0.5 rounded-md font-mono">
                                            {tx.qty}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {tx.id} •{" "}
                                        <span className="text-primary font-medium">
                                            {tx.branch}
                                        </span>
                                    </p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="font-semibold text-sm sm:text-base">
                                        {tx.amount}
                                    </p>
                                    <p
                                        className={`text-xs font-semibold ${tx.status === "Paid"
                                            ? "text-emerald-600"
                                            : "text-amber-600"
                                            }`}
                                    >
                                        {tx.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card className="border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">
                        Quick ERP Actions
                    </h2>
                    <div className="space-y-2">
                        {[
                            { label: "New Bill (POS)", href: "/dashboard/pos" },
                            { label: "Add New Stock", href: "/dashboard/inventory" },
                            { label: "Branch Management", href: "/dashboard/branches" },
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