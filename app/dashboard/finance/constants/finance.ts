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

export const TIMEFRAMES = ["Today", "This Week", "This Month", "Last Month", "Specific Month"] as const;

export type TimeframeType = (typeof TIMEFRAMES)[number];

export const MONTHS = [
    { label: "January", value: 0 },
    { label: "February", value: 1 },
    { label: "March", value: 2 },
    { label: "April", value: 3 },
    { label: "May", value: 4 },
    { label: "June", value: 5 },
    { label: "July", value: 6 },
    { label: "August", value: 7 },
    { label: "September", value: 8 },
    { label: "October", value: 9 },
    { label: "November", value: 10 },
    { label: "December", value: 11 },
];