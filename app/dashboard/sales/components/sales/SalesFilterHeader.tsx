"use client"

import React from "react"
import { Search } from "lucide-react"
import { PAYMENT_STATUSES } from "../../utils/sales-helpers"


interface SalesFilterHeaderProps {
    selectedStatus: string
    onStatusChange: (status: string) => void
    searchQuery: string
    onSearchChange: (query: string) => void
}

export const SalesFilterHeader: React.FC<SalesFilterHeaderProps> = ({
    selectedStatus,
    onStatusChange,
    searchQuery,
    onSearchChange,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Payment Status Filter */}
            <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">
                    Payment Status
                </label>
                <select
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    {PAYMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                            {status === "ALL" ? "All Statuses" : status.replace("_", " ")}
                        </option>
                    ))}
                </select>
            </div>

            {/* Search Input */}
            <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">
                    Search
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by invoice number or customer name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>
        </div>
    )
}