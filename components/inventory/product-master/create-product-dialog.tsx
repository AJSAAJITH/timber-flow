import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Category } from '@/lib/types'

interface NewProductState {
    name: string;
    sku: string;
    category: string;
    unitPrice: string;
}

interface CreateProductDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    newProduct: NewProductState;
    setNewProduct: React.Dispatch<React.SetStateAction<NewProductState>>;
    categories: Category[];
    onSubmit: () => void;
}

export function CreateProductDialog({
    isOpen,
    onOpenChange,
    newProduct,
    setNewProduct,
    categories,
    onSubmit,
}: CreateProductDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Product</DialogTitle>
                    <DialogDescription>Add a new product to your catalog</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Premium Wood Pallets"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">SKU (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g., WP-001"
                            value={newProduct.sku}
                            onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">Category</label>
                        <select
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Unit Price (LKR) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            value={newProduct.unitPrice}
                            onChange={(e) => setNewProduct({ ...newProduct, unitPrice: e.target.value })}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={onSubmit}>Create Product</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}