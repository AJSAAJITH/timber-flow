// components/pos/CartItemList.tsx
"use client"

import { Plus, Minus, Trash2, Edit2, Check } from "lucide-react"
import { CartItem } from "../../types/pos.types"


interface CartItemListProps {
    cart: CartItem[]
    editingPriceId: string | null
    editingPrice: string
    onUpdateQuantity: (productId: string, delta: number) => void
    onRemove: (productId: string) => void
    onStartEditPrice: (id: string, price: number) => void
    onEditingPriceChange: (value: string) => void
    onStopEditPrice: () => void
}

export function CartItemList({
    cart,
    editingPriceId,
    editingPrice,
    onUpdateQuantity,
    onRemove,
    onStartEditPrice,
    onEditingPriceChange,
    onStopEditPrice,
}: CartItemListProps) {
    if (cart.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-4 text-muted-foreground">
                <p>Cart is empty</p>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map((item) => (
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

                    {/* Price Editing Section */}
                    <div className="space-y-1 mb-2">
                        {editingPriceId === item.productId ? (
                            <div className="flex gap-1">
                                <input
                                    type="number"
                                    value={editingPrice}
                                    onChange={(e) => onEditingPriceChange(e.target.value)}
                                    className="flex-1 px-2 py-1 text-sm bg-background border border-primary rounded focus:outline-none"
                                    autoFocus
                                />
                                <button
                                    onClick={onStopEditPrice}
                                    className="min-h-[28px] min-w-[28px] flex items-center justify-center bg-green-600 text-white rounded text-xs px-2"
                                >
                                    <Check className="h-3 w-3" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => onStartEditPrice(item.productId, item.finalPrice)}
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
            ))}
        </div>
    )
}