"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import InventoryClientPage from "./inventory.client"

export default function InventoryPage() {
    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
            <InventoryClientPage />
        </div>
    )
}
