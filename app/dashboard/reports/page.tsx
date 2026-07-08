"use client"

import React from "react"
import { Card } from "@/components/ui/card"

export default function ReportsPage() {
    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Reports</h1>
                <p className="mt-1 text-muted-foreground">
                    Generate and view business reports
                </p>
            </div>

            <Card className="border-border bg-card p-6">
                <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border">
                    <p className="text-center text-muted-foreground">
                        <span className="block text-lg font-semibold text-foreground">
                            Reports & Analytics
                        </span>
                        <span className="block text-sm">Coming Soon</span>
                    </p>
                </div>
            </Card>
        </div>
    )
}
