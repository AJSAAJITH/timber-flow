// types/sales.types.ts

export type CheckoutMethod = "CASH" | "CREDIT" | "BANK_TRANSFER";
export type PaymentStatus = "PAID" | "PENDING" | "PARTIALLY_PAID";

export interface SaleItem {
    id: string;
    productName: string;
    quantity: number;
    priceAtSale: number;
    originalPrice: number;
}

export interface SaleRecord {
    id: string;
    invoiceNumber: string;
    date: string;
    time: string;
    timestamp: string;
    branchId: string;
    branch: string;
    customer?: string;
    cashier: string;
    checkoutMethod: CheckoutMethod;
    paymentStatus: PaymentStatus;
    subtotal: number;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    items: SaleItem[];
}

export interface SalesFilterParams {
    branchId?: string; // "ALL" or specific branch ID
    searchQuery?: string;
    paymentMethod?: CheckoutMethod | "ALL";
    paymentStatus?: PaymentStatus | "ALL";
    startDate?: string; // ISO String or YYYY-MM-DD
    endDate?: string;   // ISO String or YYYY-MM-DD
    page?: number;
    limit?: number;
}

export interface SalesSummaryStats {
    totalRevenue: number;
    totalSalesCount: number;
    totalDueAmount: number;
    totalPaidAmount: number;
}

export interface GetSalesResponse {
    success: boolean;
    data: SaleRecord[];
    stats: SalesSummaryStats;
    pagination: {
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    };
    error?: string;
}