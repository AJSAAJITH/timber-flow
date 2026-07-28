"use client"

import { useState, useEffect } from "react"
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
import { CustomerFormValues, customerSchema } from "@/lib/validations/customer"

interface EditCustomerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    customer: any
    onUpdate: (id: string, data: CustomerFormValues) => Promise<boolean>
}

export function EditCustomerDialog({ open, onOpenChange, customer, onUpdate }: EditCustomerDialogProps) {
    const [formData, setFormData] = useState<CustomerFormValues>({
        name: "",
        phone: "",
        nic: "",
        address: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name || "",
                phone: customer.phone || "",
                nic: customer.nic || "",
                address: customer.address || "",
            })
            setErrors({})
        }
    }, [customer])

    const handleSave = async () => {
        setErrors({})
        const validation = customerSchema.safeParse(formData)

        if (!validation.success) {
            const fieldErrors: Record<string, string> = {}
            validation.error.issues.forEach((issue) => {
                if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message
            })
            setErrors(fieldErrors)
            return
        }

        setIsSubmitting(true)
        const success = await onUpdate(customer.id, formData)
        setIsSubmitting(false)

        if (success) {
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Customer Profile</DialogTitle>
                    <DialogDescription>
                        Update profile details for {customer?.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-sm font-medium text-foreground">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    {/* NIC */}
                    <div>
                        <label className="text-sm font-medium text-foreground">NIC Number</label>
                        <input
                            type="text"
                            value={formData.nic}
                            onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {errors.nic && <p className="text-xs text-red-500 mt-1">{errors.nic}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="text-sm font-medium text-foreground">Address</label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary min-h-20 resize-none"
                        />
                        {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}