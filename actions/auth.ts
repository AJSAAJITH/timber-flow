"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/lib/auth-context";

export async function getOrCreateAuthenticatedUser() {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        return { success: false, user: null };
    }

    try {
        // ඩේටාබේස් එකෙන් යූසර්ව සොයා ගැනීම (branch රිලේෂන් එකත් සමඟ)
        let dbUser = await prisma.user.findUnique({
            where: {
                clerkId: clerkUser.id,
            },
            include: {
                branch: true,
            }
        });

        // යූසර් කෙනෙක් නැත්නම් SUPER_ADMIN විදිහට අලුතින් ක්‍රියේට් කිරීම
        if (!dbUser) {
            const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
            const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || '';

            dbUser = await prisma.user.create({
                data: {
                    clerkId: clerkUser.id,
                    name: fullName || 'Unknown User',
                    email: primaryEmail, // 👈 දැන් මේක Prisma එකෙන් පිළිගන්නවා
                    role: 'SUPER_ADMIN',
                },
                include: {
                    branch: true
                }
            });
            console.log(`✨ User [${fullName}] successfully synced as SUPER_ADMIN!`);
        }
        console.log(`✅ User [${dbUser.email}] successfully retrieved from the database.`);
        // ෆ්‍රොන්ට්එන්ඩ් එකේ User Interface එකට ගැලපෙන විදිහට object එක සකස් කිරීම
        return {
            success: true,
            user: {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                role: dbUser.role as UserRole,
                branch: dbUser.branch ? {
                    id: dbUser.branch.id,
                    name: dbUser.branch.name
                } : undefined
            }
        };

    } catch (error) {
        console.error("Error in getOrCreateAuthenticatedUser server action:", error);
        return { success: false, user: null, error: "Internal Server Error" };
    }
}

export async function getAuthenticatedUser() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return null;
        }
        const dbUser = await prisma.user.findUnique({
            where: {
                clerkId: clerkUser.id,
            },
            include: {
                branch: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!dbUser) return null;

        return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role as UserRole,
            branch: dbUser.branch ? {
                id: dbUser.branch.id,
                name: dbUser.branch.name,
            } : undefined,
        }

    } catch (error) {
        console.error("Error in getAuthenticatedUser server action:", error);
        return null;
    }
}