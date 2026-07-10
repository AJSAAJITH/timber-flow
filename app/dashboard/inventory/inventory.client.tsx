"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    AlertCircle,
    Wrench,
    TrendingDown,
    Package,
    Tag,
    Clock,
    ArrowUpRight,
    ArrowDownLeft,
    AlertTriangle,
    Minus,
} from "lucide-react"

// Types
interface StockItem {
    id: string
    productId: string
    productName: string
    sku: string
    category: string
    currentStock: number
    minStock: number
    branch: string
    lastUpdated: string
}

interface Product {
    id: string
    name: string
    sku: string
    category: string
    unitPrice: number
    createdDate: string
}

interface Category {
    id: string
    name: string
}

interface StockLog {
    id: string
    timestamp: string
    branch: string
    product: string
    logType: "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT" | "DAMAGE"
    quantity: number
    note: string
}

// Mock Data
const MOCK_BRANCHES = ["Main Branch", "Negombo Branch", "Galle Branch", "Kandy Branch"]

const MOCK_STOCK: StockItem[] = [
    {
        id: "1",
        productId: "p1",
        productName: "Standard Wood Pallets",
        sku: "WP-001",
        category: "Pallets",
        currentStock: 120,
        minStock: 100,
        branch: "Main Branch",
        lastUpdated: "2024-07-05",
    },
    {
        id: "2",
        productId: "p2",
        productName: "Treated Wood Boards",
        sku: "WB-002",
        category: "Boards",
        currentStock: 35,
        minStock: 50,
        branch: "Main Branch",
        lastUpdated: "2024-07-04",
    },
    {
        id: "3",
        productId: "p3",
        productName: "Plastic Pallets",
        sku: "PP-001",
        category: "Plastics",
        currentStock: 0,
        minStock: 30,
        branch: "Main Branch",
        lastUpdated: "2024-07-03",
    },
    {
        id: "4",
        productId: "p4",
        productName: "Metal Angles",
        sku: "MA-001",
        category: "Metal Items",
        currentStock: 450,
        minStock: 100,
        branch: "Main Branch",
        lastUpdated: "2024-07-05",
    },
    {
        id: "5",
        productId: "p5",
        productName: "Premium Wood Pallets",
        sku: "WP-003",
        category: "Pallets",
        currentStock: 250,
        minStock: 150,
        branch: "Main Branch",
        lastUpdated: "2024-07-05",
    },
]

const MOCK_PRODUCTS: Product[] = [
    {
        id: "p1",
        name: "Standard Wood Pallets",
        sku: "WP-001",
        category: "Pallets",
        unitPrice: 2500,
        createdDate: "2024-01-10",
    },
    {
        id: "p2",
        name: "Treated Wood Boards",
        sku: "WB-002",
        category: "Boards",
        unitPrice: 850,
        createdDate: "2024-01-15",
    },
    {
        id: "p3",
        name: "Plastic Pallets",
        sku: "PP-001",
        category: "Plastics",
        unitPrice: 1500,
        createdDate: "2024-02-01",
    },
    {
        id: "p4",
        name: "Metal Angles",
        sku: "MA-001",
        category: "Metal Items",
        unitPrice: 450,
        createdDate: "2024-02-15",
    },
    {
        id: "p5",
        name: "Premium Wood Pallets",
        sku: "WP-003",
        category: "Pallets",
        unitPrice: 3200,
        createdDate: "2024-03-01",
    },
]

const MOCK_CATEGORIES: Category[] = [
    { id: "c1", name: "Pallets" },
    { id: "c2", name: "Boards" },
    { id: "c3", name: "Plastics" },
    { id: "c4", name: "Metal Items" },
]

const MOCK_LOGS: StockLog[] = [
    {
        id: "l1",
        timestamp: "2024-07-05 14:30",
        branch: "Main Branch",
        product: "Standard Wood Pallets",
        logType: "STOCK_IN",
        quantity: 50,
        note: "Supplier delivery",
    },
    {
        id: "l2",
        timestamp: "2024-07-05 12:15",
        branch: "Main Branch",
        product: "Treated Wood Boards",
        logType: "STOCK_OUT",
        quantity: 25,
        note: "Customer order #2024-001",
    },
    {
        id: "l3",
        timestamp: "2024-07-04 09:45",
        branch: "Negombo Branch",
        product: "Metal Angles",
        logType: "ADJUSTMENT",
        quantity: -10,
        note: "Inventory correction",
    },
    {
        id: "l4",
        timestamp: "2024-07-04 08:20",
        branch: "Main Branch",
        product: "Plastic Pallets",
        logType: "DAMAGE",
        quantity: -5,
        note: "Damaged in transit",
    },
    {
        id: "l5",
        timestamp: "2024-07-03 16:00",
        branch: "Galle Branch",
        product: "Premium Wood Pallets",
        logType: "STOCK_IN",
        quantity: 100,
        note: "Transfer from warehouse",
    },
]

