import { useState, useMemo } from "react";
import { ExpenseRecord, NewExpenseForm } from "../types/finance";
import { MOCK_EXPENSES } from "../constants/finance";

export function useFinance() {
    const [expenses, setExpenses] = useState<ExpenseRecord[]>(MOCK_EXPENSES);
    const [selectedBranch, setSelectedBranch] = useState<string>("All Branches");
    const [selectedTimeframe, setSelectedTimeframe] = useState<string>("This Week");
    const [isRecordExpenseOpen, setIsRecordExpenseOpen] = useState<boolean>(false);
    const [newExpense, setNewExpense] = useState<NewExpenseForm>({
        amount: "",
        type: "PROFIT_WITHDRAWAL",
        description: "",
    });

    const filteredExpenses = useMemo(() => {
        return expenses.filter(
            (exp) => selectedBranch === "All Branches" || exp.branch === selectedBranch
        );
    }, [expenses, selectedBranch]);

    const metrics = useMemo(() => {
        const income = filteredExpenses
            .filter((exp) => exp.type === "INCOME")
            .reduce((sum, exp) => sum + exp.amount, 0);

        const totalExp = filteredExpenses
            .filter((exp) => exp.type !== "INCOME")
            .reduce((sum, exp) => sum + exp.amount, 0);

        return {
            totalIncome: income,
            totalExpenses: totalExp,
            netCashFlow: income - totalExp,
        };
    }, [filteredExpenses]);

    const handleRecordExpense = () => {
        if (!newExpense.amount || !newExpense.description) return;

        const record: ExpenseRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
            branch: selectedBranch === "All Branches" ? "Main Counter" : selectedBranch,
            authorizedUser: "Current Admin",
            type: newExpense.type,
            description: newExpense.description,
            amount: parseFloat(newExpense.amount),
        };

        setExpenses((prev) => [record, ...prev]);
        setIsRecordExpenseOpen(false);
        setNewExpense({ amount: "", type: "PROFIT_WITHDRAWAL", description: "" });
    };

    return {
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
    };
}