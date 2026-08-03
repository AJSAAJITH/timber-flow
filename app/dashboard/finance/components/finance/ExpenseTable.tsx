"use client";

import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ExpenseType } from "../../types/finance";
import { EXPENSE_TYPES } from "../../constants/finance";
import { formatCurrency, getTypeColor } from "../../utils/finance";

export interface FormattedExpenseRecord {
    id: string;
    date: string;
    time: string;
    branch: string;
    authorizedUser: string;
    type: ExpenseType | "INCOME";
    description: string;
    amount: number;
}

interface Props {
    expenses: FormattedExpenseRecord[];
    isLoading?: boolean;
}

export const ExpenseTable: React.FC<Props> = ({ expenses, isLoading = false }) => {
    // Helper function to get badge styling safely for INCOME as well
    const getBadgeStyle = (type: ExpenseType | "INCOME") => {
        if (type === "INCOME") {
            return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
        }
        return getTypeColor(type);
    };

    // Helper function to get readable type label
    const getTypeLabel = (type: ExpenseType | "INCOME") => {
        if (type === "INCOME") return "Income / Sales";
        return EXPENSE_TYPES.find((t) => t.value === type)?.label || type;
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-border bg-secondary/50">
                        <TableHead className="h-12">Date & Time</TableHead>
                        <TableHead className="h-12">Branch</TableHead>
                        <TableHead className="h-12">Authorized User</TableHead>
                        <TableHead className="h-12">Type</TableHead>
                        <TableHead className="h-12">Description</TableHead>
                        <TableHead className="h-12 text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                Loading financial logs...
                            </TableCell>
                        </TableRow>
                    ) : expenses.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No expense or income logs found for this period.
                            </TableCell>
                        </TableRow>
                    ) : (
                        expenses.map((record) => {
                            const isIncome = record.type === "INCOME";
                            const isProfitWithdrawal = record.type === "PROFIT_WITHDRAWAL";

                            return (
                                <TableRow
                                    key={record.id}
                                    className={`border-b border-border hover:bg-secondary/30 transition-colors ${isProfitWithdrawal
                                        ? "bg-orange-50/50 dark:bg-orange-950/10"
                                        : isIncome
                                            ? "bg-emerald-50/30 dark:bg-emerald-950/10"
                                            : ""
                                        }`}
                                >
                                    <TableCell className="text-xs sm:text-sm font-mono text-muted-foreground whitespace-nowrap">
                                        {record.date} <span className="text-xs opacity-75">{record.time}</span>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{record.branch}</TableCell>
                                    <TableCell className="text-sm font-medium text-foreground">{record.authorizedUser}</TableCell>
                                    <TableCell className="text-sm">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBadgeStyle(record.type)}`}>
                                            {getTypeLabel(record.type)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-foreground truncate max-w-xs">
                                        {record.description}
                                    </TableCell>
                                    <TableCell
                                        className={`text-right text-sm font-bold whitespace-nowrap ${isIncome
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-red-600 dark:text-red-400"
                                            }`}
                                    >
                                        {isIncome ? "+" : "-"}{formatCurrency(record.amount)}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
};