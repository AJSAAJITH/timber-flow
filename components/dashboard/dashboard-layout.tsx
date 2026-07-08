"use client"

import React from "react"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AuthProvider } from "@/lib/auth-context"
import type { User } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Navbar } from "./navbar"
import { SidebarMenu } from "./sidebar-menu"

interface DashboardLayoutProps {
    children: React.ReactNode
    user?: User | null
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
        /* 💡 ලොකුම වෙනස: මෙතනට 'w-full' එකතු කලා. 
           SidebarProvider එක flex row එකක් නිසා මේකට මුළු පළලම ගන්න w-full අනිවාර්යයි! */
        <div className="flex h-screen w-full flex-col bg-background">
            {/* Navbar */}
            <Navbar branchName={branchName} />

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden w-full">
                {/* Sidebar - Mobile and Desktop */}
                {/* 💡 වෙනස: isOpen එක අනුව Width එක (w-64 හෝ w-0) මාරු කරලා ඩෙස්ක්ටොප් එකේ toggle එක හැදුවා */}
                <aside
                    className={cn(
                        "fixed inset-y-16 left-0 z-40 overflow-y-auto border-r border-border bg-sidebar transition-all duration-300 ease-in-out md:relative md:inset-auto md:z-0",
                        isOpen
                            ? "w-64 translate-x-0"
                            : "-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden"
                    )}
                >
                    {/* SidebarMenu එක ඇතුලෙන් shrink නොවී ලස්සනට තියෙන්න w-64 wrapper එකක් දැම්මා */}
                    <div className="p-4 w-64">
                        <SidebarMenu />
                    </div>
                </aside>

                {/* Main Content */}
                {/* 💡 මෙතනටත් w-full එකතු කරලා ඉතුරු හැම ඉඩක්ම ගන්න flex-1 දුන්නා */}
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
        <AuthProvider user={user}>
            {/* defaultOpen=true දුන්නොත් ඩෙස්ක්ටොප් එකේදී මුලින්ම සයිඩ්බාර් එක ඇරිලා තියෙයි */}
            <SidebarProvider defaultOpen={true}>
                <DashboardLayoutContent branchName={branchName}>
                    {children}
                </DashboardLayoutContent>
            </SidebarProvider>
        </AuthProvider>
    )
}