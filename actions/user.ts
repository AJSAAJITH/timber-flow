"use server";
import prisma from "@/lib/prisma";
import { actionError, actionSuccess } from "@/lib/types/action-response";
import { ActionResult } from "@/lib/types/action-result";
import { ChangeBranchInput, changeBranchSchema, CreateUserInput, createUserSchema, UpdateUserInput, updateUserSchema } from "@/lib/validations/user";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUsers(): Promise<ActionResult<any[]>> {
    try {
        const users = await prisma.user.findMany({
            include: {
                branches: {
                    select: {
                        id: true,
                        name: true,
                    },
                    take: 1,
                },
            },
            orderBy: { createdAt: "desc" },
        });
        const formattedUsers = users.map((u) => (
            {
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                branch: u.branches[0]?.name || "No Branch",
                status: u.isBlocked ? "blocked" : "active",
                joinedDate: u.createdAt.toISOString().split("T")[0],
            }
        ));
        return actionSuccess(formattedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        return actionError("Feiled to fetch users", "SERVER_ERROR");
    }
}

// CREATE NEW USER
export async function createUser(input: CreateUserInput): Promise<ActionResult<any>> {
    try {
        // Validations
        const validationResult = createUserSchema.safeParse(input);
        if (!validationResult.success) {
            const errotMsg = validationResult.error.issues.map((e) => e.message).join(",");
            return actionError(errotMsg, "VALIDATION_ERROR");
        }
        const { name, email, password, role } = validationResult.data;

        // Check Email Already Exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return actionError("A user with this email already exists in Database.", "VALIDATION_ERROR");
        }

        // Create User in Clerk
        const clerk = await clerkClient();
        let clerkUser;

        try {
            const nameParts = name.trim().split(" ");
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(" ") || "";

            clerkUser = await clerk.users.createUser({
                emailAddress: [email],
                password: password,
                firstName: firstName,
                lastName: lastName,
                publicMetadata: {
                    role: role,
                },
            });
        } catch (clerkErr: any) {
            console.error("Clerk user creation error:", clerkErr);
            const errorMessage =
                clerkErr?.errors?.[0]?.longMessage ||
                clerkErr?.errors?.[0]?.message ||
                "Failed to create user account in Clerk";
            return actionError(errorMessage, "CLERK_ERROR");
        }

        // Create user in DB (Without initial branch connection)
        try {
            const newUser = await prisma.user.create({
                data: {
                    clerkId: clerkUser.id,
                    name,
                    email,
                    role: role as any,
                    isBlocked: false,
                },
                include: {
                    branches: { select: { name: true } },
                },
            });

            revalidatePath("/dashboard/users");

            const formattedNewUser = {
                id: newUser.id,
                clerkId: newUser.clerkId,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                branch: newUser.branches[0]?.name || "Unassigned", // Assign නොවී ඇත්නම් Unassigned ලෙස පෙන්වයි
                status: "active",
                joinedDate: newUser.createdAt.toISOString().split("T")[0],
            };

            return actionSuccess(formattedNewUser, "User created successfully in Clerk & DB");
        } catch (dbError) {
            // DB එකට Save වීම Fail වුවහොත් Clerk එකේ සාදපු User ව Rollback (Delete) කිරීම
            console.error("DB creation failed, rolling back Clerk user:", dbError);
            await clerk.users.deleteUser(clerkUser.id);
            return actionError("Failed to save user in local database.", "SERVER_ERROR");
        }

    } catch (error) {
        console.error("Error creating user:", error);
        return actionError("Failed to create user", "SERVER_ERROR");
    }
}

