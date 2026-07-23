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

export function AddCustomerDialog({ open, onOpenChange, onAdd }: any) {
    // initial state එක නිර්මාණය කිරීම
    const initialState = { name: "", phone: "", nic: "", address: "" };
    const [formData, setFormData] = useState(initialState);

    // Save බොත්තම එබූ විට ක්‍රියාත්මක වන Handler එක
    const handleSave = () => {
        onAdd(formData);      // Parent component එකට දත්ත යැවීම
        onOpenChange(false);  // Dialog එක වසා දැමීම
        setFormData(initialState); // Form එක reset කිරීම
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Register New Customer</DialogTitle>
                    <DialogDescription>
                        Add a new customer to your system
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
                            placeholder="Enter customer name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="e.g., +94 777 123456"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* NIC Number */}
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            NIC Number
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., 123456789V"
                            value={formData.nic}
                            onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Billing/Delivery Address
                        </label>
                        <textarea
                            placeholder="Enter customer address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary min-h-24 resize-none"
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
                    <Button onClick={handleSave}>Register Customer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}