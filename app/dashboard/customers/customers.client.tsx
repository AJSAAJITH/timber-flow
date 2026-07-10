"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
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
    History,
    DollarSign,
    Trash2,
    AlertCircle,
    Phone,
    MessageCircle,
    AlertTriangle,
} from "lucide-react"

// Types
interface Customer {
    id: string
    name: string
    phone: string
    nic: string
    address: string
    totalDue: number
    registeredDate: string
    lastTransaction?: string
}

// Mock Customers Data
const MOCK_CUSTOMERS: Customer[] = [
    {
        id: "1",
        name: "Roshan Kumar",
        phone: "+94 777 123456",
        nic: "123456789V",
        address: "123 Main Street, Colombo 3",
        totalDue: 45000,
        registeredDate: "2024-01-10",
        lastTransaction: "2024-07-05",
    },
    {
        id: "2",
        name: "Priya Perera",
        phone: "+94 765 234567",
        nic: "987654321V",
        address: "45 Hill Road, Negombo",
        totalDue: 0,
        registeredDate: "2024-02-15",
        lastTransaction: "2024-07-04",
    },
    {
        id: "3",
        name: "Anura Silva",
        phone: "+94 712 345678",
        nic: "",
        address: "78 Beach Lane, Galle",
        totalDue: 28500,
        registeredDate: "2024-03-20",
        lastTransaction: "2024-07-02",
    },
    {
        id: "4",
        name: "Nimal Jayasuriya",
        phone: "+94 758 456789",
        nic: "456789123V",
        address: "Kandy District",
        totalDue: 62000,
        registeredDate: "2024-04-05",
        lastTransaction: "2024-07-03",
    },
    {
        id: "5",
        name: "Lakshmi Wijesinghe",
        phone: "+94 721 567890",
        nic: "654321987V",
        address: "Matara City Center",
        totalDue: 0,
        registeredDate: "2024-04-18",
        lastTransaction: "2024-07-05",
    },
    {
        id: "6",
        name: "Keshan Bandara",
        phone: "+94 745 678901",
        nic: "",
        address: "-",
        totalDue: 15500,
        registeredDate: "2024-05-01",
        lastTransaction: "2024-07-01",
    },
    {
        id: "7",
        name: "Samantha De Silva",
        phone: "+94 767 789012",
        nic: "321654987V",
        address: "Jaffna Commercial Zone",
        totalDue: 38000,
        registeredDate: "2024-05-12",
        lastTransaction: "2024-06-30",
    },
    {
        id: "8",
        name: "Rajiv Menon",
        phone: "+94 770 890123",
        nic: "789123456V",
        address: "Colombo 5",
        totalDue: 0,
        registeredDate: "2024-05-25",
        lastTransaction: "2024-07-05",
    },
]

