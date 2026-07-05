"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function syncWithDB() {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        return { success: false, error: "Unauthorized" };
    }
    try {
        let dbUser = await prisma.user.findUnique({
            where: {
                clerkId: clerkUser.id,
            },
        });

        if (!dbUser) {
            const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim()
            dbUser = await prisma.user.create({
                data: {
                    clerkId: clerkUser.id,
                    name: fullName || 'Unknown User',
                    role: 'SUPER_ADMIN',
                }
            });
            console.log(`✨ User [${fullName}] synced via Server Action!`);
        }
        return { success: true, user: dbUser };
    } catch (error) {
        console.error("Error syncing user with DB:", error);
        return { success: false, error: "Internal Server Error: syncWithDB" };
    }
}