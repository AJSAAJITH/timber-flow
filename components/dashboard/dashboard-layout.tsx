// components/dashboard/dashboard-layout.tsx
"use client"

import React from "react"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AuthProvider } from "@/lib/auth-context"
import { AuthUser } from "@/actions/auth" // 💡 AuthUser එක import කරගන්න
import { cn } from "@/lib/utils"
import { Navbar } from "./navbar"
import { SidebarMenu } from "./sidebar-menu"

interface DashboardLayoutProps {
    children: React.ReactNode
    user?: AuthUser | null // 💡 AuthUser ලෙස Type එක සකසන ලදී
    branchName?: string
}

export function DashboardLayoutContent({
    children,
    branchName,
}: {
    children: React.ReactNode
    branchName?: string
}) {
    const { open: isOpen } = useSidebar();

    return (
        <div className="flex h-screen w-full flex-col bg-background">
            {/* Navbar */}
            <Navbar branchName={branchName} />

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden w-full">
                {/* Sidebar - Mobile and Desktop */}
                <aside
                    className={cn(
                        "fixed inset-y-16 left-0 z-40 overflow-y-auto border-r border-border bg-sidebar transition-all duration-300 ease-in-out md:relative md:inset-auto md:z-0",
                        isOpen
                            ? "w-64 translate-x-0"
                            : "-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden"
                    )}
                >
                    <div className="p-4 w-64">
                        <SidebarMenu />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-background w-full">
                    <div className="h-full w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export function DashboardLayout({
    children,
    user,
    branchName,
}: DashboardLayoutProps) {
    return (
        <AuthProvider user={user as any}>
            <SidebarProvider defaultOpen={true}>
                <DashboardLayoutContent branchName={branchName}>
                    {children}
                </DashboardLayoutContent>
            </SidebarProvider>
        </AuthProvider>
    )
}