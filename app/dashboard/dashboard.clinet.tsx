"use client"

import React from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { BarChart3, Users, DollarSign, ShoppingCart, PackageOpen } from "lucide-react"

export default function DashboardPage() {
    const { user } = useAuth()

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
    ]

    // Timber Specific Mock Transactions
    const recentTransactions = [
        { id: "INV-2026-001", item: "Teak Wood Plank (2x4x10)", qty: "50 Pcs", branch: "Main Shop", amount: "LKR 75,000", status: "Paid" },
        { id: "INV-2026-002", item: "Mahogany Log (Grade A)", qty: "2 Logs", branch: "Galle Branch", amount: "LKR 110,000", status: "Credit" },
        { id: "INV-2026-003", item: "Plywood Board (3x3 - 6mm)", qty: "20 Sheets", branch: "Main Shop", amount: "LKR 24,000", status: "Paid" },
        { id: "INV-2026-004", item: "Satinwood Rafters (1.5x2)", qty: "100 Pcs", branch: "Negombo Branch", amount: "LKR 45,000", status: "Partially Paid" },
        { id: "INV-2026-005", item: "Treating Chemical Barrel", qty: "1 Barrel", branch: "Galle Branch", amount: "LKR 18,500", status: "Paid" },
    ]

    return (
        <div className="w-full p-4 sm:p-6 md:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Welcome back, {user?.name?.split(" ")[0] || "Super Admin"}!
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    TimberFlow Multi-Branch Overview and Enterprise Summary.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
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
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-xl font-bold text-foreground md:text-2xl">
                                        {stat.value}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-green-600 dark:text-green-400">
                                        {stat.change}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">

                {/* Recent Transactions - Timber focused */}
                <Card className="lg:col-span-2 border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">
                        Recent Sales & Orders
                    </h2>
                    <div className="space-y-4">
                        {recentTransactions.map((tx) => (
                            <div
                                key={tx.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-border/50 p-3.5 hover:bg-accent/50 transition-colors gap-2"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-foreground text-sm sm:text-base">
                                            {tx.item}
                                        </p>
                                        <span className="text-xs bg-muted px-2 py-0.5 rounded-md font-mono">{tx.qty}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {tx.id} • <span className="text-primary/80 font-medium">{tx.branch}</span>
                                    </p>
                                </div>
                                <div className="text-left sm:text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end border-t sm:border-none pt-2 sm:pt-0">
                                    <p className="font-semibold text-foreground text-sm sm:text-base">
                                        {tx.amount}
                                    </p>
                                    <p className={`text-xs font-semibold ${tx.status === "Paid" ? "text-green-600 dark:text-green-400" :
                                        tx.status === "Credit" ? "text-destructive" : "text-amber-600"
                                        }`}>
                                        {tx.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Quick Actions Panel */}
                <Card className="border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">
                        Quick ERP Actions
                    </h2>
                    <div className="space-y-2">
                        {[
                            { label: "New Bill (POS)", href: "/dashboard/pos" },
                            { label: "Add New Item / Stock", href: "/dashboard/inventory" },
                            { label: "Add Shop Expenses", href: "/dashboard/finance" },
                            { label: "Manage Branches", href: "/dashboard/branches" },
                        ].map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="block w-full text-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:scale-98 transition-all duration-200"
                            >
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}