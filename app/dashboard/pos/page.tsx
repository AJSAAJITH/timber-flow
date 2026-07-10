"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import POSClientPage from "./pos.client"

export default function POSPage() {
    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
            <POSClientPage />
        </div>
    )
}
