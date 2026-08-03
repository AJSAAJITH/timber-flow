import { InventoryLogType } from "@prisma/client"

export interface User {
    id: string;
    clerkId?: string;
    name: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN" | "CASHIER";
    branch?: {
        id: string;
        name: string;
    }; // 💡 branch: string වෙනුවට Object එකක් ලෙස සකසන්න
    status?: "active" | "blocked";
    joinedDate?: string;
}


export interface Stats {
    total: number;
    admins: number;
}

// Types
export interface Customer {
    id: string
    name: string
    phone: string
    nic: string
    address: string
    totalDue: number
    registeredDate: string
    lastTransaction?: string
}

export interface Product {
    id: string
    name: string
    sku: string
    category: string
    unitPrice: number
    createdDate: string
}

export interface Category {
    id: string
    name: string
}

export interface StockLog {
    id: string;
    branchId: string; // 💡 branchId එක මෙතැනට එක් කරන්න
    product: string;
    branch: string;
    quantity: number;
    logType: "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT" | "RETURN" | "DAMAGE";
    timestamp: string;
    note?: string;
}

////////////////////////////////////////////////////////////////
// branch management - starting 
export interface AssignedAdmin {
    id: string;
    name: string;
    email: string;
}

export interface Branch {
    id: string;
    name: string;
    location: string;
    status: "active" | "blocked";
    assignedAdmin?: AssignedAdmin | null;
    createdAt: Date;
}

export interface CreateBranchInput {
    name: string;
    location?: string;
    adminUserId?: string; // තෝරාගත් Admin User ගේ ID එක
}

export interface UpdateBranchInput {
    name?: string;
    location?: string;
    adminUserId?: string | null;
}

// Product Type definition for Frontend
export type ProductWithCategory = {
    id: string
    name: string
    sku: string | null
    categoryId: string
    category: {
        id: string
        name: string
    }
    unitPrice: number
    createdAt: Date
    updatedAt: Date
}

// branch Stock management
export interface StockItem {
    id: string; // BranchInventory ID
    productId: string;
    productName: string;
    sku: string;
    categoryName?: string;
    currentStock: number;
    minStock: number;
    branch?: string;
}

export interface BranchOption {
    id: string;
    name: string;
}

export interface CatalogProductOption {
    id: string;
    name: string;
    sku: string;
}

// src/types/dashboard.ts

export interface DashboardMetricStats {
    todayTotalSales: number;
    todayInvoiceCount: number;
    totalPendingDue: number;
    pendingInvoiceCount: number;
    todayStockIssuedUnits: number;
}

export interface DashboardTodaySale {
    id: string;
    invoiceNumber: string;
    time: string;
    customerName: string;
    itemsSummary: string;
    branchName: string;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    status: "PAID" | "PENDING" | "PARTIALLY_PAID";
}

export interface DashboardData {
    stats: DashboardMetricStats;
    todaySales: DashboardTodaySale[];
}