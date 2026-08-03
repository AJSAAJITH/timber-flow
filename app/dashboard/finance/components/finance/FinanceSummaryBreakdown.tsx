"use client";

import React from "react";
import { PieChart, Wallet } from "lucide-react";
import { EXPENSE_TYPES } from "../../constants/finance";
import { formatCurrency, getTypeColor } from "../../utils/finance";

export interface ExpenseBreakdownItem {
    type: string;
    amount: number;
    percentage: number;
}

interface FinanceSummaryBreakdownProps {
    breakdown: ExpenseBreakdownItem[];
    totalExpenses: number;
    loading?: boolean;
}

export function FinanceSummaryBreakdown({
    breakdown,
    totalExpenses,
    loading = false,
}: FinanceSummaryBreakdownProps) {
    if (loading) {
        return (
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-48 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between">
                                <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
            <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                            <PieChart className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Expense Breakdown</h3>
                            <p className="text-xs text-muted-foreground">Distribution by category</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total Spent</p>
                        <p className="text-sm font-bold text-foreground">{formatCurrency(totalExpenses)}</p>
                    </div>
                </div>

                {/* Content List */}
                {breakdown.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <Wallet className="h-10 w-10 stroke-1 mb-2 opacity-50" />
                        <p className="text-sm">No expenses recorded for this timeframe.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {breakdown.map((item) => {
                            const categoryLabel =
                                EXPENSE_TYPES.find((t) => t.value === item.type)?.label || item.type;
                            const badgeColorClass = getTypeColor(item.type);

                            return (
                                <div key={item.type} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs sm:text-sm">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span
                                                className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${badgeColorClass}`}
                                            >
                                                {categoryLabel}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-foreground">
                                                {formatCurrency(item.amount)}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-medium w-12 text-right">
                                                {item.percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Visual Bar */}
                                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500/80 transition-all duration-500 rounded-full"
                                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}