// app/dashboard/layout.tsx
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getAuthenticatedUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { BranchProvider } from "@/lib/branch-context";

export default async function DashboardRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const realUser = await getAuthenticatedUser();

    if (!realUser) {
        redirect("/sign-in");
    }

    return (
        <BranchProvider user={realUser}>
            <DashboardLayout user={realUser} branchName={realUser.branch?.name}>
                {children}
            </DashboardLayout>
        </BranchProvider>
    );
}