function getStockStatus(current: number, min: number): string {
    if (current === 0) return "Out of Stock"
    if (current <= min) return "Low Stock"
    return "In Stock"
}

function getStockStatusColor(current: number, min: number): string {
    if (current === 0) return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
    if (current <= min)
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
    return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
}

export default function InventoryClientPage() {
    const [stockItems, setStockItems] = useState<StockItem[]>(MOCK_STOCK)
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)
    const [logs, setLogs] = useState<StockLog[]>(MOCK_LOGS)

    // Tab 1: Branch Stock
    const [searchQueryStock, setSearchQueryStock] = useState("")
    const [selectedBranch, setSelectedBranch] = useState("Main Branch")
    const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false)
    const [selectedStock, setSelectedStock] = useState<StockItem | null>(null)
    const [adjustmentType, setAdjustmentType] = useState<"in" | "out">("in")
    const [adjustmentQty, setAdjustmentQty] = useState("")
    const [adjustmentNote, setAdjustmentNote] = useState("")

    // Tab 2: Product Master
    const [searchQueryProduct, setSearchQueryProduct] = useState("")
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
    const [newProduct, setNewProduct] = useState({
        name: "",
        sku: "",
        category: "Pallets",
        unitPrice: "",
    })

    // Tab 3: Categories
    const [newCategoryName, setNewCategoryName] = useState("")
    const [searchQueryLogs, setSearchQueryLogs] = useState("")

    // Filters
    const filteredStockItems = useMemo(() => {
        return stockItems.filter((item) => {
            const matchesSearch =
                item.productName.toLowerCase().includes(searchQueryStock.toLowerCase()) ||
                item.sku.toLowerCase().includes(searchQueryStock.toLowerCase())
            const matchesBranch = item.branch === selectedBranch
            return matchesSearch && matchesBranch
        })
    }, [searchQueryStock, selectedBranch, stockItems])

    const lowStockItems = useMemo(
        () => filteredStockItems.filter((item) => item.currentStock <= item.minStock),
        [filteredStockItems]
    )

    const filteredProducts = useMemo(() => {
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(searchQueryProduct.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchQueryProduct.toLowerCase())
        )
    }, [searchQueryProduct, products])

    const filteredLogs = useMemo(() => {
        return logs.filter((log) =>
            log.product.toLowerCase().includes(searchQueryLogs.toLowerCase())
        )
    }, [searchQueryLogs, logs])

    // Handlers
    const handleAdjustStock = () => {
        if (!selectedStock || !adjustmentQty) return

        const qty = parseInt(adjustmentQty)
        const newQty =
            adjustmentType === "in"
                ? selectedStock.currentStock + qty
                : Math.max(0, selectedStock.currentStock - qty)

        setStockItems(
            stockItems.map((item) =>
                item.id === selectedStock.id
                    ? { ...item, currentStock: newQty, lastUpdated: new Date().toISOString().split("T")[0] }
                    : item
            )
        )

        // Add log entry
        const logEntry: StockLog = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleString(),
            branch: selectedStock.branch,
            product: selectedStock.productName,
            logType: adjustmentType === "in" ? "STOCK_IN" : "ADJUSTMENT",
            quantity: adjustmentType === "in" ? qty : -qty,
            note: adjustmentNote || (adjustmentType === "in" ? "Stock received" : "Stock adjustment"),
        }
        setLogs([logEntry, ...logs])

        setIsAdjustDialogOpen(false)
        setSelectedStock(null)
        setAdjustmentQty("")
        setAdjustmentNote("")
    }

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
    }

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return

        const category: Category = {
            id: `c${Date.now()}`,
            name: newCategoryName,
        }
        setCategories([...categories, category])
        setNewCategoryName("")
    }

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
                        {/* Low Stock Alert */}
                        {lowStockItems.length > 0 && (
                            <div className="rounded-lg border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/10 p-4 flex gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-amber-900 dark:text-amber-100">
                                        Low Stock Alert
                                    </p>
                                    <p className="text-sm text-amber-800 dark:text-amber-200">
                                        {lowStockItems.length} item(s) below minimum stock level
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Search & Branch Selector */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-semibold text-muted-foreground">Search</label>
                                <div className="relative mt-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search by product name or SKU..."
                                        value={searchQueryStock}
                                        onChange={(e) => setSearchQueryStock(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground">Branch</label>
                                <select
                                    value={selectedBranch}
                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                    className="w-full sm:w-48 mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    {MOCK_BRANCHES.map((branch) => (
                                        <option key={branch}>{branch}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-3">
                            {filteredStockItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`rounded-lg border bg-card p-4 transition-opacity ${item.currentStock === 0 ? "opacity-60" : ""
                                        } ${item.currentStock <= item.minStock
                                            ? "border-amber-200 dark:border-amber-900/30 bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/10"
                                            : "border-border"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-foreground truncate">{item.productName}</p>
                                            <p className="text-xs font-mono text-muted-foreground">{item.sku}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedStock(item)
                                                setIsAdjustDialogOpen(true)
                                            }}
                                            className="min-h-[36px] min-w-[36px] flex items-center justify-center bg-primary text-primary-foreground rounded transition-colors active:scale-95"
                                        >
                                            <Wrench className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                                        <div className="bg-background/50 rounded p-2">
                                            <p className="text-muted-foreground">Current</p>
                                            <p className="font-bold text-lg text-foreground">{item.currentStock}</p>
                                        </div>
                                        <div className="bg-background/50 rounded p-2">
                                            <p className="text-muted-foreground">Minimum</p>
                                            <p className="font-bold text-lg text-foreground">{item.minStock}</p>
                                        </div>
                                        <div>
                                            <span
                                                className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStockStatusColor(
                                                    item.currentStock,
                                                    item.minStock
                                                )}`}
                                            >
                                                {getStockStatus(item.currentStock, item.minStock)}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-border bg-secondary/50">
                                        <TableHead className="h-12">Product Name</TableHead>
                                        <TableHead className="h-12">Category</TableHead>
                                        <TableHead className="h-12">SKU</TableHead>
                                        <TableHead className="h-12 text-center">Current Stock</TableHead>
                                        <TableHead className="h-12 text-center">Min Level</TableHead>
                                        <TableHead className="h-12">Status</TableHead>
                                        <TableHead className="h-12 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStockItems.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className={`border-b border-border hover:bg-secondary/30 transition-colors ${item.currentStock === 0 ? "opacity-60" : ""
                                                }`}
                                        >
                                            <TableCell className="font-medium text-foreground">
                                                {item.productName}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {item.category}
                                            </TableCell>
                                            <TableCell className="text-sm font-mono text-muted-foreground">
                                                {item.sku}
                                            </TableCell>
                                            <TableCell className="text-center font-semibold text-foreground">
                                                {item.currentStock}
                                            </TableCell>
                                            <TableCell className="text-center text-muted-foreground">
                                                {item.minStock}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStockStatusColor(
                                                        item.currentStock,
                                                        item.minStock
                                                    )}`}
                                                >
                                                    {getStockStatus(item.currentStock, item.minStock)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedStock(item)
                                                        setIsAdjustDialogOpen(true)
                                                    }}
                                                    className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                                                >
                                                    <Wrench className="h-4 w-4" />
                                                    Adjust
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* TAB 2: Product Master Catalog */}
                    <TabsContent value="products" className="space-y-6 mt-6">
                        {/* Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1">
                                <label className="text-xs font-semibold text-muted-foreground">Search</label>
                                <div className="relative mt-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQueryProduct}
                                        onChange={(e) => setSearchQueryProduct(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={() => setIsCreateProductOpen(true)}
                                className="min-h-[44px] w-full sm:w-auto gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Create Product
                            </Button>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-3">
                            {filteredProducts.map((product) => (
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

                        {/* Desktop Table */}
                        <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-border bg-secondary/50">
                                        <TableHead className="h-12">Product Name</TableHead>
                                        <TableHead className="h-12">SKU</TableHead>
                                        <TableHead className="h-12">Category</TableHead>
                                        <TableHead className="h-12 text-right">Unit Price (LKR)</TableHead>
                                        <TableHead className="h-12 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.id} className="border-b border-border hover:bg-secondary/30">
                                            <TableCell className="font-medium text-foreground">
                                                {product.name}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm text-muted-foreground">
                                                {product.sku || "-"}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {product.category}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-primary">
                                                LKR {product.unitPrice.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <button className="min-h-[36px] min-w-[36px] flex items-center justify-center hover:bg-secondary rounded transition-colors">
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
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* TAB 3: Categories & Stock Logs */}
                    <TabsContent value="categories" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Category Management */}
                            <div className="lg:col-span-1">
                                <div className="rounded-lg border border-border bg-card p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                                            <Tag className="h-5 w-5" />
                                            Categories
                                        </h3>
                                    </div>

                                    <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
                                        {categories.map((category) => (
                                            <div
                                                key={category.id}
                                                className="flex items-center justify-between gap-2 p-2 rounded hover:bg-secondary/50 group"
                                            >
                                                <span className="text-sm text-foreground">{category.name}</span>
                                                <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                                    <button className="min-h-[28px] min-w-[28px] flex items-center justify-center hover:bg-secondary rounded text-xs">
                                                        ✏️
                                                    </button>
                                                    <button className="min-h-[28px] min-w-[28px] flex items-center justify-center hover:bg-destructive/10 rounded text-xs text-destructive">
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="New category"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <Button
                                            onClick={handleAddCategory}
                                            size="sm"
                                            className="min-h-[40px] min-w-[40px] p-0"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Inventory Logs */}
                            <div className="lg:col-span-2">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground">Search Logs</label>
                                        <div className="relative mt-1">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="text"
                                                placeholder="Search by product..."
                                                value={searchQueryLogs}
                                                onChange={(e) => setSearchQueryLogs(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {filteredLogs.map((log) => (
                                            <div key={log.id} className="rounded-lg border border-border bg-card p-3">
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-foreground truncate">{log.product}</p>
                                                        <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                                                    </div>
                                                    <span
                                                        className={`inline-block px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${log.logType === "STOCK_IN"
                                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                                                : log.logType === "STOCK_OUT"
                                                                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                                                    : log.logType === "DAMAGE"
                                                                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                                                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                                            }`}
                                                    >
                                                        {log.logType === "STOCK_IN" && (
                                                            <>
                                                                <ArrowUpRight className="h-3 w-3 inline mr-1" />
                                                                STOCK IN
                                                            </>
                                                        )}
                                                        {log.logType === "STOCK_OUT" && (
                                                            <>
                                                                <ArrowDownLeft className="h-3 w-3 inline mr-1" />
                                                                STOCK OUT
                                                            </>
                                                        )}
                                                        {log.logType === "ADJUSTMENT" && (
                                                            <>
                                                                <Minus className="h-3 w-3 inline mr-1" />
                                                                ADJUSTMENT
                                                            </>
                                                        )}
                                                        {log.logType === "DAMAGE" && (
                                                            <>
                                                                <AlertCircle className="h-3 w-3 inline mr-1" />
                                                                DAMAGE
                                                            </>
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                                    <div>
                                                        <p className="text-muted-foreground">Branch</p>
                                                        <p className="font-medium text-foreground">{log.branch}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Quantity</p>
                                                        <p
                                                            className={`font-bold ${log.quantity > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                                                }`}
                                                        >
                                                            {log.quantity > 0 ? "+" : ""}{log.quantity}
                                                        </p>
                                                    </div>
                                                </div>

                                                {log.note && (
                                                    <p className="text-xs text-muted-foreground italic">"{log.note}"</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Adjust Stock Dialog */}
            <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Adjust Stock: {selectedStock?.productName}</DialogTitle>
                        <DialogDescription>
                            Record a stock in/out or adjustment for this product
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground">Current Stock</label>
                            <p className="text-2xl font-bold text-primary mt-1">{selectedStock?.currentStock}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">Adjustment Type</label>
                            <div className="flex gap-2 mt-1">
                                <button
                                    onClick={() => setAdjustmentType("in")}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${adjustmentType === "in"
                                            ? "bg-green-600 text-white"
                                            : "bg-secondary text-foreground hover:bg-secondary/80"
                                        }`}
                                >
                                    Stock In
                                </button>
                                <button
                                    onClick={() => setAdjustmentType("out")}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${adjustmentType === "out"
                                            ? "bg-red-600 text-white"
                                            : "bg-secondary text-foreground hover:bg-secondary/80"
                                        }`}
                                >
                                    Stock Out
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={adjustmentQty}
                                onChange={(e) => setAdjustmentQty(e.target.value)}
                                className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">Note</label>
                            <textarea
                                placeholder="Enter reason or note (optional)"
                                value={adjustmentNote}
                                onChange={(e) => setAdjustmentNote(e.target.value)}
                                className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary min-h-20 resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAdjustStock}
                            disabled={!adjustmentQty}
                            className={
                                adjustmentType === "in"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-red-600 hover:bg-red-700"
                            }
                        >
                            {adjustmentType === "in" ? "Stock In" : "Stock Out"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Product Dialog */}
            <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
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
                        <Button variant="outline" onClick={() => setIsCreateProductOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateProduct}>Create Product</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
