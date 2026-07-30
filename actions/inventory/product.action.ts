"use server";
import prisma from "@/lib/prisma"
import { ProductWithCategory } from "@/lib/types"
import { actionError, actionSuccess } from "@/lib/types/action-response"
import { ActionResult } from "@/lib/types/action-result"
import { ProductInput, productSchema } from "@/lib/validations/product"
import { revalidatePath } from "next/cache"

export async function getProducts(): Promise<ActionResult<ProductWithCategory[]>> {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        const formattedProducts: ProductWithCategory[] = products.map((p) => ({
            ...p,
            unitPrice: Number(p.unitPrice),
        }))

        return actionSuccess(formattedProducts)
    } catch (error) {
        console.error("Error fetching products:", error)
        return actionError("Failed to fetch products", "SERVER_ERROR")
    }
}

/**
 * 2. Create Product
 */
export async function createProduct(
    input: ProductInput
): Promise<ActionResult<ProductWithCategory>> {
    const validated = productSchema.safeParse(input)

    if (!validated.success) {
        return actionError(
            "Validation failed",
            "VALIDATION_ERROR",
            validated.error.flatten().fieldErrors
        )
    }

    const { name, sku, categoryId, unitPrice } = validated.data

    try {
        // Check if SKU already exists
        if (sku && sku.trim() !== "") {
            const existingSku = await prisma.product.findUnique({
                where: { sku: sku.trim() },
            })
            if (existingSku) {
                return actionError("SKU already exists", "VALIDATION_ERROR", {
                    sku: ["This SKU is already assigned to another product."],
                })
            }
        }

        const newProduct = await prisma.product.create({
            data: {
                name: name.trim(),
                sku: sku && sku.trim() !== "" ? sku.trim() : null,
                categoryId,
                unitPrice,
            },
            include: {
                category: {
                    select: { id: true, name: true },
                },
            },
        })

        revalidatePath("/dashboard/inventory")

        return actionSuccess(
            {
                ...newProduct,
                unitPrice: Number(newProduct.unitPrice),
            },
            "Product created successfully"
        )
    } catch (error) {
        console.error("Error creating product:", error)
        return actionError("Failed to create product", "SERVER_ERROR")
    }
}

/**
 * 3. Update Product
 */
export async function updateProduct(
    id: string,
    input: ProductInput
): Promise<ActionResult<ProductWithCategory>> {
    const validated = productSchema.safeParse(input)

    if (!validated.success) {
        return actionError(
            "Validation failed",
            "VALIDATION_ERROR",
            validated.error.flatten().fieldErrors
        )
    }

    const { name, sku, categoryId, unitPrice } = validated.data

    try {
        // Check SKU duplicate (excluding current product)
        if (sku && sku.trim() !== "") {
            const existingSku = await prisma.product.findFirst({
                where: {
                    sku: sku.trim(),
                    NOT: { id },
                },
            })
            if (existingSku) {
                return actionError("SKU already exists", "VALIDATION_ERROR", {
                    sku: ["This SKU is already assigned to another product."],
                })
            }
        }

        const updated = await prisma.product.update({
            where: { id },
            data: {
                name: name.trim(),
                sku: sku && sku.trim() !== "" ? sku.trim() : null,
                categoryId,
                unitPrice,
            },
            include: {
                category: { select: { id: true, name: true } },
            },
        })

        revalidatePath("/dashboard/inventory")

        return actionSuccess(
            {
                ...updated,
                unitPrice: Number(updated.unitPrice),
            },
            "Product updated successfully"
        )
    } catch (error) {
        console.error("Error updating product:", error)
        return actionError("Failed to update product", "SERVER_ERROR")
    }
}

/**
 * 4. Delete Product
 */
export async function deleteProduct(id: string): Promise<ActionResult<void>> {
    try {
        await prisma.product.delete({
            where: { id },
        })

        revalidatePath("/dashboard/inventory")
        return actionSuccess(undefined, "Product deleted successfully")
    } catch (error) {
        console.error("Error deleting product:", error)
        return actionError(
            "Cannot delete product. It may be linked to stock or sales logs.",
            "SERVER_ERROR"
        )
    }
}