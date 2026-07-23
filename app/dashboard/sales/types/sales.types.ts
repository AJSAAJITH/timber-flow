export interface SaleItem {
    id: string
    productName: string
    quantity: number
    priceAtSale: number
    originalPrice: number
}

export type CheckoutMethod = "CASH" | "CREDIT" | "BANK_TRANSFER"
export type PaymentStatus = "PAID" | "PENDING" | "PARTIALLY_PAID"

export interface SaleRecord {
    id: string
    invoiceNumber: string
    date: string
    time: string
    timestamp: string
    branch: string
    customer?: string
    cashier: string
    checkoutMethod: CheckoutMethod
    paymentStatus: PaymentStatus
    subtotal: number
    totalAmount: number
    dueAmount: number
    items: SaleItem[]
}