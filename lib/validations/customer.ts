import { z } from "zod"

// Phone and NIC validation logic
export const customerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z
        .string()
        .optional()
        .refine((val) => !val || /^[0-9+ -]{9,15}$/.test(val), {
            message: "Invalid phone number format",
        }),
    nic: z
        .string()
        .optional()
        .refine((val) => !val || /^[0-9]{9}[vVxX]$|^[0-9]{12}$/.test(val), {
            message: "Invalid NIC number format (Old or New NIC required)",
        }),
    address: z.string().optional(),
})

export const paymentSchema = z.object({
    customerId: z.string().min(1, "Customer is required"),
    amountPaid: z
        .number({ message: "Amount must be a number" })
        .positive("Payment amount must be greater than 0"),
    note: z.string().optional(),
})

export type CustomerFormValues = z.infer<typeof customerSchema>
export type PaymentFormValues = z.infer<typeof paymentSchema>