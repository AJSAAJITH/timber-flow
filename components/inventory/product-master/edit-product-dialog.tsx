"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Category } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { ProductWithCategory } from "@/lib/types"
import { ProductInput, productSchema } from "@/lib/validations/product"

interface EditProductDialogProps {
    product: ProductWithCategory | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    categories: Category[]
    onSubmit: (id: string, data: ProductInput) => Promise<boolean>
}

export function EditProductDialog({
    product,
    isOpen,
    onOpenChange,
    categories,
    onSubmit,
}: EditProductDialogProps) {
    const [formData, setFormData] = useState<ProductInput>({
        name: "",
        sku: "",
        categoryId: "",
        unitPrice: 0,
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                sku: product.sku || "",
                categoryId: product.categoryId,
                unitPrice: product.unitPrice,
            })
            setErrors({})
        }
    }, [product])

    const handleSubmit = async () => {
        if (!product) return
        setErrors({})

        const result = productSchema.safeParse(formData)
        if (!result.success) {
            const fieldErrors: Record<string, string> = {}
            result.error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    fieldErrors[issue.path[0].toString()] = issue.message
                }
            })
            setErrors(fieldErrors)
            return
        }

        setLoading(true)
        const success = await onSubmit(product.id, formData)
        setLoading(false)

        if (success) {
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>Update details for {product?.name}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">SKU (Optional)</label>
                        <input
                            type="text"
                            value={formData.sku || ""}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">Category</label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && (
                            <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Unit Price (LKR) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={formData.unitPrice}
                            onChange={(e) =>
                                setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {errors.unitPrice && (
                            <p className="text-xs text-red-500 mt-1">{errors.unitPrice}</p>
                        )}
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}