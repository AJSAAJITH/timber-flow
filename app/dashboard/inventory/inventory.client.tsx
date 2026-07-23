"use client"

import React, { useState } from "react"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Category, StockItem, StockLog } from "@/lib/types"
import { MOCK_CATEGORIES, MOCK_LOGS, MOCK_STOCK } from "@/lib/constants"
import { BranchStockView } from "@/components/inventory/branch-stock/branch-stock-view"
import ProductMasterView from "@/components/inventory/product-master/products-master-view"
import Ctgories_Stock_Logs from "@/components/inventory/categories-stock-logs/categories-stock-log-view"


export default function InventoryClientPage() {
    // Shared Application State
    const [stockItems, setStockItems] = useState<StockItem[]>(MOCK_STOCK)
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)
    const [logs, setLogs] = useState<StockLog[]>(MOCK_LOGS)

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="border-b border-border bg-card/50 p-4 sm:p-6 md:p-8">
                <h1 className="text-3xl font-bold text-foreground">Inventory & Product Management</h1>
                <p className="mt-1 text-muted-foreground">
                    Manage branch stock, products, and track inventory movements
                </p>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8">
                <Tabs defaultValue="stock" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="stock">Branch Stock</TabsTrigger>
                        <TabsTrigger value="products">Product Catalog</TabsTrigger>
                        <TabsTrigger value="categories">Categories & Logs</TabsTrigger>
                    </TabsList>

                    {/* TAB 1: Branch Stock */}
                    <TabsContent value="stock" className="space-y-6 mt-6">
                        <BranchStockView />
                    </TabsContent>

                    {/* TAB 2: Product Master Catalog */}
                    <TabsContent value="products" className="space-y-6 mt-6">
                        <ProductMasterView />
                    </TabsContent>

                    {/* TAB 3: Categories & Stock Logs */}
                    <TabsContent value="categories" className="space-y-6 mt-6">
                        <Ctgories_Stock_Logs
                            categories={categories}
                            setCategories={setCategories}
                            logs={logs}
                            setLogs={setLogs}
                            stockItems={stockItems}
                            setStockItems={setStockItems}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}