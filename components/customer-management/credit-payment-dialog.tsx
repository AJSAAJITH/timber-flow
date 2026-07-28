"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function CreditPaymentDialog({ open, onOpenChange, customer, onConfirm }: any) {
    const [creditPayment, setCreditPayment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleRecordPayment = async () => {
        const amount = parseFloat(creditPayment)
        if (isNaN(amount) || amount <= 0) {
            setError("Please enter a valid amount")
            return
        }

        if (amount > Number(customer?.totalDue)) {
            setError("Payment amount cannot exceed the total due")
            return
        }

        setError("")
        setIsSubmitting(true)
        const success = await onConfirm(amount)
        setIsSubmitting(false)

        if (success) {
            onOpenChange(false)
            setCreditPayment("")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Record Credit Payment</DialogTitle>
                    <DialogDescription>Record a payment for {customer?.name}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="rounded-lg border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20 p-4">
                        <p className="text-sm text-muted-foreground">Current Due Amount</p>
                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">
                            LKR {Number(customer?.totalDue || 0).toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Payment Amount (LKR) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter payment amount"
                            value={creditPayment}
                            onChange={(e) => {
                                setCreditPayment(e.target.value)
                                setError("")
                            }}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleRecordPayment} disabled={isSubmitting || !creditPayment}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Record Payment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}