export default function CustomersClientPage() {
    const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS)
    const [searchQuery, setSearchQuery] = useState("")
    const [showDebtorsOnly, setShowDebtorsOnly] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [creditPayment, setCreditPayment] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        nic: "",
        address: "",
    })

    // Filter customers
    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) => {
            const matchesSearch =
                customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.phone.includes(searchQuery) ||
                customer.nic.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesDebtors = !showDebtorsOnly || customer.totalDue > 0
            return matchesSearch && matchesDebtors
        })
    }, [searchQuery, showDebtorsOnly, customers])

    // Get top debtors for Quick Reach section
    const topDebtors = useMemo(() => {
        return customers
            .filter((c) => c.totalDue > 0)
            .sort((a, b) => b.totalDue - a.totalDue)
            .slice(0, 5)
    }, [customers])

    // Calculate stats
    const stats = useMemo(() => {
        const totalCustomers = customers.length
        const debtorCount = customers.filter((c) => c.totalDue > 0).length
        const totalDue = customers.reduce((sum, c) => sum + c.totalDue, 0)

        return { totalCustomers, debtorCount, totalDue }
    }, [customers])

    // Add new customer
    const handleAddCustomer = () => {
        if (!formData.name.trim()) return

        const newCustomer: Customer = {
            id: Date.now().toString(),
            ...formData,
            totalDue: 0,
            registeredDate: new Date().toISOString().split("T")[0],
        }
        setCustomers([...customers, newCustomer])
        setIsAddDialogOpen(false)
        setFormData({ name: "", phone: "", nic: "", address: "" })
    }

    // Record credit payment
    const handleRecordPayment = () => {
        if (!selectedCustomer || !creditPayment) return

        const paymentAmount = parseFloat(creditPayment)
        if (paymentAmount <= 0) return

        setCustomers(
            customers.map((c) =>
                c.id === selectedCustomer.id
                    ? { ...c, totalDue: Math.max(0, c.totalDue - paymentAmount) }
                    : c
            )
        )
        setIsCreditDialogOpen(false)
        setCreditPayment("")
        setSelectedCustomer(null)
    }

    // Delete customer
    const handleDeleteCustomer = (customerId: string) => {
        setCustomers(customers.filter((c) => c.id !== customerId))
        setIsDeleteDialogOpen(false)
        setSelectedCustomer(null)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="border-b border-border bg-card/50 p-4 sm:p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Customer Management
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage customer profiles and credit balances
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="min-h-[44px] w-full sm:w-auto gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Register Customer
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-border bg-background/50 p-4">
                        <p className="text-sm font-medium text-muted-foreground">
                            Total Customers
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                            {stats.totalCustomers}
                        </p>
                    </div>
                    <div className="rounded-lg border border-border bg-background/50 p-4">
                        <p className="text-sm font-medium text-muted-foreground">
                            Active Debtors
                        </p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {stats.debtorCount}
                        </p>
                    </div>
                    <div className="rounded-lg border border-border bg-background/50 p-4">
                        <p className="text-sm font-medium text-muted-foreground">
                            Total Outstanding
                        </p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                            LKR {stats.totalDue.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 md:p-8 space-y-8">
                {/* Quick Reach: Outstanding Balances */}
                {topDebtors.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            <h2 className="text-lg font-bold text-foreground">
                                Quick Reach: Outstanding Balances
                            </h2>
                        </div>

                        {/* Debtors Carousel/Grid */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {topDebtors.map((customer) => (
                                <div
                                    key={customer.id}
                                    className="rounded-lg border border-amber-200 dark:border-amber-900/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="space-y-3">
                                        {/* Customer Name */}
                                        <p className="font-semibold text-foreground truncate text-sm sm:text-base">
                                            {customer.name}
                                        </p>

                                        {/* Outstanding Amount - Prominent */}
                                        <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-2.5">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                                Due Amount
                                            </p>
                                            <p className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-300">
                                                LKR {customer.totalDue.toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Phone Number */}
                                        <p className="text-xs sm:text-sm text-muted-foreground font-mono">
                                            {customer.phone}
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-2">
                                            <button className="flex-1 min-h-[36px] flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs sm:text-sm font-medium transition-colors active:scale-95">
                                                <Phone className="h-3.5 w-3.5" />
                                                Call
                                            </button>
                                            <button className="flex-1 min-h-[36px] flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm font-medium transition-colors active:scale-95">
                                                <MessageCircle className="h-3.5 w-3.5" />
                                                Message
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                    <div className="flex-1">
                        <label className="text-xs font-semibold text-muted-foreground">
                            Search
                        </label>
                        <div className="relative mt-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by name, phone, or NIC..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 min-h-[44px]">
                        <input
                            type="checkbox"
                            id="debtors-only"
                            checked={showDebtorsOnly}
                            onChange={(e) => setShowDebtorsOnly(e.target.checked)}
                            className="h-4 w-4 rounded border-border cursor-pointer"
                        />
                        <label
                            htmlFor="debtors-only"
                            className="text-sm font-medium text-foreground cursor-pointer"
                        >
                            Show Debtors Only
                        </label>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {filteredCustomers.map((customer) => (
                        <div
                            key={customer.id}
                            className={`rounded-lg border bg-card p-4 transition-all ${customer.totalDue > 0
                                ? "border-amber-200 dark:border-amber-900/30 bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/10"
                                : "border-border"
                                }`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground truncate">
                                        {customer.name}
                                    </p>
                                    <p className="text-xs font-mono text-muted-foreground">
                                        {customer.phone}
                                    </p>
                                </div>

                                {/* Actions Menu */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="min-h-[36px] min-w-[36px] flex items-center justify-center hover:bg-secondary rounded transition-colors active:scale-95 flex-shrink-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent align="end" className="w-48 p-0">
                                        <div className="flex flex-col">
                                            <button className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors">
                                                <Edit2 className="h-4 w-4" />
                                                Edit Profile
                                            </button>
                                            <button className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors">
                                                <History className="h-4 w-4" />
                                                Purchase History
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedCustomer(customer)
                                                    setIsCreditDialogOpen(true)
                                                }}
                                                className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors"
                                            >
                                                <DollarSign className="h-4 w-4" />
                                                Record Payment
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedCustomer(customer)
                                                    setIsDeleteDialogOpen(true)
                                                }}
                                                className="px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors border-t border-border"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Customer Details */}
                            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                                {customer.nic && (
                                    <div>
                                        <p className="text-muted-foreground">NIC</p>
                                        <p className="font-medium text-foreground">{customer.nic}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-muted-foreground">Status</p>
                                    <div className="mt-1">
                                        {customer.totalDue > 0 ? (
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                                                Has Outstanding
                                            </span>
                                        ) : (
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                                Clear
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Due Amount */}
                            {customer.totalDue > 0 && (
                                <div className="bg-red-100/50 dark:bg-red-900/20 rounded p-2 mb-3">
                                    <p className="text-xs text-muted-foreground">Total Due</p>
                                    <p className="text-lg font-bold text-red-700 dark:text-red-300">
                                        LKR {customer.totalDue.toLocaleString()}
                                    </p>
                                </div>
                            )}

                            {/* Footer */}
                            <p className="text-xs text-muted-foreground">
                                Registered: {new Date(customer.registeredDate).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-border bg-secondary/50">
                                <TableHead className="h-12">Name</TableHead>
                                <TableHead className="h-12">Phone</TableHead>
                                <TableHead className="h-12">NIC</TableHead>
                                <TableHead className="h-12">Address</TableHead>
                                <TableHead className="h-12 text-right">Total Due</TableHead>
                                <TableHead className="h-12 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCustomers.map((customer) => (
                                <TableRow
                                    key={customer.id}
                                    className="border-b border-border hover:bg-secondary/30 transition-colors"
                                >
                                    <TableCell className="py-3 font-medium text-foreground">
                                        {customer.name}
                                    </TableCell>

                                    <TableCell className="py-3 text-sm font-mono text-muted-foreground">
                                        {customer.phone}
                                    </TableCell>

                                    <TableCell className="py-3 text-sm text-muted-foreground">
                                        {customer.nic || "-"}
                                    </TableCell>

                                    <TableCell className="py-3 text-sm text-muted-foreground max-w-xs truncate">
                                        {customer.address || "-"}
                                    </TableCell>

                                    <TableCell
                                        className={`py-3 text-right font-semibold ${customer.totalDue > 0
                                            ? "text-red-700 dark:text-red-300"
                                            : "text-green-700 dark:text-green-300"
                                            }`}
                                    >
                                        {customer.totalDue > 0
                                            ? `LKR ${customer.totalDue.toLocaleString()}`
                                            : "Clear"}
                                    </TableCell>

                                    <TableCell className="py-3 text-right">
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
                                                        Edit Profile
                                                    </button>
                                                    <button className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors">
                                                        <History className="h-4 w-4" />
                                                        Purchase History
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCustomer(customer)
                                                            setIsCreditDialogOpen(true)
                                                        }}
                                                        className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors"
                                                    >
                                                        <DollarSign className="h-4 w-4" />
                                                        Record Payment
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCustomer(customer)
                                                            setIsDeleteDialogOpen(true)
                                                        }}
                                                        className="px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors border-t border-border"
                                                    >
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

                {filteredCustomers.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-12 text-center">
                        <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                            {searchQuery || showDebtorsOnly
                                ? "No customers found matching your criteria"
                                : "No customers registered yet"}
                        </p>
                    </div>
                )}
            </div>

            {/* Register/Update Customer Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Register New Customer</DialogTitle>
                        <DialogDescription>
                            Add a new customer to your system
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter customer name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="e.g., +94 777 123456"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                }
                                className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">
                                NIC Number
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 123456789V"
                                value={formData.nic}
                                onChange={(e) =>
                                    setFormData({ ...formData, nic: e.target.value })
                                }
                                className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Billing/Delivery Address
                            </label>
                            <textarea
                                placeholder="Enter customer address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({ ...formData, address: e.target.value })
                                }
                                className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary min-h-24 resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAddCustomer}>Register Customer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Record Credit Payment Dialog */}
            <Dialog open={isCreditDialogOpen} onOpenChange={setIsCreditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Record Credit Payment</DialogTitle>
                        <DialogDescription>
                            Record a payment for {selectedCustomer?.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="rounded-lg border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20 p-4">
                            <p className="text-sm text-muted-foreground">Current Due Amount</p>
                            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">
                                LKR {selectedCustomer?.totalDue.toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Payment Amount (LKR) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Enter payment amount"
                                value={creditPayment}
                                onChange={(e) => setCreditPayment(e.target.value)}
                                className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsCreditDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRecordPayment}
                            disabled={!creditPayment || parseFloat(creditPayment) <= 0}
                        >
                            Record Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            Delete Customer
                        </DialogTitle>
                    </DialogHeader>

                    <p className="text-muted-foreground">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-foreground">
                            {selectedCustomer?.name}
                        </span>
                        ? This action cannot be undone.
                    </p>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() =>
                                selectedCustomer && handleDeleteCustomer(selectedCustomer.id)
                            }
                        >
                            Delete Customer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
