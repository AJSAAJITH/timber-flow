"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    History,
    Users,
    DollarSign,
    GitBranch,
    UserCog,
    BarChart3,
    Settings,
    LogOut,
    PlusCircle,
    UserPlus,
    FilePlus2
} from "lucide-react"

// UserRole ටයිප් එක (ඔයාගේ auth-context එකට අනුව)
type UserRole = "SUPER_ADMIN" | "ADMIN" | "CASHIER"

export interface NavItem {
    label: string
    href: string
    icon: React.ComponentType<any>
    requiredRoles: UserRole[]
}

// ==========================================
// 1. DIRECT NAVIGATION CONFIGURATION
// ==========================================
export const navigationItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        requiredRoles: ["SUPER_ADMIN", "ADMIN", "CASHIER"],
    },
    {
        label: "Point of Sale (POS)",
        href: "/dashboard/pos",
        icon: ShoppingCart,
        requiredRoles: ["SUPER_ADMIN", "ADMIN", "CASHIER"],
    },
    {
        label: "Inventory Management",
        href: "/dashboard/inventory",
        icon: Package,
        requiredRoles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
        label: "Sales History",
        href: "/dashboard/sales",
        icon: History,
        requiredRoles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
        label: "Customer Management",
        href: "/dashboard/customers",
        icon: Users,
        requiredRoles: ["SUPER_ADMIN", "ADMIN", "CASHIER"],
    },
    {
        label: "Finance Management",
        href: "/dashboard/finance",
        icon: DollarSign,
        requiredRoles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
        label: "Branches Management",
        href: "/dashboard/branches",
        icon: GitBranch,
        requiredRoles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
        label: "User Management",
        href: "/dashboard/users",
        icon: UserCog,
        requiredRoles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
        label: "Reports",
        href: "/dashboard/reports",
        icon: BarChart3,
        requiredRoles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        requiredRoles: ["SUPER_ADMIN", "ADMIN"],
    },
]

export const quickActionItems: NavItem[] = [
    {
        label: "New POS Invoice",
        href: "/dashboard/pos?action=new",
        icon: PlusCircle,
        requiredRoles: ["SUPER_ADMIN", "ADMIN", "CASHIER"],
    },
    {
        label: "Add New Timber SKU",
        href: "/dashboard/inventory?action=add",
        icon: FilePlus2,
        requiredRoles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
        label: "Register Customer",
        href: "/dashboard/customers?action=new",
        icon: UserPlus,
        requiredRoles: ["SUPER_ADMIN", "ADMIN", "CASHIER"],
    },
    {
        label: "Record New Expense",
        href: "/dashboard/finance?action=new",
        icon: DollarSign,
        requiredRoles: ["SUPER_ADMIN", "ADMIN"],
    },
]

// ==========================================
// 2. MAIN SIDEBAR MENU COMPONENT
// ==========================================
export function SidebarMenu() {
    const pathname = usePathname()
    const { user } = useAuth()
    const { setOpen: setIsOpen, isMobile } = useSidebar()

    if (!user) {
        return null
    }

    // දැනට ලොග් වී සිටින පරිශීලකයාගේ රෝල් එක අනුව ෆිල්ටර් කරගැනීම
    const currentRole = user.role as UserRole
    const navItems = navigationItems.filter((item) => item.requiredRoles.includes(currentRole))
    const quickActions = quickActionItems.filter((item) => item.requiredRoles.includes(currentRole))

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard"
        }
        return pathname.startsWith(href.split('?')[0])
    }

    return (
        <div className="space-y-6">
            {/* 1. Main Navigation Menu */}
            <nav className="space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isItemActive = isActive(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                                if (isMobile) {
                                    setIsOpen(false)
                                }
                            }}
                            className={cn(
                                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                                isItemActive
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                                    : "text-sidebar-foreground"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-5 w-5 flex-shrink-0 transition-transform",
                                    isItemActive && "scale-110"
                                )}
                            />
                            <span className="flex-1">{item.label}</span>
                            {isItemActive && (
                                <div className="h-2 w-2 rounded-full bg-current" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* 2. Quick Actions Menu */}
            {quickActions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-sidebar-border/60">
                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                        Quick ERP Actions
                    </p>
                    <nav className="space-y-1">
                        {quickActions.map((item) => {
                            const Icon = item.icon
                            const isItemActive = isActive(item.href)

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => {
                                        if (isMobile) {
                                            setIsOpen(false)
                                        }
                                    }}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-all duration-200",
                                        "text-sidebar-foreground/80 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring border border-transparent hover:border-emerald-500/20",
                                        isItemActive && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                                    )}
                                >
                                    <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-current" />
                                    <span className="flex-1">{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            )}
        </div>
    )
}