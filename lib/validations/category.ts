// lib/validations/category.ts
import { z } from "zod"

export const categorySchema = z.object({
    name: z
        .string()
        .min(1, "Category name එක ඇතුළත් කිරීම අනිවාර්යයි")
        .max(50, "Category name එක අකුරු 50 කට වඩා අඩු විය යුතුය")
        .transform((val) => val.trim()),
})

export type CategoryInput = z.infer<typeof categorySchema>;