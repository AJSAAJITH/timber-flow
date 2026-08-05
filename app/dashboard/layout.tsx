// app/dashboard/layout.tsx
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getAuthenticatedUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { BranchProvider } from "@/lib/branch-context";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Clerk හරහා Auth වී ඇත්දැයි පරීක්ෂා කිරීම
    const clerkUser = await currentUser();

    if (!clerkUser) {
        redirect("/sign-in");
    }

    // 2. Database එකේ User Record එක තිබේදැයි පරීක්ෂා කිරීම
    const realUser = await getAuthenticatedUser();

    if (!realUser) {
        // Clerk එකෙන් Log වී තිබුණත් Database එකේ නැතිනම් Unauthorized පිටුවට Redirect කරන්න
        redirect("/unauthorized");
    }

    return (
        <BranchProvider user={realUser}>
            <DashboardLayout user={realUser} branchName={realUser.branch?.name}>
                {children}
            </DashboardLayout>
        </BranchProvider>
    );
}