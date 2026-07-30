// actions/category.action.ts
"use server"


import { revalidatePath } from "next/cache"
import { categorySchema } from "@/lib/validations/category"

import { Category } from "@prisma/client"
import { ActionResult } from "@/lib/types/action-result"
import prisma from "@/lib/prisma"
import { actionError, actionSuccess } from "@/lib/types/action-response"

// 1. Get All Categories
export async function getCategories(): Promise<ActionResult<Category[]>> {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
        });
        return actionSuccess(categories)
    } catch (error: any) {
        console.error("Get Categories Error:", error)
        return actionError("Can't Find Categories: ", "SERVER_ERROR")
    };
};

// 2. Create Category
export async function createCategory(name: string): Promise<ActionResult<Category>> {
    const validated = categorySchema.safeParse({ name })

    if (!validated.success) {
        return actionError("Validation එක අසාර්ථකයි", "VALIDATION_ERROR", validated.error.flatten().fieldErrors)
    };

    try {
        // Case-insensitive duplicate check
        const existingCategory = await prisma.category.findFirst({
            where: {
                name: {
                    equals: validated.data.name,
                    mode: "insensitive",
                },
            },
        });

        if (existingCategory) {
            return actionError("Already exsist a category from this name", "VALIDATION_ERROR", {
                name: ["Already exsist a category from this name"],
            })
        };

        const category = await prisma.category.create({
            data: {
                name: validated.data.name,
            },
        });

        revalidatePath("/dashboard/inventory")
        return actionSuccess(category, "Category created successful.");
    } catch (error: any) {
        console.error("Create Category Error:", error)
        return actionError(error.message || "Category creation feiled", "SERVER_ERROR")
    };
};

// 3. Update Category
export async function updateCategory(id: string, name: string): Promise<ActionResult<Category>> {
    const validated = categorySchema.safeParse({ name })

    if (!validated.success) {
        return actionError("Validation failed", "VALIDATION_ERROR", validated.error.flatten().fieldErrors)
    };

    try {
        const categoryExists = await prisma.category.findUnique({ where: { id } })
        if (!categoryExists) {
            return actionError("Category එක හමු නොවීය", "NOT_FOUND")
        };

        // Check if name is taken by another category
        const duplicate = await prisma.category.findFirst({
            where: {
                name: {
                    equals: validated.data.name,
                    mode: "insensitive",
                },
                NOT: { id },
            },
        });

        if (duplicate) {
            return actionError("Category already avilable from this name", "VALIDATION_ERROR", {
                name: ["Category already avilable from this name"],
            })
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                name: validated.data.name,
            },
        });

        revalidatePath("/dashboard/inventory")
        return actionSuccess(updatedCategory, "Category updated successfull");
    } catch (error: any) {
        console.error("Update Category Error:", error);
        return actionError(error.message || "Category update failed", "SERVER_ERROR");
    };
};

// 4. Delete Category
export async function deleteCategory(id: string): Promise<ActionResult<void>> {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        if (!category) {
            return actionError("Category not found", "NOT_FOUND")
        }

        // Products තිබෙනවා නම් Delete කිරීමට ඉඩ නොදෙන්න
        if (category._count.products > 0) {
            return actionError(
                `මෙම Category එකට Products ${category._count.products} ක් අනුබද්ධ කර ඇත. පළමුව ඒවා ඉවත් කරන්න.`,
                "VALIDATION_ERROR"
            );
        };

        await prisma.category.delete({
            where: { id },
        });

        revalidatePath("/dashboard/inventory")
        return actionSuccess(undefined, "Category delete Successfull");
    } catch (error: any) {
        console.error("Delete Category Error:", error)
        return actionError(error.message || "Category එක Delete කිරීමට අපොහොසත් විය", "SERVER_ERROR")
    };
};