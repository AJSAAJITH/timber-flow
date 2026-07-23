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

// Types
export interface Branch {
    id: string
    name: string
    location: string
    status: "active" | "blocked"
    createdAt: string
    assignedAdmin: {
        id: string
        name: string
        email: string
    } | null
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

