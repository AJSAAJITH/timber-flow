"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export function DeleteUserDialog({ open, onOpenChange, user, onConfirm }: any) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        Delete User
                    </DialogTitle>
                </DialogHeader>

                <p className="text-muted-foreground">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-foreground">
                        {user?.name}
                    </span>
                    ? This action cannot be undone.
                </p>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                    >
                        Delete User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}