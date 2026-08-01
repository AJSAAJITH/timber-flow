// lib/validations/pos.ts
import { z } from "zod"

export const createCustomerSchema = z.object({
    name: z.string().min(2, "නම අවම වශයෙන් අකුරු 2ක් විය යුතුය"),
    phone: z.string().min(9, "වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න"),
})

export const checkoutItemSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    name: z.string(),
    sku: z.string(),
    basePrice: z.number().nonnegative(),
    finalPrice: z.number().nonnegative(),
    quantity: z.number().int().positive("ප්‍රමාණය 1ක් හෝ ඊට වැඩි විය යුතුය"),
    isDiscounted: z.boolean(),
})

export const checkoutSchema = z
    .object({
        customerId: z.string().nullable().optional(),
        isWalkIn: z.boolean(),
        paymentMethod: z.enum(["Cash", "Card", "Credit"]),
        items: z
            .array(checkoutItemSchema)
            .min(1, "කාර්ට් එකට අවම වශයෙන් එක් භාණ්ඩයක්වත් එකතු කරන්න"),
    })
    .refine(
        (data) => {
            // Walk-in පාරිභෝගිකයෙකුට Credit ගෙවීම් ලබාදිය නොහැක
            if (data.paymentMethod === "Credit" && data.isWalkIn) {
                return false
            }
            return true
        },
        {
            message: "ණය (Credit) ගෙවීම් සඳහා ලියාපදිංචි පාරිභෝගිකයෙකු තෝරාගත යුතුය",
            path: ["paymentMethod"],
        }
    )

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>