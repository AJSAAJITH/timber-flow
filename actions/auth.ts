"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "CASHIER";

export async function getAuthenticatedUser() {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return null;
        }

        // ඩේටාබේස් එකෙන් යූසර්ව සර්ච් කිරීම (Read Only)
        const dbUser = await prisma.user.findUnique({
            where: {
                clerkId: clerkUser.id,
            },
            include: {
                branches: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        // DB එකේ යූසර් නැත්නම් හෝ Block කරලා නම් Access නෑ
        if (!dbUser || dbUser.isBlocked) {
            return null;
        }

        return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role as UserRole,
            branches: dbUser.branches, // dbUser.branch වෙනුවට array එකක් ලෙස branches ලබා දීම
        };
    } catch (error) {
        console.error("Error in getAuthenticatedUser server action:", error);
        return null;
    }
}