"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EXPENSE_TYPES, TIMEFRAMES } from "./constants/finance";
import { ExecutiveSummary } from "./components/finance/ExecutiveSummary";
import { formatCurrency, getTypeColor } from "./utils/finance";
import { FinanceChart } from "./components/finance/FinanceChart";
import { ExpenseTable } from "./components/finance/ExpenseTable";
import { RecordExpenseSheet } from "./components/finance/RecordExpenseSheet";
import { FinanceSummaryBreakdown } from "./components/finance/FinanceSummaryBreakdown";
import { useFinance } from "./hooks/usefinance";

export default function FinanceClientPage() {
    const {
        selectedTimeframe,
        setSelectedTimeframe,
        isRecordExpenseOpen,
        setIsRecordExpenseOpen,
        newExpense,
        setNewExpense,
        filteredExpenses,
        expenseBreakdown,
        metrics,
        chartData,
        loading,
        isSubmitting,
        handleRecordExpense,
    } = useFinance();

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="border-b border-border bg-card/50 p-4 sm:p-6 md:p-8">
                <h1 className="text-3xl font-bold text-foreground">Finance & Expense Management</h1>
                <p className="mt-1 text-muted-foreground">Track income, expenses, and cash flow across branches</p>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8 space-y-6">
                {/* Top Control Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                        {/* Timeframe Filter */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground block mb-2">Timeframe</label>
                            <div className="flex gap-1 bg-secondary rounded-lg p-1">
                                {TIMEFRAMES.map((timeframe) => (
                                    <button
                                        key={timeframe}
                                        onClick={() => setSelectedTimeframe(timeframe)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${selectedTimeframe === timeframe
                                            ? "bg-primary text-primary-foreground"
                                            : "text-secondary-foreground hover:bg-secondary/80"
                                            }`}
                                    >
                                        {timeframe}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Record Expense Button */}
                    <Button
                        onClick={() => setIsRecordExpenseOpen(true)}
                        className="gap-2 min-h-[44px] w-full sm:w-auto bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4" />
                        Record Expense / Cash Out
                    </Button>
                </div>

                {/* Executive Summary Cards */}
                <ExecutiveSummary metrics={metrics} />

                {/* Analytics & Breakdown Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
                        <h3 className="font-semibold text-foreground mb-4">Income vs Expenses Trend</h3>
                        <FinanceChart height={320} data={chartData} />
                    </div>
                    <div className="lg:col-span-1">
                        <FinanceSummaryBreakdown
                            breakdown={expenseBreakdown}
                            totalExpenses={metrics.totalExpenses}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Financial Logs Table / Mobile View */}
                <div className="space-y-6">
                    {/* Mobile: Tabs View */}
                    <div className="md:hidden">
                        <Tabs defaultValue="logs" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="logs">Financial Logs</TabsTrigger>
                                <TabsTrigger value="chart">Analytics Chart</TabsTrigger>
                            </TabsList>

                            {/* Mobile Logs Tab */}
                            <TabsContent value="logs" className="space-y-4 mt-4">
                                <div className="space-y-3">
                                    {loading ? (
                                        <p className="text-sm text-muted-foreground text-center py-4">Loading financial logs...</p>
                                    ) : filteredExpenses.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-4">No expense logs found.</p>
                                    ) : (
                                        filteredExpenses.map((expense) => {
                                            const createdAtDate = expense.createdAt ? new Date(expense.createdAt) : new Date();
                                            const formattedDate = createdAtDate.toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            });
                                            const formattedTime = createdAtDate.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            });

                                            return (
                                                <div key={expense.id} className="rounded-lg border border-border bg-card p-4">
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-foreground truncate">{expense.description}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {formattedDate} {formattedTime}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getTypeColor(expense.type)}`}
                                                        >
                                                            {EXPENSE_TYPES.find((t) => t.value === expense.type)?.label || expense.type}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-1.5 text-sm border-t border-border pt-3">
                                                        <p className="text-muted-foreground">
                                                            Branch: {expense.branchName || (expense as any).branch || "Main Branch"}
                                                        </p>
                                                        <p className="text-muted-foreground">
                                                            User: {expense.userName || (expense as any).authorizedUser || "System"}
                                                        </p>
                                                        <p className="font-bold text-lg text-red-600 dark:text-red-400">
                                                            -{formatCurrency(expense.amount)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </TabsContent>

                            {/* Mobile Chart Tab */}
                            <TabsContent value="chart" className="mt-4">
                                <div className="rounded-lg border border-border bg-card p-4">
                                    <FinanceChart height={300} data={chartData} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Desktop: Full Width Log Table */}
                    <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
                        <div className="p-4 border-b border-border">
                            <h3 className="font-semibold text-foreground">Expense & Income Log</h3>
                        </div>
                        <ExpenseTable expenses={filteredExpenses} isLoading={loading} />
                    </div>
                </div>
            </div>

            {/* Record Expense Sheet Modal */}
            <RecordExpenseSheet
                isOpen={isRecordExpenseOpen}
                onOpenChange={setIsRecordExpenseOpen}
                newExpense={newExpense}
                setNewExpense={setNewExpense}
                onSubmit={handleRecordExpense}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}