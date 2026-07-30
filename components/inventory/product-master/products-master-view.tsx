"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Category } from "@prisma/client"
import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from "@/actions/inventory/product.action"
import { ProductSearchHeader } from "./product-search-header"
import { MobileProductList } from "./mobile-product-list"
import { DesktopProductTable } from "./desktop-product-table"
import { CreateProductDialog } from "./create-product-dialog"
import { EditProductDialog } from "./edit-product-dialog"
import { DeleteProductDialog } from "./delete-product-dialog"
import { Loader2 } from "lucide-react"
import { ProductWithCategory } from "@/lib/types"
import { ProductInput } from "@/lib/validations/product"

interface ProductMasterViewProps {
    categories: Category[]
}

export default function ProductMasterView({ categories }: ProductMasterViewProps) {
    const [searchQueryProduct, setSearchQueryProduct] = useState("")
    const [products, setProducts] = useState<ProductWithCategory[]>([])
    const [loading, setLoading] = useState(true)

    // Dialog States
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null)
    const [deletingProduct, setDeletingProduct] = useState<ProductWithCategory | null>(null)

    // Load Initial Products from DB
    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const res = await getProducts()
            if (res.success) {
                setProducts(res.data)
            }
            setLoading(false)
        }
        loadData()
    }, [])

    // Search Filter
    const filteredProducts = useMemo(() => {
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(searchQueryProduct.toLowerCase()) ||
                (p.sku && p.sku.toLowerCase().includes(searchQueryProduct.toLowerCase()))
        )
    }, [searchQueryProduct, products])

    // Handle Create Action
    const handleCreateProduct = async (data: ProductInput): Promise<boolean> => {
        const res = await createProduct(data)
        if (res.success) {
            setProducts((prev) => [res.data, ...prev])
            return true
        } else {
            alert(res.error || "Failed to create product")
            return false
        }
    }

    // Handle Edit Action
    const handleUpdateProduct = async (id: string, data: ProductInput): Promise<boolean> => {
        const res = await updateProduct(id, data)
        if (res.success) {
            setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p)))
            setEditingProduct(null)
            return true
        } else {
            alert(res.error || "Failed to update product")
            return false
        }
    }

    // Handle Delete Action
    const handleDeleteProduct = async (id: string): Promise<boolean> => {
        const res = await deleteProduct(id)
        if (res.success) {
            setProducts((prev) => prev.filter((p) => p.id !== id))
            setDeletingProduct(null)
            return true
        } else {
            alert(res.error || "Failed to delete product")
            return false
        }
    }

    return (
        <div className="space-y-6">
            <ProductSearchHeader
                searchQuery={searchQueryProduct}
                onSearchChange={setSearchQueryProduct}
                onCreateClick={() => setIsCreateOpen(true)}
            />

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <>
                    <MobileProductList
                        products={filteredProducts}
                        onEdit={(product) => setEditingProduct(product)}
                        onDelete={(product) => setDeletingProduct(product)}
                    />

                    <DesktopProductTable
                        products={filteredProducts}
                        onEdit={(product) => setEditingProduct(product)}
                        onDelete={(product) => setDeletingProduct(product)}
                    />
                </>
            )}

            {/* Create Dialog */}
            <CreateProductDialog
                isOpen={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                categories={categories}
                onSubmit={handleCreateProduct}
            />

            {/* Edit Dialog */}
            <EditProductDialog
                product={editingProduct}
                isOpen={!!editingProduct}
                onOpenChange={(open) => !open && setEditingProduct(null)}
                categories={categories}
                onSubmit={handleUpdateProduct}
            />

            {/* Delete Dialog */}
            <DeleteProductDialog
                product={deletingProduct}
                isOpen={!!deletingProduct}
                onOpenChange={(open) => !open && setDeletingProduct(null)}
                onConfirm={handleDeleteProduct}
            />
        </div>
    )
}