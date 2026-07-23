"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinance } from "./hooks/usefinance";
import { BRANCHES, EXPENSE_TYPES, TIMEFRAMES } from "./constants/finance";
import { ExecutiveSummary } from "./components/finance/ExecutiveSummary";
import { formatCurrency, getTypeColor } from "./utils/finance";
import { FinanceChart } from "./components/finance/FinanceChart";
import { ExpenseTable } from "./components/finance/ExpenseTable";
import { RecordExpenseSheet } from "./components/finance/RecordExpenseSheet";


export default function FinanceClientPage() {
    const {
        selectedBranch,
        setSelectedBranch,
        selectedTimeframe,
        setSelectedTimeframe,
        isRecordExpenseOpen,
        setIsRecordExpenseOpen,
        newExpense,
        setNewExpense,
        filteredExpenses,
        metrics,
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
                        {/* Branch Selector */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground block mb-2">Branch</label>
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                {BRANCHES.map((branch) => (
                                    <option key={branch}>{branch}</option>
                                ))}
                            </select>
                        </div>

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

                {/* Main Analytics Layout */}
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
                                    {filteredExpenses.map((expense) => (
                                        <div key={expense.id} className="rounded-lg border border-border bg-card p-4">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-foreground truncate">{expense.description}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {expense.date} {expense.time}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getTypeColor(expense.type)}`}
                                                >
                                                    {EXPENSE_TYPES.find((t) => t.value === expense.type)?.label}
                                                </span>
                                            </div>

                                            <div className="space-y-1.5 text-sm border-t border-border pt-3">
                                                <p className="text-muted-foreground">Branch: {expense.branch}</p>
                                                <p className="text-muted-foreground">User: {expense.authorizedUser}</p>
                                                <p className={`font-bold text-lg ${expense.type === "INCOME" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                                    {expense.type === "INCOME" ? "+" : "-"}{formatCurrency(expense.amount)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Mobile Chart Tab */}
                            <TabsContent value="chart" className="mt-4">
                                <div className="rounded-lg border border-border bg-card p-4">
                                    <FinanceChart height={300} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Desktop: Split View */}
                    <div className="hidden md:grid grid-cols-[1.85fr_1.15fr] gap-6">
                        {/* Left: Expense Log Table */}
                        <div className="rounded-lg border border-border bg-card overflow-hidden">
                            <div className="p-4 border-b border-border">
                                <h3 className="font-semibold text-foreground">Expense & Income Log</h3>
                            </div>
                            <ExpenseTable expenses={filteredExpenses} />
                        </div>

                        {/* Right: Analytics Chart */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <h3 className="font-semibold text-foreground mb-4">Income vs Expenses Trend</h3>
                            <FinanceChart height={350} />
                        </div>
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
            />
        </div>
    );
}