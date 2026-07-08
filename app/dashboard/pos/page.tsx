"use client"

import React from "react"
import { Card } from "@/components/ui/card"

export default function POSPage() {
    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Point of Sale</h1>
                <p className="mt-1 text-muted-foreground">
                    Manage transactions and process sales
                </p>
            </div>

            <Card className="border-border bg-card p-6">
                <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border">
                    <p className="text-center text-muted-foreground">
                        <span className="block text-lg font-semibold text-foreground">
                            Point of Sale Interface
                        </span>
                        <span className="block text-sm">Coming Soon</span>
                    </p>
                </div>
            </Card>
        </div>
    )
}
