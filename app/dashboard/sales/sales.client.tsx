"use client"

import React from "react"
import SalesRecordsContainer from "./components/sales/SalesRecordsContainer"


export default function SalesHistoryClientPage() {
    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Page Title & Header Section */}
            <div className="flex flex-col gap-1 px-4 sm:px-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Sales History
                </h1>
                <p className="text-sm text-muted-foreground">
                    View, search, and manage all past sales invoices and payment records.
                </p>
            </div>

            {/* Main Orchestrator Component */}
            <main>
                <SalesRecordsContainer />
            </main>
        </div>
    )
}