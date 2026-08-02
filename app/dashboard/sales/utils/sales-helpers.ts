// utils/sales-helpers.ts

import { CheckoutMethod, PaymentStatus } from "../types/sales.types";

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        minimumFractionDigits: 2,
    }).format(amount).replace("LKR", "Rs.");
};

export const getPaymentMethodColor = (method: CheckoutMethod): string => {
    switch (method) {
        case "CASH":
            return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
        case "CREDIT":
            return "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
        case "BANK_TRANSFER":
            return "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
    switch (status) {
        case "PAID":
            return "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400 border border-green-200 dark:border-green-800";
        case "PENDING":
            return "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-800";
        case "PARTIALLY_PAID":
            return "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-400 border border-orange-200 dark:border-orange-800";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
};

export const formatSaleDateTime = (dateObj: Date) => {
    const date = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(dateObj);

    const time = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    }).format(dateObj);

    return {
        date,
        time,
        timestamp: `${date} at ${time}`,
    };
};