"use client"

import React, { useState, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Search,
    Plus,
    Minus,
    Trash2,
    ShoppingCart,
    DollarSign,
    AlertCircle,
    Check,
    Edit2,
    X,
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
    basePrice: number
    finalPrice: number
    quantity: number
    isDiscounted: boolean
}

interface Customer {
    id: string
    name: string
    phone: string
}

// Mock Products Database - TimberFlow Industrial Items
const MOCK_PRODUCTS: Product[] = [
    { id: "1", name: "Wood Pallet 48x40", sku: "WP-001", price: 2500, category: "Pallets", stock: 42 },
    { id: "2", name: "Treated Wood Board (2x4)", sku: "WB-001", price: 850, category: "Boards", stock: 128 },
    { id: "3", name: "Plastic Pallet 48x40", sku: "PP-001", price: 1500, category: "Plastics", stock: 0 },
    { id: "4", name: "Metal Angle 40x40x3mm", sku: "MA-001", price: 450, category: "Metal Items", stock: 186 },
    { id: "5", name: "Premium Wood Pallet", sku: "WP-003", price: 3200, category: "Pallets", stock: 25 },
    { id: "6", name: "Wood Board (1x12)", sku: "WB-002", price: 650, category: "Boards", stock: 64 },
    { id: "7", name: "Plastic Sheet 4x8ft", sku: "PS-001", price: 2200, category: "Plastics", stock: 12 },
    { id: "8", name: "Steel Channel 50x50", sku: "SC-001", price: 1200, category: "Metal Items", stock: 45 },
    { id: "9", name: "Plywood 4x8 Grade A", sku: "PW-001", price: 5400, category: "Boards", stock: 8 },
    { id: "10", name: "Metal Pipe 2 inch", sku: "MP-001", price: 3800, category: "Metal Items", stock: 35 },
]

const CATEGORIES = ["All", "Pallets", "Boards", "Plastics", "Metal Items"]
const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Credit"]

