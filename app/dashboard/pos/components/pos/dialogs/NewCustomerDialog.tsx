"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface NewCustomerDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    customerData: { name: string; phone: string }
    onCustomerDataChange: (data: { name: string; phone: string }) => void
    onSubmit: () => Promise<void> | void
}

export function NewCustomerDialog({
    isOpen,
    onOpenChange,
    customerData,
    onCustomerDataChange,
    onSubmit,
}: NewCustomerDialogProps) {
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async () => {
        setIsSaving(true)
        try {
            await onSubmit()
        } finally {
            setIsSaving(false)
        }
    }

    const isFormValid = customerData.name.trim() !== "" && customerData.phone.trim() !== ""

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Register Customer</DialogTitle>
                    <DialogDescription>Add a new customer quickly</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Customer Name"
                        value={customerData.name}
                        onChange={(e) =>
                            onCustomerDataChange({ ...customerData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={customerData.phone}
                        onChange={(e) =>
                            onCustomerDataChange({ ...customerData, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid || isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Add Customer"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}