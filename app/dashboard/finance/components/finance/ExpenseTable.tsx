import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ExpenseRecord } from "../../types/finance";
import { EXPENSE_TYPES } from "../../constants/finance";
import { formatCurrency, getTypeColor } from "../../utils/finance";

interface Props {
    expenses: ExpenseRecord[];
}

export const ExpenseTable: React.FC<Props> = ({ expenses }) => {
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
                    {expenses.map((expense) => (
                        <TableRow
                            key={expense.id}
                            className={`border-b border-border hover:bg-secondary/30 transition-colors ${expense.type === "PROFIT_WITHDRAWAL"
                                ? "bg-orange-50/50 dark:bg-orange-950/10"
                                : ""
                                }`}
                        >
                            <TableCell className="text-sm font-mono text-muted-foreground">
                                {expense.date} {expense.time}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{expense.branch}</TableCell>
                            <TableCell className="text-sm text-foreground">{expense.authorizedUser}</TableCell>
                            <TableCell className="text-sm">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getTypeColor(expense.type)}`}>
                                    {EXPENSE_TYPES.find((t) => t.value === expense.type)?.label}
                                </span>
                            </TableCell>
                            <TableCell className="text-sm text-foreground truncate max-w-xs">
                                {expense.description}
                            </TableCell>
                            <TableCell
                                className={`text-right text-sm font-bold ${expense.type === "INCOME"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                    }`}
                            >
                                {expense.type === "INCOME" ? "+" : "-"}{formatCurrency(expense.amount)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};