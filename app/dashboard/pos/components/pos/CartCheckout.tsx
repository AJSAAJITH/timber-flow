// components/pos/CartCheckout.tsx
"use client"

import React from "react"
import { CustomerSelector } from "./CustomerSelector"
import { CartItemList } from "./CartItemList"
import { CartSummary } from "./CartSummary"
import { CartItem, Customer } from "../../types/pos.types"


interface CartCheckoutProps {
    cart: CartItem[]
    customers: Customer[]
    paymentMethods: string[]
    calculations: {
        subtotal: number
        finalTotal: number
        totalDiscount: number
        count: number
    }
    isWalkIn: boolean
    selectedPayment: string
    selectedCustomerId: string | null
    canCheckout: boolean
    onUpdateQuantity: (productId: string, delta: number) => void
    onRemove: (productId: string) => void
    onToggleWalkIn: (isWalkIn: boolean) => void
    onSelectCustomer: (customerId: string | null) => void
    onSelectPayment: (payment: string) => void
    onCheckout: () => void
    onNewCustomer: () => void
    editingPriceId: string | null
    editingPrice: string
    onStartEditPrice: (id: string, price: number) => void
    onEditingPriceChange: (value: string) => void
    onStopEditPrice: () => void
}

export function CartCheckout({
    cart,
    customers,
    paymentMethods,
    calculations,
    isWalkIn,
    selectedPayment,
    selectedCustomerId,
    canCheckout,
    onUpdateQuantity,
    onRemove,
    onToggleWalkIn,
    onSelectCustomer,
    onSelectPayment,
    onCheckout,
    onNewCustomer,
    editingPriceId,
    editingPrice,
    onStartEditPrice,
    onEditingPriceChange,
    onStopEditPrice,
}: CartCheckoutProps) {
    return (
        <div className="flex flex-col h-full">
            {/* 1. Customer Section */}
            <CustomerSelector
                isWalkIn={isWalkIn}
                selectedCustomerId={selectedCustomerId}
                customers={customers}
                onToggleWalkIn={onToggleWalkIn}
                onSelectCustomer={onSelectCustomer}
                onNewCustomer={onNewCustomer}
            />

            {/* 2. Cart Items List */}
            <CartItemList
                cart={cart}
                editingPriceId={editingPriceId}
                editingPrice={editingPrice}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
                onStartEditPrice={onStartEditPrice}
                onEditingPriceChange={onEditingPriceChange}
                onStopEditPrice={onStopEditPrice}
            />

            {/* 3. Cart Summary & Actions */}
            {cart.length > 0 && (
                <CartSummary
                    calculations={calculations}
                    selectedPayment={selectedPayment}
                    paymentMethods={paymentMethods}
                    isWalkIn={isWalkIn}
                    canCheckout={canCheckout}
                    onSelectPayment={onSelectPayment}
                    onCheckout={onCheckout}
                />
            )}
        </div>
    )
}