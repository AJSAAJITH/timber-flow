export interface User {
    id: string
    name: string
    email: string
    role: "SUPER_ADMIN" | "ADMIN" | "CASHIER"
    branch: string
    status: "active" | "blocked"
    joinedDate: string
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



// Types - invenroty
export interface StockItem {
    id: string
    productId: string
    productName: string
    sku: string
    category: string
    currentStock: number
    minStock: number
    branch: string
    lastUpdated: string
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
    id: string
    timestamp: string
    branch: string
    product: string
    logType: "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT" | "DAMAGE"
    quantity: number
    note: string
}

// branch management
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

