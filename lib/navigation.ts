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
import type { UserRole } from "./auth-context"

export interface NavItem {
    label: string
    href: string
    icon: React.ComponentType<any>
    requiredRoles: UserRole[]
    children?: NavItem[]
}

// 1. ප්‍රධාන Navigation Items (Super Admin හට සියල්ල පෙනේ)
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
        label: "Customer & Credit",
        href: "/dashboard/customers",
        icon: Users,
        requiredRoles: ["SUPER_ADMIN", "ADMIN", "CASHIER"],
    },
    {
        label: "Finance & Expenses",
        href: "/dashboard/finance",
        icon: DollarSign,
        requiredRoles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
        label: "Branch Management",
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
    {
        label: "Logout",
        href: "/logout",
        icon: LogOut,
        requiredRoles: ["SUPER_ADMIN", "ADMIN", "CASHIER"],
    },
]

// 2. Quick Action Shortcuts (Super Admin හට සියල්ල පෙනේ)
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

// Current User Role එක අනුව Array එක Filter කරන Utilities
export function getAccessibleNavItems(userRole: UserRole): NavItem[] {
    return navigationItems.filter((item) =>
        item.requiredRoles.includes(userRole)
    )
}

export function getAccessibleQuickActions(userRole: UserRole): NavItem[] {
    return quickActionItems.filter((item) =>
        item.requiredRoles.includes(userRole)
    )
}