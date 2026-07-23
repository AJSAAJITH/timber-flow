"use client"

import React, { useState, useMemo, useRef } from "react"
import { ShoppingCart } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

import { CATEGORIES, PAYMENT_METHODS, POS_MOCK_CUSTOMERS, POS_MOCK_PRODUCTS } from "./data/posMockData"
import { CartItem, Product } from "./types/pos.types"
import { ProductCatalog } from "./components/pos/ProductCatalog"
import { CartCheckout } from "./components/pos/CartCheckout"
import { NewCustomerDialog } from "./components/pos/dialogs/CheckoutConfirmationDialog"
import { CheckoutConfirmationDialog } from "./components/pos/dialogs/NewCustomerDialog"



export default function POSClientPage() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState("Cash")
    const [isWalkIn, setIsWalkIn] = useState(true)
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
    const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false)
    const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false)
    const [editingPriceId, setEditingPriceId] = useState<string | null>(null)
    const [editingPrice, setEditingPrice] = useState("")
    const [newCustomerData, setNewCustomerData] = useState({ name: "", phone: "" })
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Filter products
    const filteredProducts = useMemo(() => {
        return POS_MOCK_PRODUCTS.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [searchQuery, selectedCategory])

    // Cart calculations
    const cartCalculations = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + item.basePrice * item.quantity, 0)
        const finalTotal = cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0)
        const totalDiscount = subtotal - finalTotal
        return { subtotal, finalTotal, totalDiscount, count: cart.reduce((s, i) => s + i.quantity, 0) }
    }, [cart])

    // Handlers
    const addToCart = (product: Product) => {
        if (product.stock <= 0) return
        setCart((prev) => {
            const existing = prev.find((i) => i.productId === product.id)
            if (existing && existing.quantity >= product.stock) return prev
            if (existing) {
                return prev.map((i) =>
                    i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
                )
            }
            return [
                ...prev,
                {
                    productId: product.id,
                    name: product.name,
                    sku: product.sku,
                    basePrice: product.price,
                    finalPrice: product.price,
                    quantity: 1,
                    isDiscounted: false,
                },
            ]
        })
    }

    const updateFinalPrice = (productId: string, newPrice: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? {
                        ...item,
                        finalPrice: newPrice,
                        isDiscounted: newPrice < item.basePrice,
                    }
                    : item
            )
        )
    }

    const updateQuantity = (productId: string, delta: number) => {
        setCart((prev) => {
            const product = POS_MOCK_PRODUCTS.find((p) => p.id === productId)
            return prev
                .map((item) => {
                    if (item.productId !== productId) return item
                    const newQty = item.quantity + delta
                    if (newQty <= 0) return null
                    if (product && newQty > product.stock) return item
                    return { ...item, quantity: newQty }
                })
                .filter((i): i is CartItem => i !== null)
        })
    }

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.productId !== productId))
    }

    const canCheckout = cart.length > 0 && !(selectedPayment === "Credit" && isWalkIn)

    const handleCheckout = () => {
        if (!canCheckout) return
        const invoice = `
Invoice Generated:
Items: ${cartCalculations.count}
Subtotal: LKR ${cartCalculations.subtotal.toLocaleString()}
Total Discount: LKR ${cartCalculations.totalDiscount.toLocaleString()}
Final Total: LKR ${cartCalculations.finalTotal.toLocaleString()}
Payment: ${selectedPayment}
Customer: ${isWalkIn ? "Walk-in Customer" : POS_MOCK_CUSTOMERS.find((c) => c.id === selectedCustomerId)?.name || "Unknown"}
    `
        alert(invoice)
        setCart([])
        setIsCheckoutDialogOpen(false)
        if (window.innerWidth < 1024) setIsCartOpen(false)
    }

    const handleAddCustomerSubmit = () => {
        if (newCustomerData.name) {
            POS_MOCK_CUSTOMERS.push({
                id: `c${Date.now()}`,
                name: newCustomerData.name,
                phone: newCustomerData.phone,
            })
            setNewCustomerData({ name: "", phone: "" })
            setIsNewCustomerDialogOpen(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="grid grid-cols-1 lg:grid-cols-[1.85fr_1.15fr] gap-0 lg:h-screen">
                {/* Left: Product Catalog Component */}
                <ProductCatalog
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    categories={CATEGORIES}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    products={filteredProducts}
                    onAddToCart={addToCart}
                    searchInputRef={searchInputRef}
                />

                {/* Right: Desktop Cart Checkout Component */}
                <div className="hidden lg:flex lg:flex-col lg:h-screen lg:border-l lg:border-border lg:bg-card/50">
                    <CartCheckout
                        cart={cart}
                        customers={POS_MOCK_CUSTOMERS}
                        paymentMethods={PAYMENT_METHODS}
                        calculations={cartCalculations}
                        isWalkIn={isWalkIn}
                        selectedPayment={selectedPayment}
                        selectedCustomerId={selectedCustomerId}
                        canCheckout={canCheckout}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                        onToggleWalkIn={setIsWalkIn}
                        onSelectCustomer={setSelectedCustomerId}
                        onSelectPayment={setSelectedPayment}
                        onCheckout={() => setIsCheckoutDialogOpen(true)}
                        onNewCustomer={() => setIsNewCustomerDialogOpen(true)}
                        editingPriceId={editingPriceId}
                        editingPrice={editingPrice}
                        onStartEditPrice={(id, price) => {
                            setEditingPriceId(id)
                            setEditingPrice(price.toString())
                        }}
                        onEditingPriceChange={setEditingPrice}
                        onStopEditPrice={() => {
                            if (editingPriceId && editingPrice) {
                                const newPrice = parseFloat(editingPrice)
                                if (!isNaN(newPrice) && newPrice > 0) {
                                    updateFinalPrice(editingPriceId, newPrice)
                                }
                            }
                            setEditingPriceId(null)
                            setEditingPrice("")
                        }}
                    />
                </div>
            </div>

            {/* Mobile Bottom Bar */}
            {cartCalculations.count > 0 && (
                <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-border bg-card p-3 sm:p-4">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="w-full min-h-[48px] sm:min-h-[52px] bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-between px-4 active:scale-95"
                    >
                        <span className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            View Cart ({cartCalculations.count})
                        </span>
                        <span className="text-sm sm:text-base font-bold">
                            LKR {cartCalculations.finalTotal.toLocaleString()}
                        </span>
                    </button>
                </div>
            )}

            {/* Mobile Cart Sheet */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetContent side="bottom" className="h-[90vh] flex flex-col rounded-t-xl p-0">
                    <SheetHeader className="border-b border-border p-4">
                        <SheetTitle>Shopping Cart</SheetTitle>
                    </SheetHeader>
                    <CartCheckout
                        cart={cart}
                        customers={POS_MOCK_CUSTOMERS}
                        paymentMethods={PAYMENT_METHODS}
                        calculations={cartCalculations}
                        isWalkIn={isWalkIn}
                        selectedPayment={selectedPayment}
                        selectedCustomerId={selectedCustomerId}
                        canCheckout={canCheckout}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                        onToggleWalkIn={setIsWalkIn}
                        onSelectCustomer={setSelectedCustomerId}
                        onSelectPayment={setSelectedPayment}
                        onCheckout={() => setIsCheckoutDialogOpen(true)}
                        onNewCustomer={() => setIsNewCustomerDialogOpen(true)}
                        editingPriceId={editingPriceId}
                        editingPrice={editingPrice}
                        onStartEditPrice={(id, price) => {
                            setEditingPriceId(id)
                            setEditingPrice(price.toString())
                        }}
                        onEditingPriceChange={setEditingPrice}
                        onStopEditPrice={() => {
                            if (editingPriceId && editingPrice) {
                                const newPrice = parseFloat(editingPrice)
                                if (!isNaN(newPrice) && newPrice > 0) {
                                    updateFinalPrice(editingPriceId, newPrice)
                                }
                            }
                            setEditingPriceId(null)
                            setEditingPrice("")
                        }}
                    />
                </SheetContent>
            </Sheet>

            {/* Separated Dialog Components */}
            <NewCustomerDialog
                isOpen={isNewCustomerDialogOpen}
                onOpenChange={setIsNewCustomerDialogOpen}
                customerData={newCustomerData}
                onCustomerDataChange={setNewCustomerData}
                onSubmit={handleAddCustomerSubmit}
            />

            <CheckoutConfirmationDialog
                isOpen={isCheckoutDialogOpen}
                onOpenChange={setIsCheckoutDialogOpen}
                calculations={cartCalculations}
                selectedPayment={selectedPayment}
                isWalkIn={isWalkIn}
                canCheckout={canCheckout}
                onConfirmCheckout={handleCheckout}
            />
        </div>
    )
}