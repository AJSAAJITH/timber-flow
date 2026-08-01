"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import { ShoppingCart, Loader2, Store } from "lucide-react"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

// Context & Server Actions
import { useBranch } from "@/lib/branch-context"
import { createCustomer, getCustomers } from "@/actions/customer.action"
import { processPosCheckoutAction } from "@/actions/pos-actions"
import { getCategories } from "@/actions/inventory/category.action"

import { PAYMENT_METHODS } from "./data/posMockData"
import { CartItem, Product, Customer } from "./types/pos.types"
import { ProductCatalog } from "./components/pos/ProductCatalog"
import { CartCheckout } from "./components/pos/CartCheckout"

// Dialog Imports
import { CheckoutConfirmationDialog } from "./components/pos/dialogs/CheckoutConfirmationDialog"
import { NewCustomerDialog } from "./components/pos/dialogs/NewCustomerDialog"
import { getBranchInventory } from "@/actions/inventory/brach-stock.action"

export default function POSClientPage() {
    const { user, selectedBranchId } = useBranch()

    // Log වුන User හෝ Super Admin select කරපු Active Branch ID එක ලබා ගැනීම
    const activeBranchId = user?.role === "SUPER_ADMIN" ? selectedBranchId : (user?.branch?.id || selectedBranchId)

    // Local States
    const [cart, setCart] = useState<CartItem[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState("Cash")
    const [isWalkIn, setIsWalkIn] = useState(true)
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)

    // Real DB States
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<string[]>(["All"])
    const [customers, setCustomers] = useState<Customer[]>([])

    const [isLoadingData, setIsLoadingData] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false)
    const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false)
    const [editingPriceId, setEditingPriceId] = useState<string | null>(null)
    const [editingPrice, setEditingPrice] = useState("")
    const [newCustomerData, setNewCustomerData] = useState({ name: "", phone: "" })
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Active Branch එක වෙනස් වන විට (හෝ Load වන විට) Product Stock load කිරීම
    useEffect(() => {
        async function fetchBranchData() {
            if (!activeBranchId || activeBranchId === "ALL") {
                setProducts([])
                setIsLoadingData(false)
                return
            }

            try {
                setIsLoadingData(true)

                // Branch Inventory, Categories සහ Customers parallel ලෙස fetch කිරීම
                const [inventoryRes, categoriesRes, customersRes] = await Promise.all([
                    getBranchInventory(activeBranchId),
                    getCategories(),
                    getCustomers(),
                ])

                // 1. Process Categories
                if (categoriesRes.success && categoriesRes.data) {
                    const categoryNames = categoriesRes.data.map((c) => c.name)
                    setCategories(["All", ...categoryNames])
                } else if (!categoriesRes.success) {
                    toast.error(categoriesRes.error || "Failed to load categories")
                }

                // 2. Process Branch Inventory Products
                if (inventoryRes.success && inventoryRes.data) {
                    const mappedProducts: Product[] = inventoryRes.data.map((item) => ({
                        id: item.productId,
                        name: item.productName,
                        sku: item.sku || "N/A",
                        price: item.unitPrice,
                        category: item.categoryName || "Uncategorized",
                        stock: item.currentStock, // අදාළ Branch එකේ තියෙන Stock ප්‍රමාණය
                    }))
                    setProducts(mappedProducts)
                } else if (!inventoryRes.success) {
                    toast.error(inventoryRes.error || "Branch එකේ Stock දත්ත ලබා ගැනීමට නොහැකි විය")
                }

                // 3. Process Customers
                if (customersRes.success && customersRes.data) {
                    setCustomers(customersRes.data)
                }

            } catch (error) {
                console.error("Error loading POS initial data:", error)
                toast.error("Failed to load POS data from server")
            } finally {
                setIsLoadingData(false)
            }
        }

        fetchBranchData()
    }, [activeBranchId])

    // Dynamic product filtering
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [products, searchQuery, selectedCategory])

    // Cart calculations
    const cartCalculations = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + item.basePrice * item.quantity, 0)
        const finalTotal = cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0)
        const totalDiscount = subtotal - finalTotal
        return { subtotal, finalTotal, totalDiscount, count: cart.reduce((s, i) => s + i.quantity, 0) }
    }, [cart])

    // Checkout button state validation
    const canCheckout = useMemo(() => {
        const hasItems = cart.length > 0
        const hasValidBranch = Boolean(activeBranchId && activeBranchId !== "ALL")
        const isCreditInvalid = selectedPayment === "Credit" && isWalkIn
        return hasItems && hasValidBranch && !isCreditInvalid && !isSubmitting
    }, [cart.length, activeBranchId, selectedPayment, isWalkIn, isSubmitting])

    // Handlers
    const addToCart = (product: Product) => {
        if (product.stock <= 0) {
            toast.error("මෙම අයිතමය Stock එකෙහි නොමැත.")
            return
        }
        setCart((prev) => {
            const existing = prev.find((i) => i.productId === product.id)
            if (existing && existing.quantity >= product.stock) {
                toast.error("පවතින Stock ප්‍රමාණයට වඩා එකතු කළ නොහැක.")
                return prev
            }
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
            const product = products.find((p) => p.id === productId)
            return prev
                .map((item) => {
                    if (item.productId !== productId) return item
                    const newQty = item.quantity + delta
                    if (newQty <= 0) return null
                    if (product && newQty > product.stock) {
                        toast.error("පවතින Stock ප්‍රමාණයට වඩා එකතු කළ නොහැක.")
                        return item
                    }
                    return { ...item, quantity: newQty }
                })
                .filter((i): i is CartItem => i !== null)
        })
    }

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.productId !== productId))
    }

    // Checkout Handler
    const handleCheckout = async () => {
        if (isSubmitting) return

        if (!activeBranchId || activeBranchId === "ALL") {
            toast.error("Please select a specific Branch before completing the order.")
            return
        }

        if (selectedPayment === "Credit" && isWalkIn) {
            toast.error("Registered customer is required for Credit transactions.")
            return
        }

        try {
            setIsSubmitting(true)

            const payload = {
                branchId: activeBranchId,
                customerId: isWalkIn ? null : selectedCustomerId,
                isWalkIn,
                paymentMethod: selectedPayment,
                items: cart.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.basePrice,
                    discount: (item.basePrice - item.finalPrice) * item.quantity,
                })),
                calculations: {
                    subtotal: cartCalculations.subtotal,
                    totalDiscount: cartCalculations.totalDiscount,
                    finalTotal: cartCalculations.finalTotal,
                },
                userId: user?.id || "",
            }

            const res = await processPosCheckoutAction(payload)

            if (res.success) {
                toast.success("Order placed successfully!")
                setCart([])
                setIsCheckoutDialogOpen(false)

                // Checkout එකෙන් පසු Stock ප්‍රමාණය යාවත්කාලීන කිරීමට Inventory එක re-fetch කිරීම
                const inventoryRes = await getBranchInventory(activeBranchId)
                if (inventoryRes.success && inventoryRes.data) {
                    setProducts(inventoryRes.data.map((item) => ({
                        id: item.productId,
                        name: item.productName,
                        sku: item.sku || "N/A",
                        price: item.unitPrice,
                        category: item.categoryName || "Uncategorized",
                        stock: item.currentStock,
                    })))
                }

                if (window.innerWidth < 1024) setIsCartOpen(false)
            } else {
                toast.error(res.error || "Checkout failed. Please try again.")
            }
        } catch (error) {
            console.error("Checkout process error:", error)
            toast.error("Transaction error. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Customer Add Handler
    const handleAddCustomerSubmit = async () => {
        if (!newCustomerData.name.trim() || !newCustomerData.phone.trim()) {
            toast.error("Please enter customer name and phone number.")
            return
        }

        const res = await createCustomer(newCustomerData)

        if (!res.success) {
            toast.error(res.error || "Failed to register customer.")
            return
        }

        toast.success("Customer registered successfully!")

        if (res.data) {
            const createdCustomer: Customer = {
                id: res.data.id,
                name: res.data.name,
                phone: res.data.phone ?? "",
            }

            setCustomers((prev) => [...prev, createdCustomer])
            setSelectedCustomerId(res.data.id)
            setIsWalkIn(false)
            setNewCustomerData({ name: "", phone: "" })
            setIsNewCustomerDialogOpen(false)
        }
    }

    if (isLoadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground font-medium">Loading Branch Inventory...</p>
                </div>
            </div>
        )
    }

    // Super Admin විසින් Branch එකක් තෝරා නොමැති විට පෙන්වන UI එක
    if (!activeBranchId || activeBranchId === "ALL") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
                <Store className="h-12 w-12 text-muted-foreground mb-3" />
                <h2 className="text-xl font-bold">No Branch Selected</h2>
                <p className="text-sm text-muted-foreground max-w-md mt-1">
                    POS System එක භාවිතා කිරීමට කරුණාකර Top Navigation bar එකෙන් අදාළ Branch එක තෝරන්න.
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="grid grid-cols-1 lg:grid-cols-[1.85fr_1.15fr] gap-0 lg:h-screen">
                {/* Left: Product Catalog Component with Branch Stock Data */}
                <ProductCatalog
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    categories={categories}
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
                        customers={customers}
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
                        customers={customers}
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

            {/* Dialog Components */}
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