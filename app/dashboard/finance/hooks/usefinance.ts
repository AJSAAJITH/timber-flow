"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { ExpenseType, NewExpenseForm } from "../types/finance";
import { useBranch } from "@/lib/branch-context";
import { createExpense, getFinanceData } from "@/actions/finance.action";

export interface ExpenseRecord {
    id: string;
    amount: number;
    description: string;
    type: ExpenseType;
    createdAt: string | Date;
    branchName?: string;
    userName?: string;
    branch?: { name: string };
    user?: { name: string };
}

export interface FormattedExpense {
    id: string;
    createdAt: string | Date;
    date: string;
    time: string;
    branch: string;
    branchName: string;
    authorizedUser: string;
    userName: string;
    type: ExpenseType;
    description: string;
    amount: number;
}

export interface ChartDataPoint {
    date: string;
    sales: number;
    expenses: number;
}

export interface FinanceSummaryData {
    stats: {
        totalSales: number;
        totalActualIncome: number;
        totalExpenses: number;
        netCashflow: number;
        totalCreditCollected: number;
        pendingDues: number;
    };
    expenseTypeBreakdown: Record<string, number>;
    expenses: ExpenseRecord[];
    chartData: ChartDataPoint[];
    pagination: {
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    };
}

const INITIAL_NEW_EXPENSE: NewExpenseForm = {
    amount: "",
    description: "",
    type: ExpenseType.PETTY_CASH,
};

// Local Timezone එකට අනුකූලව YYYY-MM-DD format කරන Helper Function එක
const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export function useFinance() {
    const { selectedBranchId } = useBranch();

    const [financeData, setFinanceData] = useState<FinanceSummaryData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedTimeframe, setSelectedTimeframe] = useState<string>("This Month");
    const [isRecordExpenseOpen, setIsRecordExpenseOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [newExpense, setNewExpense] = useState<NewExpenseForm>(INITIAL_NEW_EXPENSE);

    const getDateRange = useCallback((timeframe: string) => {
        const now = new Date();
        const start = new Date();

        if (timeframe === "Today") {
            start.setHours(0, 0, 0, 0);
        } else if (timeframe === "This Week") {
            const day = now.getDay();
            const diff = now.getDate() - day + (day === 0 ? -6 : 1);
            start.setDate(diff);
            start.setHours(0, 0, 0, 0);
        } else if (timeframe === "This Month") {
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
        } else {
            return { startDate: undefined, endDate: undefined };
        }

        return {
            startDate: formatLocalDate(start),
            endDate: formatLocalDate(now),
        };
    }, []);

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

    const filteredExpenses = useMemo<FormattedExpense[]>(() => {
        if (!financeData?.expenses) return [];

        return financeData.expenses.map((exp) => {
            const dateObj = new Date(exp.createdAt);
            const branchName = exp.branchName || exp.branch?.name || "Main Branch";
            const userName = exp.userName || exp.user?.name || "System";

            return {
                id: exp.id,
                createdAt: exp.createdAt,
                date: formatLocalDate(dateObj),
                time: dateObj.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }),
                branch: branchName,
                branchName: branchName,
                authorizedUser: userName,
                userName: userName,
                type: exp.type,
                description: exp.description,
                amount: exp.amount,
            };
        });
    }, [financeData?.expenses]);

    const expenseBreakdown = useMemo(() => {
        if (!financeData?.expenseTypeBreakdown) return [];

        const totalSpent = financeData.stats?.totalExpenses || 0;

        return Object.entries(financeData.expenseTypeBreakdown)
            .map(([type, amount]) => {
                const numAmount = Number(amount || 0);
                const percentage = totalSpent > 0 ? (numAmount / totalSpent) * 100 : 0;
                return { type, amount: numAmount, percentage };
            })
            .sort((a, b) => b.amount - a.amount);
    }, [financeData?.expenseTypeBreakdown, financeData?.stats?.totalExpenses]);

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
    }, [financeData?.stats]);

    const handleRecordExpense = async (expenseFormData?: NewExpenseForm) => {
        const isFormObject = expenseFormData && typeof expenseFormData === "object" && "amount" in expenseFormData;
        const dataToSubmit = isFormObject ? expenseFormData : newExpense;

        const parsedAmount = parseFloat(dataToSubmit.amount);
        if (!dataToSubmit.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Please enter a valid expense amount.");
            return;
        }

        if (!dataToSubmit.description?.trim()) {
            alert("Please enter a description for the expense.");
            return;
        }

        if (selectedBranchId === "ALL") {
            alert("Please select a specific branch from the header filter to record expenses.");
            return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const res = await createExpense({
                amount: parsedAmount,
                description: dataToSubmit.description,
                type: dataToSubmit.type,
                branchId: selectedBranchId,
            });

            if (res.success) {
                setIsRecordExpenseOpen(false);
                setNewExpense(INITIAL_NEW_EXPENSE);
                // Data සාර්ථකව save වූ පසු refetch කරයි
                await fetchFinance();
            } else {
                alert(res.error || "Failed to record expense");
            }
        } catch (err) {
            console.error("Error submitting expense:", err);
            alert("An error occurred while saving the expense.");
        } finally {
            setIsSubmitting(false);
        }
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