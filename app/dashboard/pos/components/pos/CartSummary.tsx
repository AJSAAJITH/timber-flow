// components/pos/CartSummary.tsx
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface CartSummaryProps {
    calculations: {
        subtotal: number
        finalTotal: number
        totalDiscount: number
        count: number
    }
    selectedPayment: string
    paymentMethods: string[]
    isWalkIn: boolean
    canCheckout: boolean
    onSelectPayment: (payment: string) => void
    onCheckout: () => void
}

export function CartSummary({
    calculations,
    selectedPayment,
    paymentMethods,
    isWalkIn,
    canCheckout,
    onSelectPayment,
    onCheckout,
}: CartSummaryProps) {
    return (
        <div className="border-t border-border bg-card/80 backdrop-blur p-4 space-y-4">
            {/* Price Calculations */}
            <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>LKR {calculations.subtotal.toLocaleString()}</span>
                </div>
                {calculations.totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                        <span>Discount:</span>
                        <span>-LKR {calculations.totalDiscount.toLocaleString()}</span>
                    </div>
                )}
                <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                    <span>Total:</span>
                    <span className="text-primary text-lg">LKR {calculations.finalTotal.toLocaleString()}</span>
                </div>
            </div>

            {/* Payment Methods */}
            <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">Payment Method</label>
                <div className="grid gap-2 grid-cols-3">
                    {paymentMethods.map((method) => (
                        <button
                            key={method}
                            onClick={() => onSelectPayment(method)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all min-h-[40px] ${selectedPayment === method
                                    ? "bg-primary text-primary-foreground ring-1 ring-primary"
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                }`}
                        >
                            {method}
                        </button>
                    ))}
                </div>
            </div>

            {/* Credit Warning */}
            {selectedPayment === "Credit" && isWalkIn && (
                <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 p-2.5 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-700 dark:text-amber-300 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                        Credit requires a registered customer.
                    </p>
                </div>
            )}

            {/* Checkout Button */}
            <Button
                onClick={onCheckout}
                disabled={!canCheckout}
                className="w-full h-11 text-base font-semibold bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
                Checkout Order
            </Button>
        </div>
    )
}