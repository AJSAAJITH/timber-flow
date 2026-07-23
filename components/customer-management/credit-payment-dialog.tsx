"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function CreditPaymentDialog({ open, onOpenChange, customer, onConfirm }: any) {
    const [creditPayment, setCreditPayment] = useState("")

    const handleRecordPayment = () => {
        onConfirm(parseFloat(creditPayment));
        onOpenChange(false);
        setCreditPayment(""); // reset කිරීම
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Record Credit Payment</DialogTitle>
                    <DialogDescription>
                        Record a payment for {customer?.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Current Due Amount - Amber theme */}
                    <div className="rounded-lg border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20 p-4">
                        <p className="text-sm text-muted-foreground">Current Due Amount</p>
                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">
                            LKR {customer?.totalDue.toLocaleString()}
                        </p>
                    </div>

                    {/* Payment Input */}
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Payment Amount (LKR) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter payment amount"
                            value={creditPayment}
                            onChange={(e) => setCreditPayment(e.target.value)}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRecordPayment}
                        disabled={!creditPayment || parseFloat(creditPayment) <= 0}
                    >
                        Record Payment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}