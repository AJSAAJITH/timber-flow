// actions/auth.ts
"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export interface AuthUser {
    id: string;
    clerkId: string;
    name: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN" | "CASHIER";
    branch?: {
        id: string;
        name: string;
    };
}

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return null;

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: clerkUser.id },
            include: {
                branches: {
                    select: { id: true, name: true },
                    take: 1,
                },
            },
        });

        if (!dbUser) return null;

        return {
            id: dbUser.id,
            clerkId: dbUser.clerkId,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            branch: dbUser.branches[0] || undefined,
        };
    } catch (error) {
        console.error("Auth fetch error:", error);
        return null;
    }
}