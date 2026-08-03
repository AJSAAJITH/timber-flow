"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { ExpenseType, FinanceSummaryData, NewExpenseForm } from "../types/finance";
import { useBranch } from "@/lib/branch-context";
import { createExpense, getFinanceData } from "@/actions/finance.action";

export function useFinance() {
    const { selectedBranchId } = useBranch(); // Global Branch Context

    const [financeData, setFinanceData] = useState<FinanceSummaryData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedTimeframe, setSelectedTimeframe] = useState<string>("This Month");
    const [isRecordExpenseOpen, setIsRecordExpenseOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [newExpense, setNewExpense] = useState<NewExpenseForm>({
        amount: "",
        type: ExpenseType.PETTY_CASH,
        description: "",
    });

    // ----------------------------------------------------
    // Timeframe to Date Range Helper
    // ----------------------------------------------------
    const getDateRange = useCallback((timeframe: string) => {
        const now = new Date();
        const start = new Date();

        if (timeframe === "Today") {
            start.setHours(0, 0, 0, 0);
        } else if (timeframe === "This Week") {
            const day = now.getDay();
            const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
            start.setDate(diff);
            start.setHours(0, 0, 0, 0);
        } else if (timeframe === "This Month") {
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
        } else {
            return { startDate: undefined, endDate: undefined };
        }

        return {
            startDate: start.toISOString().split("T")[0],
            endDate: now.toISOString().split("T")[0],
        };
    }, []);

    // ----------------------------------------------------
    // Fetch Data from Server Action
    // ----------------------------------------------------
    const fetchFinance = useCallback(async () => {
        setLoading(true);
        const { startDate, endDate } = getDateRange(selectedTimeframe);

        const res = await getFinanceData({
            branchId: selectedBranchId,
            startDate,
            endDate,
            limit: 50,
        });

        if (res.success) {
            setFinanceData(res.data);
        } else {
            console.error("Failed to load finance data:", res.error);
        }
        setLoading(false);
    }, [selectedBranchId, selectedTimeframe, getDateRange]);

    useEffect(() => {
        fetchFinance();
    }, [fetchFinance]);

    // ----------------------------------------------------
    // Transform Expenses for UI
    // ----------------------------------------------------
    const filteredExpenses = useMemo(() => {
        if (!financeData?.expenses) return [];

        return financeData.expenses.map((exp) => {
            const dateObj = new Date(exp.createdAt);
            return {
                id: exp.id,
                date: dateObj.toISOString().split("T")[0],
                time: dateObj.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }),
                branch: exp.branchName,
                authorizedUser: exp.userName,
                type: exp.type,
                description: exp.description,
                amount: exp.amount,
            };
        });
    }, [financeData]);

    // ----------------------------------------------------
    // Transform Expense Breakdown by Category
    // ----------------------------------------------------
    const expenseBreakdown = useMemo(() => {
        if (!financeData?.expenseTypeBreakdown) return [];

        const totalSpent = financeData.stats?.totalExpenses || 0;

        return Object.entries(financeData.expenseTypeBreakdown)
            .map(([type, amount]) => {
                const numAmount = Number(amount || 0);
                const percentage = totalSpent > 0 ? (numAmount / totalSpent) * 100 : 0;
                return {
                    type,
                    amount: numAmount,
                    percentage,
                };
            })
            .sort((a, b) => b.amount - a.amount); // Highest expenses first
    }, [financeData]);

    // ----------------------------------------------------
    // Transform Metrics for UI Summary Cards
    // ----------------------------------------------------
    const metrics = useMemo(() => {
        if (!financeData?.stats) {
            return {
                totalSales: 0,
                totalIncome: 0,
                totalExpenses: 0,
                netCashFlow: 0,
                pendingDues: 0,
                totalCreditCollected: 0,
            };
        }

        return {
            totalSales: financeData.stats.totalSales,
            totalIncome: financeData.stats.totalActualIncome,
            totalExpenses: financeData.stats.totalExpenses,
            netCashFlow: financeData.stats.netCashflow,
            pendingDues: financeData.stats.pendingDues,
            totalCreditCollected: financeData.stats.totalCreditCollected,
        };
    }, [financeData]);

    // ----------------------------------------------------
    // Create Expense Handler
    // ----------------------------------------------------
    const handleRecordExpense = async () => {
        if (!newExpense.amount || !newExpense.description || isSubmitting) return;

        setIsSubmitting(true);

        const res = await createExpense({
            amount: parseFloat(newExpense.amount),
            description: newExpense.description,
            type: newExpense.type,
            branchId: selectedBranchId,
        });

        if (res.success) {
            setIsRecordExpenseOpen(false);
            setNewExpense({
                amount: "",
                type: ExpenseType.PETTY_CASH,
                description: "",
            });
            await fetchFinance(); // Refresh list & stats
        } else {
            alert(res.error || "Failed to record expense");
        }

        setIsSubmitting(false);
    };

    return {
        selectedBranch: selectedBranchId,
        selectedTimeframe,
        setSelectedTimeframe,
        isRecordExpenseOpen,
        setIsRecordExpenseOpen,
        newExpense,
        setNewExpense,
        filteredExpenses,
        expenseBreakdown,
        metrics,
        chartData: financeData?.chartData || [],
        loading,
        isSubmitting,
        handleRecordExpense,
        refetch: fetchFinance,
    };
}