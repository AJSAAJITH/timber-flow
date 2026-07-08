import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { getOrCreateAuthenticatedUser } from "@/actions/auth" // 💡 ඔයාගේ සැබෑ ඇක්ෂන් එක import කරගන්න
import { redirect } from "next/navigation"

export default async function DashboardRootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // 1. සර්වර් එක පැත්තෙන්ම Clerk + DB හරහා සැබෑ යූසර්ව ලබා ගැනීම
    const response = await getOrCreateAuthenticatedUser()

    // 2. යූසර් කෙනෙක් නැත්නම් හෝ මොකක් හරි අවුලක් නම් ආරක්ෂාව සඳහා Sign-In එකට Redirect කිරීම
    if (!response.success || !response.user) {
        redirect("/sign-in")
    }

    // 3. දැන් අපිට සැබෑ DB එකේ ඉන්න යූසර් ලැබෙනවා
    const realUser = response.user

    return (
        // 💡 දැන් mockUser වෙනුවට realUser එක සහ එයාගේ බ්‍රාන්ච් එක Layout එකට පාස් කරනවා
        <DashboardLayout user={realUser} branchName={realUser.branch?.name}>
            {children}
        </DashboardLayout>
    )
}