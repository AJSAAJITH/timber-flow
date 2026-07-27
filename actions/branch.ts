"use server";

import prisma from "@/lib/prisma";
import { Branch, CreateBranchInput, UpdateBranchInput } from "@/lib/types";
import { actionError, actionSuccess } from "@/lib/types/action-response";
import { ActionResult } from "@/lib/types/action-result";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { revalidatePath } from "next/cache";

// GET ALL BRANCHES WITH ADMINS
export async function getBranches(): Promise<ActionResult<Branch[]>> {
    try {
        const branches = await prisma.branch.findMany({
            include: {
                users: {
                    where: {
                        role: "ADMIN",
                    },
                    select: { id: true, name: true, email: true },
                    take: 1,
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const formattedBranches: Branch[] = branches.map((b) => {
            const admin = b.users[0];
            return {
                id: b.id,
                name: b.name,
                location: b.location || "",
                status: b.isBlocked ? "blocked" : "active",
                createdAt: b.createdAt,
                assignedAdmin: admin
                    ? {
                        id: admin.id,
                        name: admin.name,
                        email: admin.email,
                    }
                    : null,
            };
        });
        return actionSuccess(formattedBranches);

    } catch (error) {
        console.error("Error fetching branches:", error);
        return actionError("Failed to fetch branches", "SERVER_ERROR");
    }
}

// CREATE NEW BRANCH
export async function createBranch(
    input: CreateBranchInput
): Promise<ActionResult<Branch>> {
    try {
        if (!input.name || input.name.trim() === "") {
            return actionError("Branch name is required", "VALIDATION_ERROR");
        }
        const trimmedName = input.name.trim();

        // check existing
        const existingBranch = await prisma.branch.findFirst({
            where: {
                name: {
                    equals: trimmedName,
                    mode: "insensitive",
                },
            },
        });
        if (existingBranch) {
            return actionError("A branch with this name already exists.", "VALIDATION_ERROR");
        }

        // create new branch
        const newBranch = await prisma.branch.create({
            data: {
                name: trimmedName,
                location: input.location || null,
            },
        });

        // if selected an admin, connect user to this branch using relational 'connect'
        if (input.adminUserId) {
            await prisma.user.update({
                where: { id: input.adminUserId },
                data: {
                    role: "ADMIN",
                    branches: {
                        connect: { id: newBranch.id },
                    },
                },
            });
        }

        revalidatePath("/admin/branches");

        const formattedBranch: Branch = {
            id: newBranch.id,
            name: newBranch.name,
            location: newBranch.location || "",
            status: newBranch.isBlocked ? "blocked" : "active",
            createdAt: newBranch.createdAt,
        };

        return actionSuccess(formattedBranch, "Branch created successfully");

    } catch (error) {
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return actionError("A branch with this name already exists.", "VALIDATION_ERROR");
        }

        console.error("Error creating branch:", error);
        return actionError("Failed to create branch.", "SERVER_ERROR");
    }
}

// UPDATE BRANCH
export async function updateBranch(
    branchId: string,
    input: UpdateBranchInput
): Promise<ActionResult<{ success: boolean }>> {
    try {
        // 1. Branch මූලික විස්තර Update කිරීම
        await prisma.branch.update({
            where: { id: branchId },
            data: {
                ...(input.name && { name: input.name }),
                ...(input.location !== undefined && { location: input.location }),
            },
        });

        // 2. Admin Assignment වෙනස් කිරීමක් සිදුවී ඇත්නම්
        if (input.adminUserId !== undefined) {
            // කලින් සිටි Admin ගෙන් Branch එක Unlink කිරීම (disconnect)
            const currentAdmins = await prisma.user.findMany({
                where: {
                    branches: { some: { id: branchId } },
                    role: "ADMIN",
                },
                select: { id: true },
            });

            if (currentAdmins.length > 0) {
                await prisma.branch.update({
                    where: { id: branchId },
                    data: {
                        users: {
                            disconnect: currentAdmins.map((admin) => ({ id: admin.id })),
                        },
                    },
                });
            }

            // අලුත් Admin කෙනෙක් තෝරාගෙන ඇත්නම් ඔහුව Connect කිරීම
            if (input.adminUserId) {
                await prisma.user.update({
                    where: { id: input.adminUserId },
                    data: {
                        role: "ADMIN",
                        branches: {
                            connect: { id: branchId },
                        },
                    },
                });
            }
        }

        revalidatePath("/admin/branches");
        return actionSuccess({ success: true });
    } catch (error) {
        console.error("Error updating branch:", error);
        return actionError("Failed to update branch", "SERVER_ERROR");
    }
}

// DELETE BRANCH
export async function deleteBranch(
    branchId: string
): Promise<ActionResult<{ success: boolean }>> {
    try {
        await prisma.branch.delete({
            where: { id: branchId },
        });

        revalidatePath("/admin/branches");
        return actionSuccess({ success: true });
    } catch (error) {
        console.error("Error deleting branch:", error);
        return actionError("Failed to delete branch", "SERVER_ERROR");
    }
}

// TOGGLE BRANCH STATUS (Block / Unblock)
export async function toggleBranchStatus(
    branchId: string
): Promise<ActionResult<{ isBlocked: boolean }>> {
    try {
        const branch = await prisma.branch.findUnique({
            where: { id: branchId },
            select: { isBlocked: true },
        });

        if (!branch) {
            return actionError("Branch not found", "NOT_FOUND");
        }

        const updated = await prisma.branch.update({
            where: { id: branchId },
            data: { isBlocked: !branch.isBlocked },
        });

        revalidatePath("/admin/branches");
        return actionSuccess({ isBlocked: updated.isBlocked });
    } catch (error) {
        console.error("Error toggling branch status:", error);
        return actionError("Failed to update branch status", "SERVER_ERROR");
    }
}

// GET AVAILABLE ADMINS FOR DROPDOWN
export async function getAvailableAdmins() {
    try {
        const admins = await prisma.user.findMany({
            where: {
                role: {
                    in: ["ADMIN", "SUPER_ADMIN"],
                },
                isBlocked: false,
            },
            select: {
                id: true,
                name: true,
                email: true,
                branches: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return actionSuccess(admins);
    } catch (error) {
        console.error("Error fetching admins:", error);
        return actionError("Failed to fetch available admins", "SERVER_ERROR");
    }
}

// Get All Branches
export async function getAllBranches(): Promise<ActionResult<{ id: string; name: string }[]>> {
    try {
        const branches = await prisma.branch.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            },
        });

        return actionSuccess(branches);
    } catch (error) {
        console.error("Error fetching branches:", error);
        return actionError("Failed to fetch branches", "SERVER_ERROR");
    }
}