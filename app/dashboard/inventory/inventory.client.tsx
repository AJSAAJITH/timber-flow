"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Category, StockLog, BranchOption, CatalogProductOption } from "@/lib/types";
import {
    Building2,
    Package,
    FolderTree,
    History
} from "lucide-react";

import BranchStockView from "@/components/inventory/branch-stock/branch-stock-view";
import ProductMasterView from "@/components/inventory/product-master/products-master-view";
import { CategoryManager } from "@/components/inventory/categories-stock-logs/category-manager";
import { StockLogsViewer } from "@/components/inventory/categories-stock-logs/stock-logs-viewer";

interface InventoryClientPageProps {
    initialBranches: BranchOption[];
    initialCatalogProducts: CatalogProductOption[];
    categories?: Category[];
    initialLogs?: StockLog[];
}

type TabType = "branch-stock" | "products" | "categories" | "logs";

export default function InventoryClientPage({
    initialBranches = [],
    initialCatalogProducts = [],
    categories = [],
    initialLogs = []
}: InventoryClientPageProps) {
    const { user } = useUser();
    const currentUserId = user?.id || "clerk_user_id";

    // Active Tab State
    const [activeTab, setActiveTab] = useState<TabType>("branch-stock");

    // Local State for CategoryManager (If local mutation is needed)
    const [categoriesList, setCategoriesList] = useState<Category[]>(categories);

    return (
        <div className="space-y-6 p-4 sm:p-6 max-w-[1400px] mx-auto">
            {/* Header & Subtitle */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
                <p className="text-sm text-muted-foreground">
                    Manage branch stocks, master catalog products, categories, and inventory audit logs.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border space-x-1 sm:space-x-2 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("branch-stock")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "branch-stock"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        }`}
                >
                    <Building2 className="w-4 h-4" />
                    Branch Stock
                </button>

                <button
                    onClick={() => setActiveTab("products")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "products"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        }`}
                >
                    <Package className="w-4 h-4" />
                    Products Catalog ({initialCatalogProducts.length})
                </button>

                <button
                    onClick={() => setActiveTab("categories")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "categories"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        }`}
                >
                    <FolderTree className="w-4 h-4" />
                    Categories ({categories.length})
                </button>

                <button
                    onClick={() => setActiveTab("logs")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "logs"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        }`}
                >
                    <History className="w-4 h-4" />
                    Logs & History
                </button>
            </div>

            {/* TAB CONTENT SECTIONS */}

            {/* TAB 1: BRANCH STOCK */}
            {activeTab === "branch-stock" && (
                <div className="animate-in fade-in-50 duration-200">
                    <BranchStockView
                        branches={initialBranches}
                        catalogProducts={initialCatalogProducts}
                        currentUserId={currentUserId}
                    />
                </div>
            )}

            {/* TAB 2: PRODUCTS CATALOG */}
            {activeTab === "products" && (
                <div className="animate-in fade-in-50 duration-200">
                    <ProductMasterView categories={categories} />
                </div>
            )}

            {/* TAB 3: CATEGORIES */}
            {activeTab === "categories" && (
                <div className="animate-in fade-in-50 duration-200 max-w-2xl">
                    <CategoryManager
                        categories={categoriesList}
                        setCategories={setCategoriesList}
                    />
                </div>
            )}

            {/* TAB 4: LOGS & HISTORY */}
            {activeTab === "logs" && (
                <div className="animate-in fade-in-50 duration-200">
                    <StockLogsViewer logs={initialLogs} />
                </div>
            )}
        </div>
    );
}