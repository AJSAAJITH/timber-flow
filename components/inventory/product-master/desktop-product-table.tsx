"use client"

import React, { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit2, MoreVertical, Trash2 } from "lucide-react"
import { ProductWithCategory } from "@/lib/types"

interface DesktopProductTableProps {
    products: ProductWithCategory[]
    onEdit: (product: ProductWithCategory) => void
    onDelete: (product: ProductWithCategory) => void
}

export function DesktopProductTable({ products, onEdit, onDelete }: DesktopProductTableProps) {
    const [openPopoverId, setOpenPopoverId] = useState<string | null>(null)

    return (
        <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-border bg-secondary/50">
                        <TableHead className="h-12">Product Name</TableHead>
                        <TableHead className="h-12">SKU</TableHead>
                        <TableHead className="h-12">Category</TableHead>
                        <TableHead className="h-12 text-right">Unit Price (LKR)</TableHead>
                        <TableHead className="h-12 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id} className="border-b border-border hover:bg-secondary/30">
                            <TableCell className="font-medium text-foreground">
                                {product.name}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                                {product.sku || "-"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {product.category.name}
                            </TableCell>
                            <TableCell className="text-right font-bold text-primary">
                                LKR {product.unitPrice.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <Popover
                                    open={openPopoverId === product.id}
                                    onOpenChange={(open) => setOpenPopoverId(open ? product.id : null)}
                                >
                                    <PopoverTrigger asChild>
                                        <button className="min-h-[36px] min-w-[36px] flex items-center justify-center hover:bg-secondary rounded transition-colors">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent align="end" className="w-48 p-0">
                                        <div className="flex flex-col">
                                            <button
                                                onClick={() => {
                                                    setOpenPopoverId(null)
                                                    onEdit(product)
                                                }}
                                                className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                                Edit Product
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setOpenPopoverId(null)
                                                    onDelete(product)
                                                }}
                                                className="px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors border-t border-border"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}