// UPDATE USER DETAILS
export async function updateUser(input: UpdateUserInput): Promise<ActionResult<any>> {
    try {
        const validationResult = updateUserSchema.safeParse(input);
        if (!validationResult.success) {
            const errorMsg = validationResult.error.issues.map((e) => e.message).join(", ");
            return actionError(errorMsg, "VALIDATION_ERROR");
        }

        const { id, name, email, role } = validationResult.data;

        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            return actionError("User not found in database", "NOT_FOUND");
        }

        // Update Clerk User
        const clerk = await clerkClient();
        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "";

        try {
            await clerk.users.updateUser(existingUser.clerkId, {
                firstName,
                lastName,
                publicMetadata: { role },
            });
        } catch (clerkErr: any) {
            console.error("Clerk user update error:", clerkErr);
            return actionError("Failed to update user in Clerk", "CLERK_ERROR");
        }

        // Update DB User
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { name, email, role: role as any },
            include: { branches: { select: { name: true } } },
        });

        revalidatePath("/dashboard/users");

        return actionSuccess({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            branch: updatedUser.branches[0]?.name || "Unassigned",
            status: updatedUser.isBlocked ? "blocked" : "active",
        }, "User updated successfully");
    } catch (error) {
        console.error("Error updating user:", error);
        return actionError("Failed to update user", "SERVER_ERROR");
    }
}

// CHANGE USER BRANCH
export async function changeUserBranch(input: ChangeBranchInput): Promise<ActionResult<any>> {
    try {
        const validationResult = changeBranchSchema.safeParse(input);
        if (!validationResult.success) {
            return actionError("Invalid input parameters", "VALIDATION_ERROR");
        }

        const { userId, branchId } = validationResult.data;

        // Link User with new Branch in Prisma
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                branches: {
                    set: [{ id: branchId }], // Assuming User-Branch relationship
                },
            },
            include: { branches: { select: { name: true } } },
        });

        revalidatePath("/dashboard/users");

        return actionSuccess({
            userId: updatedUser.id,
            branch: updatedUser.branches[0]?.name || "Unassigned",
        }, "User branch changed successfully");
    } catch (error) {
        console.error("Error changing user branch:", error);
        return actionError("Failed to change user branch", "SERVER_ERROR");
    }
}

// TOGGLE BLOCK USER (Clerk Ban/Unban + DB Flag)
export async function toggleUserBlockStatus(userId: string, isBlocked: boolean): Promise<ActionResult<any>> {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return actionError("User not found", "NOT_FOUND");

        const newBlockedStatus = !isBlocked;
        const clerk = await clerkClient();

        // Ban or Unban in Clerk
        try {
            if (newBlockedStatus) {
                await clerk.users.banUser(user.clerkId);
            } else {
                await clerk.users.unbanUser(user.clerkId);
            }
        } catch (clerkErr) {
            console.error("Clerk ban/unban error:", clerkErr);
            return actionError("Failed to update user block status in Clerk", "CLERK_ERROR");
        }

        // Update DB
        await prisma.user.update({
            where: { id: userId },
            data: { isBlocked: newBlockedStatus },
        });

        revalidatePath("/dashboard/users");

        return actionSuccess({
            id: userId,
            status: newBlockedStatus ? "blocked" : "active",
        }, `User ${newBlockedStatus ? "blocked" : "unblocked"} successfully`);
    } catch (error) {
        console.error("Error toggling user block status:", error);
        return actionError("Failed to update user status", "SERVER_ERROR");
    }
}

// DELETE USER (DB + Clerk)
export async function deleteUser(userId: string): Promise<ActionResult<any>> {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return actionError("User not found", "NOT_FOUND");

        // Delete from Clerk
        const clerk = await clerkClient();
        try {
            await clerk.users.deleteUser(user.clerkId);
        } catch (clerkErr) {
            console.error("Clerk user deletion error:", clerkErr);
        }

        // Delete from DB
        await prisma.user.delete({ where: { id: userId } });

        revalidatePath("/dashboard/users");

        return actionSuccess({ id: userId }, "User deleted successfully");
    } catch (error) {
        console.error("Error deleting user:", error);
        return actionError("Failed to delete user", "SERVER_ERROR");
    }
}