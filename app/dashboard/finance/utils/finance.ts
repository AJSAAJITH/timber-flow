import { ExpenseType } from "../types/finance";


export const formatCurrency = (amount: number): string =>
    `LKR ${amount.toLocaleString()}`;

export const getTypeColor = (type: ExpenseType | string): string => {
    switch (type) {
        case "INCOME":
            return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
        case "PROFIT_WITHDRAWAL":
            return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
        case "SALARY":
            return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300";
        case "PETTY_CASH":
            return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
        case "BILL_PAYMENT":
            return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300";
        default:
            return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
    }
};