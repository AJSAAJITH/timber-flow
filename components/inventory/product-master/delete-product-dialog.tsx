"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Loader2 } from "lucide-react"
import { ProductWithCategory } from "@/lib/types"

interface DeleteProductDialogProps {
    product: ProductWithCategory | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (id: string) => Promise<boolean>
}

export function DeleteProductDialog({
    product,
    isOpen,
    onOpenChange,
    onConfirm,
}: DeleteProductDialogProps) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!product) return
        setLoading(true)
        const success = await onConfirm(product.id)
        setLoading(false)
        if (success) {
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Product</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <strong className="text-foreground">{product?.name}</strong>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4 gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete Product
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}