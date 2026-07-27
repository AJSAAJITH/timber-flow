import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    role: z.enum(["ADMIN", "SUPER_ADMIN", "CASHIER"], {
        message: "Invalid role selected",
    }),
});

export const updateUserSchema = z.object({
    id: z.string().min(1, "User ID is required"),
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    role: z.enum(["ADMIN", "SUPER_ADMIN", "CASHIER"]),
});

export const changeBranchSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    branchId: z.string().min(1, "Branch ID is required"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangeBranchInput = z.infer<typeof changeBranchSchema>;