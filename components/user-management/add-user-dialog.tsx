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
import { Eye, EyeOff } from "lucide-react"
import { createUserSchema } from "@/lib/validations/user"

interface AddUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddUser: (user: any) => Promise<void> | void
}

export function AddUserDialog({
    open,
    onOpenChange,
    onAddUser
}: AddUserDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "CASHIER"
    })

    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        // Client-side Zod validation check
        const result = createUserSchema.safeParse(formData)
        if (!result.success) {
            const fieldErrors: Record<string, string> = {}
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as string] = err.message
                }
            })
            setErrors(fieldErrors)
            return
        }

        setLoading(true)
        await onAddUser(formData)
        setLoading(false)
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "CASHIER"
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Create a new user account with credentials for login
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
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
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
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Initial Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter initial password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
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
                            <option value="SUPER_ADMIN">Super Admin</option>
                            <option value="CASHIER">Cashier</option>
                        </select>
                        {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create User"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}