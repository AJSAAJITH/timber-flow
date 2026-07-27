import { z } from "zod";
export const branchSchema = z.object({
    name: z
        .string()
        .min(1, "Branch is required")
        .min(2, "Branch name must be at least 3 characters long")
        .max(50, "Branch name can't exceed 50 characters"),

    location: z
        .string()
        .min(1, "Location is required")
        .min(5, "Location details should at least 5 characters long"),

    assignedAdminId: z
        .string()
        .optional()
        .or(z.literal("")),
});

export type BranchInput = z.infer<typeof branchSchema>;