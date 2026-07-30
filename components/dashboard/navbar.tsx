// components/dashboard/navbar.tsx
"use client"

import React, { useEffect } from "react"
import { Menu, X, ChevronDown, LogOut } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { useAuth } from "@/lib/auth-context"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { ModeToggle } from "../ModeToggle"
import { BranchSwitcher } from "./branch-switcher" // 👈 1. Branch Switcher එක Import කරගන්නා ලදී

interface NavbarProps {
    branchName?: string
    onMenuToggle?: () => void
}

export function Navbar({ branchName, onMenuToggle }: NavbarProps) {
    const { open: isOpen, setOpen: setIsOpen } = useSidebar();
    const { user, isLoading } = useAuth();
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    const { signOut } = useClerk();
    const router = useRouter();

    const handleToggleSidebar = () => {
        setIsOpen(!isOpen)
        onMenuToggle?.();
    }

    const handleLogout = async () => {
        setShowUserMenu(false);
        await signOut();
        router.push("/sign-in");
    }

    const getRoleDisplay = (role: string) => {
        const roleMap: Record<string, string> = {
            SUPER_ADMIN: "Super Admin",
            ADMIN: "Admin",
            CASHIER: "Cashier",
        }
        return roleMap[role] || role
    }

    if (isLoading) {
        return <div className="h-16 border-b border-border bg-card animate-pulse" />
    }

    useEffect(() => {
        console.log("Navbar user data:", user);
    }, [user]);

    return (
        <nav className="flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm md:px-6 z-30">
            {/* Left section: Logo and Menu Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleToggleSidebar}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-accent"
                    aria-label="Toggle sidebar menu"
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                        T
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-lg font-bold text-foreground leading-tight">TimberFlow</h1>
                        <p className="text-xs text-muted-foreground">
                            {user?.branch?.name || branchName || "ERP System"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right section: Branch Switcher, Theme Toggle & User Menu */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* 💡 2. Branch Switcher එක මෙතැනට එකතු කරන ලදී */}
                <BranchSwitcher />

                <ModeToggle />

                {/* User Menu Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                        aria-label="User menu"
                    >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="hidden sm:flex flex-col items-start">
                            <span className="text-xs font-medium leading-none">
                                {user?.name || "User"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {getRoleDisplay(user?.role || "CASHIER")}
                            </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-50">
                            <div className="border-b border-border p-3">
                                <p className="text-sm font-medium text-foreground">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-xs text-muted-foreground break-all">
                                    {user?.email || "No Email"}
                                </p>
                                <p className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                    {getRoleDisplay(user?.role || "CASHIER")}
                                </p>
                            </div>
                            <div className="p-2">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Sidebar Overlay Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 top-16 z-40 bg-black/50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </nav>
    )
}