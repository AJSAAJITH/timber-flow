"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { AlertCircle, Loader2 } from "lucide-react"

interface CheckoutConfirmationDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    calculations: {
        subtotal: number
        finalTotal: number
        totalDiscount: number
    }
    selectedPayment: string
    isWalkIn: boolean
    canCheckout: boolean
    onConfirmCheckout: () => Promise<void> | void
}

export function CheckoutConfirmationDialog({
    isOpen,
    onOpenChange,
    calculations,
    selectedPayment,
    isWalkIn,
    canCheckout,
    onConfirmCheckout,
}: CheckoutConfirmationDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleConfirm = async () => {
        setIsSubmitting(true)
        try {
            await onConfirmCheckout()
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Review Order</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>LKR {calculations.subtotal.toLocaleString()}</span>
                        </div>
                        {calculations.totalDiscount > 0 && (
                            <div className="flex justify-between text-green-600 dark:text-green-400">
                                <span>Total Discount:</span>
                                <span>-LKR {calculations.totalDiscount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                            <span>Total:</span>
                            <span>LKR {calculations.finalTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    {selectedPayment === "Credit" && isWalkIn && (
                        <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 p-3 flex gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                Registered Customer is required for Credit transactions.
                            </p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Continue Shopping
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!canCheckout || isSubmitting}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Place Order & Print Invoice"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}