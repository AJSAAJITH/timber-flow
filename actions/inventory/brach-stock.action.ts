"use server";

import prisma from "@/lib/prisma";
import { BranchOption, CatalogProductOption, StockItem } from "@/lib/types";
import { actionError, actionSuccess } from "@/lib/types/action-response";
import { ActionResult } from "@/lib/types/action-result";
import { InventoryLogType } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Helper Function: Check if User exists in DB
async function getValidDbUserId(userId: string): Promise<string | null> {
    if (!userId || userId === "clerk_user_id") return null;

    // 1. Direct ID match
    const userById = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });
    if (userById) return userById.id;

    // 2. Optional: If your User model has a clerkId field
    try {
        const userByClerk = await (prisma.user as any).findFirst({
            where: { clerkId: userId },
            select: { id: true },
        });
        if (userByClerk) return userByClerk.id;
    } catch {
        // Ignore if clerkId field does not exist in schema
    }

    return null;
}

// 1. Fetch All Branches
export async function getBranches(): Promise<ActionResult<BranchOption[]>> {
    try {
        const branches = await prisma.branch.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        });
        return actionSuccess(branches);
    } catch (error) {
        return actionError("Branches load කිරීම අසාර්ථක විය.", "SERVER_ERROR");
    }
}

// 2. Fetch Catalog Products
export async function getCatalogProducts(): Promise<ActionResult<CatalogProductOption[]>> {
    try {
        const products = await prisma.product.findMany({
            select: { id: true, name: true, sku: true },
            orderBy: { name: "asc" },
        });

        const formattedProducts: CatalogProductOption[] = products.map((p) => ({
            id: p.id,
            name: p.name,
            sku: p.sku ?? "",
        }));

        return actionSuccess(formattedProducts);
    } catch (error) {
        return actionError("Catalog products load කිරීම අසාර්ථක විය.", "SERVER_ERROR");
    }
}

// 3. Fetch Branch Inventory Data
// actions/inventory.ts

export async function getBranchInventory(branchId: string): Promise<ActionResult<(StockItem & { unitPrice: number })[]>> {
    try {
        if (!branchId || branchId === "ALL") return actionError("Branch ID එකක් තෝරන්න.", "VALIDATION_ERROR");

        const inventory = await prisma.branchInventory.findMany({
            where: { branchId },
            include: {
                product: {
                    include: { category: true },
                },
            },
            orderBy: { product: { name: "asc" } },
        });

        const formattedData = inventory.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: item.product.name,
            sku: item.product.sku ?? "",
            categoryName: item.product.category?.name,
            currentStock: item.stockLevel,
            minStock: item.minStock,
            unitPrice: item.product.unitPrice ? Number(item.product.unitPrice) : 0,
        }));

        return actionSuccess(formattedData);
    } catch (error) {
        return actionError("Inventory දත්ත ලබා ගැනීමට නොහැකි විය.", "SERVER_ERROR");
    }
}

// 4. Add Product Stock to Branch
export async function addStockToBranch(input: {
    branchId: string;
    productId: string;
    quantity: number;
    minStock: number;
    userId: string;
}): Promise<ActionResult<void>> {
    try {
        const { branchId, productId, quantity, minStock, userId } = input;

        if (!branchId || !productId) {
            return actionError("Branch එක සහ Product එක තෝරන්න.", "VALIDATION_ERROR");
        }

        // Validate DB User ID
        const dbUserId = await getValidDbUserId(userId);
        if (!dbUserId) {
            return actionError(
                "පරිශීලකයා (User) Database එකෙහි හමු නොවීය. කරුණාකර නැවත Sign in වන්න හෝ User Sync වී ඇත්දැයි බලන්න.",
                "VALIDATION_ERROR"
            );
        }

        const existing = await prisma.branchInventory.findUnique({
            where: {
                branchId_productId: { branchId, productId },
            },
        });

        if (existing) {
            return actionError(
                "මෙම Product එක දැනටමත් මෙම Branch එකේ පවතී. Stock Adjust භාවිතා කරන්න.",
                "VALIDATION_ERROR"
            );
        }

        await prisma.$transaction(async (tx) => {
            await tx.branchInventory.create({
                data: {
                    branchId,
                    productId,
                    stockLevel: quantity,
                    minStock,
                },
            });

            await tx.inventoryLog.create({
                data: {
                    type: InventoryLogType.STOCK_IN,
                    quantity,
                    branchId,
                    productId,
                    userId: dbUserId,
                    note: "Initial Stock Addition",
                },
            });
        });

        revalidatePath("/dashboard/inventory");
        return actionSuccess(undefined, "Product එක සාර්ථකව Branch එකට එකතු කරන ලදී.");
    } catch (error: any) {
        console.error("Stock එකතු කිරීමේ දෝෂය:", error);
        return actionError("Stock එකතු කිරීමට නොහැකි විය.", "SERVER_ERROR");
    }
}

// 5. Adjust Stock
export async function adjustStock(input: {
    inventoryId: string;
    type: InventoryLogType;
    quantity: number;
    reason?: string;
    userId: string;
}): Promise<ActionResult<void>> {
    try {
        const { inventoryId, type, quantity, reason, userId } = input;

        if (!inventoryId || quantity <= 0) {
            return actionError("වලංගු ප්‍රමාණයක් ඇතුළත් කරන්න.", "VALIDATION_ERROR");
        }

        // Validate DB User ID
        const dbUserId = await getValidDbUserId(userId);
        if (!dbUserId) {
            return actionError(
                "පරිශීලකයා (User) Database එකෙහි හමු නොවීය. කරුණාකර නැවත Sign in වන්න.",
                "VALIDATION_ERROR"
            );
        }

        const currentInventory = await prisma.branchInventory.findUnique({
            where: { id: inventoryId },
        });

        if (!currentInventory) {
            return actionError("Stock වාර්තාව හමු නොවීය.", "NOT_FOUND");
        }

        const isReduction = type === "STOCK_OUT" || type === "DAMAGE";
        const newQuantity = isReduction
            ? currentInventory.stockLevel - quantity
            : currentInventory.stockLevel + quantity;

        if (newQuantity < 0) {
            return actionError("පවතින Stock ප්‍රමාණයට වඩා අඩු කිරීමට නොහැක.", "VALIDATION_ERROR");
        }

        await prisma.$transaction([
            prisma.branchInventory.update({
                where: { id: inventoryId },
                data: { stockLevel: newQuantity },
            }),
            prisma.inventoryLog.create({
                data: {
                    type,
                    quantity,
                    branchId: currentInventory.branchId,
                    productId: currentInventory.productId,
                    userId: dbUserId,
                    note: reason || `Manual Adjustment (${type})`,
                },
            }),
        ]);

        revalidatePath("/dashboard/inventory");
        return actionSuccess(undefined, "Stock එක සාර්ථකව Adjust කරන ලදී.");
    } catch (error) {
        return actionError("Adjustment එක සිදු කිරීමට නොහැකි විය.", "SERVER_ERROR");
    }
}

// 6. Delete Product from Branch Stock
export async function deleteBranchInventory(inventoryId: string): Promise<ActionResult<void>> {
    try {
        await prisma.branchInventory.delete({
            where: { id: inventoryId },
        });

        revalidatePath("/dashboard/inventory");
        return actionSuccess(undefined, "Product එක Branch Stock එකෙන් ඉවත් කරන ලදී.");
    } catch (error) {
        return actionError("Product එක ඉවත් කිරීමට නොහැකි විය.", "SERVER_ERROR");
    }
}