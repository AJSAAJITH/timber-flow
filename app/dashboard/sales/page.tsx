"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet"
import {
    Search,
    Plus,
    Minus,
    Trash2,
    ShoppingCart,
    DollarSign,
} from "lucide-react"

// Types
interface Product {
    id: string
    name: string
    sku: string
    price: number
    category: string
    stock: number
}

interface CartItem {
    productId: string
    name: string
    sku: string
    price: number
    quantity: number
}

// Mock Products Database
const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Basmati Rice 5kg",
        sku: "RICE-001",
        price: 850,
        category: "Grains",
        stock: 45,
    },
    {
        id: "2",
        name: "Palm Oil 1L",
        sku: "OIL-001",
        price: 320,
        category: "Cooking Oil",
        stock: 62,
    },
    {
        id: "3",
        name: "Flour (All Purpose)",
        sku: "FLOUR-001",
        price: 450,
        category: "Grains",
        stock: 38,
    },
    {
        id: "4",
        name: "Sugar 1kg",
        sku: "SUGAR-001",
        price: 280,
        category: "Staples",
        stock: 75,
    },
    {
        id: "5",
        name: "Dhal (Red) 1kg",
        sku: "DHAL-001",
        price: 580,
        category: "Legumes",
        stock: 28,
    },
    {
        id: "6",
        name: "Salt 500g",
        sku: "SALT-001",
        price: 120,
        category: "Staples",
        stock: 156,
    },
    {
        id: "7",
        name: "Tea Leaves 500g",
        sku: "TEA-001",
        price: 620,
        category: "Beverages",
        stock: 34,
    },
    {
        id: "8",
        name: "Milk Powder 400g",
        sku: "MILK-001",
        price: 750,
        category: "Dairy",
        stock: 52,
    },
    {
        id: "9",
        name: "Spice Mix 100g",
        sku: "SPICE-001",
        price: 180,
        category: "Spices",
        stock: 89,
    },
    {
        id: "10",
        name: "Coconut Oil 500ml",
        sku: "COCOIL-001",
        price: 420,
        category: "Cooking Oil",
        stock: 41,
    },
]

const CATEGORIES = [
    "All",
    "Grains",
    "Cooking Oil",
    "Staples",
    "Legumes",
    "Beverages",
    "Dairy",
    "Spices",
]

const PAYMENT_METHODS = ["Cash", "Credit (ණය)", "Bank Transfer"]

export default function POSPage() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState("Cash")
    const [selectedCustomer, setSelectedCustomer] = useState("Walk-in Customer")

    // Filter products
    const filteredProducts = useMemo(() => {
        return MOCK_PRODUCTS.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory =
                selectedCategory === "All" || product.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [searchQuery, selectedCategory])

    // Cart calculations
    const cartTotal = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cart]
    )

    const cartCount = useMemo(
        () => cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    )

    // Add to cart
    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existingItem = prev.find((item) => item.productId === product.id)
            if (existingItem) {
                return prev.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [
                ...prev,
                {
                    productId: product.id,
                    name: product.name,
                    sku: product.sku,
                    price: product.price,
                    quantity: 1,
                },
            ]
        })
    }

    // Update quantity
    const updateQuantity = (productId: string, delta: number) => {
        setCart((prev) => {
            const updated = prev.map((item) =>
                item.productId === productId
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
            return updated
        })
    }

    // Remove from cart
    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.productId !== productId))
    }

    // Complete transaction
    const completeTransaction = () => {
        if (cart.length === 0) return
        alert(
            `Transaction Complete!\nItems: ${cartCount}\nTotal: LKR ${cartTotal.toLocaleString()}\nPayment: ${selectedPayment}\nCustomer: ${selectedCustomer}`
        )
        setCart([])
        setIsCartOpen(false)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Layout Container */}
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-5">
                {/* Left: Product Catalog (2 columns on desktop, full width on mobile) */}
                <div className="lg:col-span-3 flex flex-col h-screen max-h-screen overflow-hidden">
                    {/* Search & Category Bar - Sticky */}
                    <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur p-3 sm:p-4 space-y-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by name or SKU"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        {/* Categories - Horizontal Scroll */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-3 py-1 text-xs sm:text-sm font-medium whitespace-nowrap rounded-full transition-colors ${selectedCategory === category
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3">
                            {filteredProducts.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="group relative flex flex-col bg-card border border-border rounded-lg p-2 sm:p-3 hover:bg-secondary/50 active:scale-95 transition-all touch-manipulation min-h-[120px] sm:min-h-[140px]"
                                >
                                    {/* Stock Badge */}
                                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-primary/10 px-2 py-1 rounded text-xs font-semibold text-primary">
                                        {product.stock}
                                    </div>

                                    {/* Product Name */}
                                    <div className="flex-1 flex flex-col justify-start mb-2">
                                        <p className="text-sm font-semibold text-foreground text-left line-clamp-2 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </p>

                                        {/* SKU - Monospace Font */}
                                        <p className="text-xs font-mono text-muted-foreground mt-1">
                                            {product.sku}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="text-lg sm:text-xl font-bold text-primary">
                                        LKR {product.price.toLocaleString()}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="flex items-center justify-center h-64 text-muted-foreground">
                                <p>No products found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Desktop Checkout Sidebar (Hidden on Mobile) */}
                <div className="hidden lg:flex lg:col-span-2 flex-col h-screen border-l border-border bg-card/50">
                    <CheckoutSidebar
                        cart={cart}
                        cartTotal={cartTotal}
                        selectedPayment={selectedPayment}
                        setSelectedPayment={setSelectedPayment}
                        selectedCustomer={selectedCustomer}
                        setSelectedCustomer={setSelectedCustomer}
                        onRemove={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                        onCheckout={completeTransaction}
                    />
                </div>
            </div>

            {/* Mobile Bottom Cart Bar - Fixed */}
            {cartCount > 0 && (
                <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-border bg-card p-3 sm:p-4">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="w-full min-h-[48px] sm:min-h-[52px] bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-between px-4 active:scale-95 transition-transform"
                    >
                        <span className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount} Items
                        </span>
                        <span className="text-sm sm:text-base font-bold">
                            LKR {cartTotal.toLocaleString()}
                        </span>
                    </button>
                </div>
            )}

            {/* Mobile Cart Sheet */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetContent side="bottom" className="h-[85vh] flex flex-col rounded-t-lg">
                    <SheetHeader className="border-b border-border pb-4">
                        <SheetTitle>Your Cart</SheetTitle>
                    </SheetHeader>

                    <CheckoutSidebar
                        cart={cart}
                        cartTotal={cartTotal}
                        selectedPayment={selectedPayment}
                        setSelectedPayment={setSelectedPayment}
                        selectedCustomer={selectedCustomer}
                        setSelectedCustomer={setSelectedCustomer}
                        onRemove={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                        onCheckout={() => {
                            completeTransaction()
                            setIsCartOpen(false)
                        }}
                        isMobile
                    />
                </SheetContent>
            </Sheet>
        </div>
    )
}

