// POS
// Types
export interface Product {
    id: string
    name: string
    sku: string
    price: number
    category: string
    stock: number
}

export interface CartItem {
    productId: string
    name: string
    sku: string
    basePrice: number
    finalPrice: number
    quantity: number
    isDiscounted: boolean
}
export interface Customer {
    id: string
    name: string
    phone: string
}

/// Checkout and Payment
// Cart & Checkout Component
export interface CartCheckoutProps {
    cart: CartItem[]
    calculations: { subtotal: number; finalTotal: number; totalDiscount: number; count: number }
    isWalkIn: boolean
    selectedPayment: string
    selectedCustomerId: string | null
    canCheckout: boolean
    onUpdateQuantity: (id: string, delta: number) => void
    onRemove: (id: string) => void
    onUpdatePrice: (id: string, price: number) => void
    onToggleWalkIn: (isWalkIn: boolean) => void
    onSelectCustomer: (id: string | null) => void
    onSelectPayment: (method: string) => void
    onCheckout: () => void
    onNewCustomer: () => void
    isMobile?: boolean
    editingPriceId?: string | null
    editingPrice?: string
    onStartEditPrice?: (id: string, price: number) => void
    onStopEditPrice?: () => void
}