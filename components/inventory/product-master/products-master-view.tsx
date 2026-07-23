import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/lib/constants'
import { Category, Product } from '@/lib/types'
import React, { useMemo, useState } from 'react'
import { ProductSearchHeader } from './product-search-header'
import { MobileProductList } from './mobile-product-list'
import { DesktopProductTable } from './desktop-product-table'
import { CreateProductDialog } from './create-product-dialog'

function ProductMasterView() {
    const [searchQueryProduct, setSearchQueryProduct] = useState("");
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [categories] = useState<Category[]>(MOCK_CATEGORIES);
    const [newProduct, setNewProduct] = useState({
        name: "",
        sku: "",
        category: "Pallets",
        unitPrice: "",
    });

    const filteredProducts = useMemo(() => {
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(searchQueryProduct.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchQueryProduct.toLowerCase())
        )
    }, [searchQueryProduct, products]);

    const handleCreateProduct = () => {
        if (!newProduct.name.trim()) return

        const product: Product = {
            id: `p${Date.now()}`,
            ...newProduct,
            unitPrice: parseFloat(newProduct.unitPrice) || 0,
            createdDate: new Date().toISOString().split("T")[0],
        }
        setProducts([...products, product])
        setIsCreateProductOpen(false)
        setNewProduct({ name: "", sku: "", category: "Pallets", unitPrice: "" })
    };

    return (
        <div className="space-y-6">
            <ProductSearchHeader
                searchQuery={searchQueryProduct}
                onSearchChange={setSearchQueryProduct}
                onCreateClick={() => setIsCreateProductOpen(true)}
            />

            <MobileProductList products={filteredProducts} />

            <DesktopProductTable products={filteredProducts} />

            <CreateProductDialog
                isOpen={isCreateProductOpen}
                onOpenChange={setIsCreateProductOpen}
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                categories={categories}
                onSubmit={handleCreateProduct}
            />
        </div>
    )
}

export default ProductMasterView