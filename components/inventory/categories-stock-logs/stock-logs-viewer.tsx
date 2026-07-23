"use client"

import React, { useState, useMemo } from "react"
import { Search, ArrowUpRight, ArrowDownLeft, Minus, AlertCircle } from "lucide-react"
import { StockLog } from "@/lib/types"

interface StockLogsViewerProps {
    logs: StockLog[]
}

export function StockLogsViewer({ logs }: StockLogsViewerProps) {
    const [searchQueryLogs, setSearchQueryLogs] = useState("")

    const filteredLogs = useMemo(() => {
        return logs.filter((log) =>
            log.product.toLowerCase().includes(searchQueryLogs.toLowerCase())
        )
    }, [searchQueryLogs, logs])

    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs font-semibold text-muted-foreground">Search Logs</label>
                <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by product..."
                        value={searchQueryLogs}
                        onChange={(e) => setSearchQueryLogs(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredLogs.map((log) => (
                    <div key={log.id} className="rounded-lg border border-border bg-card p-3">
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate">{log.product}</p>
                                <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                            </div>
                            <span
                                className={`inline-block px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${log.logType === "STOCK_IN"
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                        : log.logType === "STOCK_OUT" || log.logType === "DAMAGE"
                                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                    }`}
                            >
                                {log.logType === "STOCK_IN" && (
                                    <>
                                        <ArrowUpRight className="h-3 w-3 inline mr-1" />
                                        STOCK IN
                                    </>
                                )}
                                {log.logType === "STOCK_OUT" && (
                                    <>
                                        <ArrowDownLeft className="h-3 w-3 inline mr-1" />
                                        STOCK OUT
                                    </>
                                )}
                                {log.logType === "ADJUSTMENT" && (
                                    <>
                                        <Minus className="h-3 w-3 inline mr-1" />
                                        ADJUSTMENT
                                    </>
                                )}
                                {log.logType === "DAMAGE" && (
                                    <>
                                        <AlertCircle className="h-3 w-3 inline mr-1" />
                                        DAMAGE
                                    </>
                                )}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                            <div>
                                <p className="text-muted-foreground">Branch</p>
                                <p className="font-medium text-foreground">{log.branch}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Quantity</p>
                                <p
                                    className={`font-bold ${log.quantity > 0
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-red-600 dark:text-red-400"
                                        }`}
                                >
                                    {log.quantity > 0 ? "+" : ""}{log.quantity}
                                </p>
                            </div>
                        </div>

                        {log.note && (
                            <p className="text-xs text-muted-foreground italic">"{log.note}"</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}