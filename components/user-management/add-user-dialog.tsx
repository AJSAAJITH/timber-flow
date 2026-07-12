"use client"

import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MOCK_BRANCHES } from "@/lib/constants" // Branch ලැයිස්තුව ලබාගැනීමට

interface AddUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddUser: (user: any) => void
}

export function AddUserDialog({ open, onOpenChange, onAddUser }: AddUserDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "CASHIER",
        branch: "Main Branch"
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAddUser(formData)
        onOpenChange(false)
        // පෝරමය හිස් කිරීමට (Optional)
        setFormData({ name: "", email: "", role: "CASHIER", branch: "Main Branch" })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Create a new user account with the required information
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Select Role <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="CASHIER">Cashier</option>
                        </select>
                    </div>

                    {/* Branch */}
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Assign Branch <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.branch}
                            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            {MOCK_BRANCHES.map((branch) => (
                                <option key={branch} value={branch}>{branch}</option>
                            ))}
                        </select>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Create User</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}