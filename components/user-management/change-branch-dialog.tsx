"use client"

import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ChangeBranchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: any
    branches: { id: string; name: string }[]
    onChangeBranch: (userId: string, branchId: string) => Promise<void>
}

export function ChangeBranchDialog({
    open,
    onOpenChange,
    user,
    branches = [],
    onChangeBranch
}: ChangeBranchDialogProps) {
    const [selectedBranchId, setSelectedBranchId] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user && branches.length > 0) {
            const currentBranch = branches.find(b => b.name === user.branch)
            if (currentBranch) setSelectedBranchId(currentBranch.id)
            else setSelectedBranchId(branches[0]?.id || "")
        }
    }, [user, branches])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await onChangeBranch(user.id, selectedBranchId)
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Change Branch for {user?.name}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground">Select New Branch</label>
                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Branch"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}