const MOCK_CUSTOMERS: Customer[] = [
    { id: "1", name: "Roshan Kumar", phone: "+94 777 123456" },
    { id: "2", name: "Priya Perera", phone: "+94 765 234567" },
    { id: "3", name: "Anura Silva", phone: "+94 712 345678" },
]

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
        return MOCK_PRODUCTS.filter((product) => {
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

    // Add to cart
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

    // Update final price with bargaining
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

    // Update quantity
    const updateQuantity = (productId: string, delta: number) => {
        setCart((prev) => {
            const product = MOCK_PRODUCTS.find((p) => p.id === productId)
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

    // Remove from cart
    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.productId !== productId))
    }

    // Validation for checkout
    const canCheckout =
        cart.length > 0 && !(selectedPayment === "Credit" && isWalkIn)

    // Complete transaction
    const handleCheckout = () => {
        if (!canCheckout) return
        const invoice = `
Invoice Generated:
Items: ${cartCalculations.count}
Subtotal: LKR ${cartCalculations.subtotal.toLocaleString()}
Total Discount: LKR ${cartCalculations.totalDiscount.toLocaleString()}
Final Total: LKR ${cartCalculations.finalTotal.toLocaleString()}
Payment: ${selectedPayment}
Customer: ${isWalkIn ? "Walk-in Customer" : MOCK_CUSTOMERS.find((c) => c.id === selectedCustomerId)?.name || "Unknown"}
    `
        alert(invoice)
        setCart([])
        setIsCheckoutDialogOpen(false)
        if (window.innerWidth < 1024) setIsCartOpen(false)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.85fr_1.15fr] gap-0 lg:h-screen">
                {/* LEFT: Product Catalog */}
                <div className="lg:flex lg:flex-col lg:h-screen lg:overflow-hidden">
                    {/* Search & Category Bar */}
                    <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur p-3 sm:p-4 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search by Product Name or SKU..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Categories */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap rounded-full transition-colors ${selectedCategory === cat
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:pb-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3">
                            {filteredProducts.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    disabled={product.stock === 0}
                                    className={`group relative flex flex-col bg-card border border-border rounded-lg p-2 sm:p-3 transition-all min-h-[110px] sm:min-h-[140px] ${product.stock === 0
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-secondary/50 active:scale-95 touch-manipulation"
                                        }`}
                                >
                                    {/* Stock Badge */}
                                    <div
                                        className={`absolute top-1 right-1 sm:top-2 sm:right-2 px-2 py-1 rounded text-xs font-bold ${product.stock === 0
                                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                            }`}
                                    >
                                        {product.stock === 0 ? "Out" : `${product.stock}`}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col justify-start mb-2">
                                        <p className="text-sm font-semibold text-foreground line-clamp-2">
                                            {product.name}
                                        </p>
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
                                No products found
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Cart & Checkout (Desktop) */}
                <div className="hidden lg:flex lg:flex-col lg:h-screen lg:border-l lg:border-border lg:bg-card/50">
                    <CartCheckout
                        cart={cart}
                        calculations={cartCalculations}
                        isWalkIn={isWalkIn}
                        selectedPayment={selectedPayment}
                        selectedCustomerId={selectedCustomerId}
                        canCheckout={canCheckout}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                        onUpdatePrice={updateFinalPrice}
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

            {/* Mobile Cart Button */}
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
                <SheetContent side="bottom" className="h-[90vh] flex flex-col rounded-t-xl">
                    <SheetHeader className="border-b border-border pb-4">
                        <SheetTitle>Shopping Cart</SheetTitle>
                    </SheetHeader>
                    <CartCheckout
                        cart={cart}
                        calculations={cartCalculations}
                        isWalkIn={isWalkIn}
                        selectedPayment={selectedPayment}
                        selectedCustomerId={selectedCustomerId}
                        canCheckout={canCheckout}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                        onUpdatePrice={updateFinalPrice}
                        onToggleWalkIn={setIsWalkIn}
                        onSelectCustomer={setSelectedCustomerId}
                        onSelectPayment={setSelectedPayment}
                        onCheckout={() => setIsCheckoutDialogOpen(true)}
                        onNewCustomer={() => setIsNewCustomerDialogOpen(true)}
                        isMobile
                        editingPriceId={editingPriceId}
                        editingPrice={editingPrice}
                        onStartEditPrice={(id, price) => {
                            setEditingPriceId(id)
                            setEditingPrice(price.toString())
                        }}
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

            {/* New Customer Dialog */}
            <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Register Customer</DialogTitle>
                        <DialogDescription>Add a new customer quickly</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Customer Name"
                            value={newCustomerData.name}
                            onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={newCustomerData.phone}
                            onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewCustomerDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setIsNewCustomerDialogOpen(false)}>Add Customer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Checkout Confirmation Dialog */}
            <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Review Order</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>LKR {cartCalculations.subtotal.toLocaleString()}</span>
                            </div>
                            {cartCalculations.totalDiscount > 0 && (
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Total Discount:</span>
                                    <span>-LKR {cartCalculations.totalDiscount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                                <span>Total:</span>
                                <span>LKR {cartCalculations.finalTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        {selectedPayment === "Credit" && isWalkIn && (
                            <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 p-3 flex gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-700 dark:text-amber-300 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                    Registered Customer is required for Credit transactions.
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCheckoutDialogOpen(false)}>
                            Continue Shopping
                        </Button>
                        <Button
                            onClick={handleCheckout}
                            disabled={!canCheckout}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                        >
                            Place Order & Print Invoice
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Cart & Checkout Component
interface CartCheckoutProps {
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

function CartCheckout({
    cart,
    calculations,
    isWalkIn,
    selectedPayment,
    selectedCustomerId,
    canCheckout,
    onUpdateQuantity,
    onRemove,
    onUpdatePrice,
    onToggleWalkIn,
    onSelectCustomer,
    onSelectPayment,
    onCheckout,
    onNewCustomer,
    isMobile = false,
    editingPriceId,
    editingPrice,
    onStartEditPrice,
    onStopEditPrice,
}: CartCheckoutProps) {
    return (
        <div className="flex flex-col h-full">
            {/* Customer Section */}
            <div className={`border-b border-border ${isMobile ? "p-4" : "p-4"}`}>
                <label className="flex items-center gap-3 cursor-pointer mb-3">
                    <input
                        type="checkbox"
                        checked={isWalkIn}
                        onChange={(e) => onToggleWalkIn(e.target.checked)}
                        className="h-4 w-4 rounded cursor-pointer"
                    />
                    <span className="text-sm font-medium text-foreground">Walk-In Customer (Anonymous)</span>
                </label>

                {!isWalkIn && (
                    <div className="flex gap-2">
                        <select
                            value={selectedCustomerId || ""}
                            onChange={(e) => onSelectCustomer(e.target.value || null)}
                            className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Select Customer...</option>
                            {MOCK_CUSTOMERS.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} ({c.phone})
                                </option>
                            ))}
                        </select>
                        <Button size="sm" onClick={onNewCustomer} className="px-3">
                            + New
                        </Button>
                    </div>
                )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>Cart is empty</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div key={item.productId} className="bg-background/50 rounded-lg border border-border/50 p-3">
                            {/* Item Header */}
                            <div className="flex justify-between items-start gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
                                    <p className="text-xs font-mono text-muted-foreground">{item.sku}</p>
                                </div>
                                <button
                                    onClick={() => onRemove(item.productId)}
                                    className="min-h-[32px] min-w-[32px] flex items-center justify-center hover:bg-destructive/10 rounded transition-colors"
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </button>
                            </div>

                            {/* Price Editing */}
                            <div className="space-y-1 mb-2">
                                {editingPriceId === item.productId && editingPrice !== undefined ? (
                                    <div className="flex gap-1">
                                        <input
                                            type="number"
                                            value={editingPrice}
                                            onChange={(e) => onStartEditPrice?.(item.productId, parseFloat(e.target.value) || 0)}
                                            className="flex-1 px-2 py-1 text-sm bg-background border border-primary rounded focus:outline-none"
                                            autoFocus
                                        />
                                        <button
                                            onClick={onStopEditPrice}
                                            className="min-h-[28px] min-w-[28px] flex items-center justify-center bg-green-600 text-white rounded text-xs"
                                        >
                                            <Check className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onStartEditPrice?.(item.productId, item.finalPrice)}
                                        className={`w-full text-left px-2 py-1 rounded text-sm font-bold flex items-center justify-between group ${item.isDiscounted
                                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                                : "bg-primary/10 text-primary"
                                            }`}
                                    >
                                        <span>LKR {item.finalPrice.toLocaleString()}</span>
                                        {item.isDiscounted && (
                                            <span className="text-xs font-semibold">Adjusted</span>
                                        )}
                                        <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                )}
                                <p className="text-xs text-muted-foreground">Base: LKR {item.basePrice.toLocaleString()}</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-semibold">Qty</span>
                                <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                                    <button
                                        onClick={() => onUpdateQuantity(item.productId, -1)}
                                        className="min-h-[28px] min-w-[28px] flex items-center justify-center hover:bg-primary/20 rounded transition-colors"
                                    >
                                        <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="min-w-[24px] text-center text-sm font-semibold">{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.productId, 1)}
                                        className="min-h-[28px] min-w-[28px] flex items-center justify-center hover:bg-primary/20 rounded transition-colors"
                                    >
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Totals & Checkout */}
            {cart.length > 0 && (
                <div className="border-t border-border bg-card/80 backdrop-blur p-4 space-y-4">
                    <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal:</span>
                            <span>LKR {calculations.subtotal.toLocaleString()}</span>
                        </div>
                        {calculations.totalDiscount > 0 && (
                            <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                                <span>Discount:</span>
                                <span>-LKR {calculations.totalDiscount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                            <span>Total:</span>
                            <span className="text-primary text-lg">LKR {calculations.finalTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-2">Payment Method</label>
                        <div className={`grid gap-2 ${isMobile ? "grid-cols-3" : "grid-cols-3"}`}>
                            {PAYMENT_METHODS.map((method) => (
                                <button
                                    key={method}
                                    onClick={() => onSelectPayment(method)}
                                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-all min-h-[40px] ${selectedPayment === method
                                            ? "bg-primary text-primary-foreground ring-1 ring-primary"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                        }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Credit Validation Alert */}
                    {selectedPayment === "Credit" && isWalkIn && (
                        <div className="rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 p-2.5 flex gap-2">
                            <AlertCircle className="h-4 w-4 text-red-700 dark:text-red-300 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                                Registered Customer required for Credit transactions.
                            </p>
                        </div>
                    )}

                    {/* Checkout Button */}
                    <Button
                        onClick={onCheckout}
                        disabled={!canCheckout}
                        className={`w-full min-h-[44px] font-bold gap-2 ${!canCheckout ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        <DollarSign className="h-5 w-5" />
                        Place Order & Print Invoice
                    </Button>
                </div>
            )}
        </div>
    )
}
