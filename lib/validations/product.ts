import z from "zod"

// Zod Validation Schema
export const productSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    sku: z.string().optional().or(z.literal("")),
    categoryId: z.string().min(1, "Please select a category"),
    unitPrice: z.coerce.number().min(0, "Unit price must be 0 or greater"),
})

export type ProductInput = z.infer<typeof productSchema>