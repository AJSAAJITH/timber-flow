import { ExpenseRecord, ChartData, ExpenseTypeOption } from "../types/finance";

export const MOCK_EXPENSES: ExpenseRecord[] = [
    {
        id: "1",
        date: "2026-07-10",
        time: "16:45",
        branch: "Main Counter",
        authorizedUser: "Admin Jayasuriya",
        type: "PROFIT_WITHDRAWAL",
        description: "Profit withdrawal for personal use",
        amount: 45000,
    },
    {
        id: "2",
        date: "2026-07-10",
        time: "14:30",
        branch: "Main Counter",
        authorizedUser: "Cashier Perera",
        type: "INCOME",
        description: "Cash sales collection",
        amount: 125000,
    },
    {
        id: "3",
        date: "2026-07-10",
        time: "13:15",
        branch: "Main Counter",
        authorizedUser: "Manager Silva",
        type: "SALARY",
        description: "Monthly salary payout",
        amount: 35000,
    },
    {
        id: "4",
        date: "2026-07-10",
        time: "11:00",
        branch: "Negombo Warehouse",
        authorizedUser: "Admin Fernando",
        type: "BILL_PAYMENT",
        description: "Electricity bill payment",
        amount: 8500,
    },
    {
        id: "5",
        date: "2026-07-09",
        time: "15:30",
        branch: "Main Counter",
        authorizedUser: "Cashier Jayasuriya",
        type: "INCOME",
        description: "Credit sales collection",
        amount: 85000,
    },
    {
        id: "6",
        date: "2026-07-09",
        time: "12:00",
        branch: "Main Counter",
        authorizedUser: "Manager Nimal",
        type: "PETTY_CASH",
        description: "Office supplies and materials",
        amount: 3500,
    },
];

export const CHART_DATA: ChartData[] = [
    { name: "Mon", income: 125000, expenses: 53500 },
    { name: "Tue", income: 98000, expenses: 35000 },
    { name: "Wed", income: 156000, expenses: 8500 },
    { name: "Thu", income: 112000, expenses: 50000 },
    { name: "Fri", income: 189000, expenses: 45000 },
    { name: "Sat", income: 210000, expenses: 62000 },
    { name: "Sun", income: 145000, expenses: 35000 },
];

export const BRANCHES = ["All Branches", "Main Counter", "Negombo Warehouse", "Galle Branch"] as const;
export const TIMEFRAMES = ["Today", "This Week", "This Month"] as const;

export const EXPENSE_TYPES: ExpenseTypeOption[] = [
    { value: "INCOME", label: "Income" },
    { value: "PROFIT_WITHDRAWAL", label: "Profit Withdrawal (Cashout)" },
    { value: "SALARY", label: "Salary" },
    { value: "PETTY_CASH", label: "Petty Cash" },
    { value: "BILL_PAYMENT", label: "Bill Payment" },
];