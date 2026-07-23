"use client"

import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MoreVertical, Edit2, History, DollarSign, Trash2, AlertCircle } from "lucide-react"

export function CustomerTable({ customers, onDelete, onPayment }: any) {
    return (
        <div className="space-y-4">
            {/* Table View */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-border bg-secondary/50">
                            <TableHead className="h-12">Name</TableHead>
                            <TableHead className="h-12">Phone</TableHead>
                            <TableHead className="h-12">NIC</TableHead>
                            <TableHead className="h-12">Address</TableHead>
                            <TableHead className="h-12 text-right">Total Due</TableHead>
                            <TableHead className="h-12 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.map((customer: any) => (
                            <TableRow
                                key={customer.id}
                                className="border-b border-border hover:bg-secondary/30 transition-colors"
                            >
                                <TableCell className="py-3 font-medium text-foreground">{customer.name}</TableCell>
                                <TableCell className="py-3 text-sm font-mono text-muted-foreground">{customer.phone}</TableCell>
                                <TableCell className="py-3 text-sm text-muted-foreground">{customer.nic || "-"}</TableCell>
                                <TableCell className="py-3 text-sm text-muted-foreground max-w-xs truncate">{customer.address || "-"}</TableCell>
                                <TableCell className={`py-3 text-right font-bold ${customer.totalDue > 0 ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"}`}>
                                    {customer.totalDue > 0 ? `LKR ${customer.totalDue.toLocaleString()}` : "Clear"}
                                </TableCell>
                                <TableCell className="py-3 text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="min-h-[36px] min-w-[36px] flex items-center justify-center hover:bg-secondary rounded transition-colors active:scale-95">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent align="end" className="w-48 p-0">
                                            <div className="flex flex-col">
                                                <button className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors">
                                                    <Edit2 className="h-4 w-4" /> Edit Profile
                                                </button>
                                                <button className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors">
                                                    <History className="h-4 w-4" /> Purchase History
                                                </button>
                                                <button
                                                    onClick={() => onPayment(customer)}
                                                    className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors"
                                                >
                                                    <DollarSign className="h-4 w-4" /> Record Payment
                                                </button>
                                                <button
                                                    onClick={() => onDelete(customer)}
                                                    className="px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors border-t border-border"
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete
                                                </button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Empty State */}
            {customers.length === 0 && (
                <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-12 text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No customers found matching your criteria</p>
                </div>
            )}
        </div>
    )
}