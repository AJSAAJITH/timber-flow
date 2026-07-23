import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Product } from '@/lib/types'
import { Edit2, MoreVertical, Trash2 } from 'lucide-react'

interface MobileProductListProps {
    products: Product[];
}

export function MobileProductList({ products }: MobileProductListProps) {
    return (
        <div className="md:hidden space-y-3">
            {products.map((product) => (
                <div key={product.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground">{product.name}</p>
                            <p className="text-xs font-mono text-muted-foreground">{product.sku}</p>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="min-h-[36px] min-w-[36px] flex items-center justify-center hover:bg-secondary rounded transition-colors active:scale-95">
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-48 p-0">
                                <div className="flex flex-col">
                                    <button className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors">
                                        <Edit2 className="h-4 w-4" />
                                        Edit Product
                                    </button>
                                    <button className="px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors border-t border-border">
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-muted-foreground text-xs">Category</p>
                            <p className="font-medium text-foreground">{product.category}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">Unit Price</p>
                            <p className="font-bold text-primary">LKR {product.unitPrice.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}