// Checkout Sidebar Component
interface CheckoutSidebarProps {
    cart: CartItem[]
    cartTotal: number
    selectedPayment: string
    setSelectedPayment: (method: string) => void
    selectedCustomer: string
    setSelectedCustomer: (customer: string) => void
    onRemove: (productId: string) => void
    onUpdateQuantity: (productId: string, delta: number) => void
    onCheckout: () => void
    isMobile?: boolean
}

function CheckoutSidebar({
    cart,
    cartTotal,
    selectedPayment,
    setSelectedPayment,
    selectedCustomer,
    setSelectedCustomer,
    onRemove,
    onUpdateQuantity,
    onCheckout,
    isMobile = false,
}: CheckoutSidebarProps) {
    return (
        <div className="flex flex-col h-full">
            {/* Cart Items */}
            <div className={`flex-1 overflow-y-auto ${isMobile ? "p-4" : "p-4"}`}>
                {cart.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground text-center">
                        <p>Your cart is empty</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {cart.map((item) => (
                            <div
                                key={item.productId}
                                className="bg-background/50 rounded-lg p-3 border border-border/50"
                            >
                                {/* Item Header */}
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-foreground truncate">
                                            {item.name}
                                        </p>
                                        <p className="text-xs font-mono text-muted-foreground">
                                            {item.sku}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onRemove(item.productId)}
                                        className="min-h-[36px] min-w-[36px] flex items-center justify-center hover:bg-destructive/10 rounded transition-colors active:scale-95"
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </button>
                                </div>

                                {/* Price and Quantity Controls */}
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-sm text-primary">
                                        LKR {(item.price * item.quantity).toLocaleString()}
                                    </span>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                                        <button
                                            onClick={() => onUpdateQuantity(item.productId, -1)}
                                            className="min-h-[32px] min-w-[32px] flex items-center justify-center hover:bg-primary/20 rounded transition-colors active:scale-95"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="min-w-[32px] text-center font-semibold text-sm">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.productId, 1)}
                                            className="min-h-[32px] min-w-[32px] flex items-center justify-center hover:bg-primary/20 rounded transition-colors active:scale-95"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>

                                {/* Unit Price */}
                                <p className="text-xs text-muted-foreground mt-1">
                                    @ LKR {item.price.toLocaleString()} each
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Checkout Section - Sticky at Bottom */}
            {cart.length > 0 && (
                <div className="border-t border-border bg-card/80 backdrop-blur p-4 space-y-4">
                    {/* Cart Total */}
                    <div className="flex justify-between items-center text-lg font-bold border-b border-border pb-3">
                        <span>Total:</span>
                        <span className="text-primary text-2xl">
                            LKR {cartTotal.toLocaleString()}
                        </span>
                    </div>

                    {/* Customer Selector */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-2">
                            Customer
                        </label>
                        <select
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option>Walk-in Customer</option>
                            <option>Credit Account A</option>
                            <option>Credit Account B</option>
                        </select>
                    </div>

                    {/* Payment Method Selection */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-2">
                            Payment Method
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {PAYMENT_METHODS.map((method) => (
                                <button
                                    key={method}
                                    onClick={() => setSelectedPayment(method)}
                                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-all min-h-[44px] active:scale-95 ${selectedPayment === method
                                            ? "bg-primary text-primary-foreground ring-1 ring-primary"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                        }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Complete Transaction Button */}
                    <button
                        onClick={onCheckout}
                        className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95"
                    >
                        <DollarSign className="h-5 w-5" />
                        Complete Transaction
                    </button>
                </div>
            )}
        </div>
    )
}
