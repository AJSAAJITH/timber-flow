export type ExpenseType =
    | "INCOME"
    | "PROFIT_WITHDRAWAL"
    | "SALARY"
    | "PETTY_CASH"
    | "BILL_PAYMENT";

export interface ExpenseRecord {
    id: string;
    date: string;
    time: string;
    branch: string;
    authorizedUser: string;
    type: ExpenseType;
    description: string;
    amount: number;
}

export interface ChartData {
    name: string;
    income: number;
    expenses: number;
}

export interface ExpenseTypeOption {
    value: ExpenseType;
    label: string;
}

export interface NewExpenseForm {
    amount: string;
    type: ExpenseType;
    description: string;
}