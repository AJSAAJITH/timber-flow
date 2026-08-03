import { ExpenseType } from "@prisma/client";

export interface ExpenseTypeOption {
    label: string;
    value: ExpenseType;
}

export const EXPENSE_TYPES: ExpenseTypeOption[] = [
    { label: "General Expense", value: "GENERAL" },
    { label: "Profit Withdrawal", value: "PROFIT_WITHDRAWAL" },
    { label: "Salary", value: "SALARY" },
    { label: "Petty Cash", value: "PETTY_CASH" },
    { label: "Bill Payment", value: "BILL_PAYMENT" },
];

export const TIMEFRAMES = ["Today", "This Week", "This Month"] as const;