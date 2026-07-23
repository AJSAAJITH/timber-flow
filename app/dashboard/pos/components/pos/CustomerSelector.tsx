// components/pos/CustomerSelector.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Customer } from "../../types/pos.types"

interface CustomerSelectorProps {
    isWalkIn: boolean
    selectedCustomerId: string | null
    customers: Customer[]
    onToggleWalkIn: (isWalkIn: boolean) => void
    onSelectCustomer: (customerId: string | null) => void
    onNewCustomer: () => void
}

export function CustomerSelector({
    isWalkIn,
    selectedCustomerId,
    customers,
    onToggleWalkIn,
    onSelectCustomer,
    onNewCustomer,
}: CustomerSelectorProps) {
    return (
        <div className="border-b border-border p-4">
            <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input
                    type="checkbox"
                    checked={isWalkIn}
                    onChange={(e) => onToggleWalkIn(e.target.checked)}
                    className="h-4 w-4 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-foreground">
                    Walk-In Customer (Anonymous)
                </span>
            </label>

            {!isWalkIn && (
                <div className="flex gap-2">
                    <select
                        value={selectedCustomerId || ""}
                        onChange={(e) => onSelectCustomer(e.target.value || null)}
                        className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Select Customer...</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name} ({c.phone})
                            </option>
                        ))}
                    </select>
                    <Button size="sm" onClick={onNewCustomer} className="px-3">
                        + New
                    </Button>
                </div>
            )}
        </div>
    )
}