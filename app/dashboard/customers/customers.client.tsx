"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react" // Search icon එක import කිරීමට වග බලා ගන්න
import { MOCK_CUSTOMERS } from "@/lib/constants"
import { Customer } from "@/lib/types"

// Import Components
import { CustomerStats } from "@/components/customer-management/customer-stats"
import { QuickReachSection } from "@/components/customer-management/quick-reach"
import { CustomerTable } from "@/components/customer-management/customer-table"
import { AddCustomerDialog } from "@/components/customer-management/add-customer-dialog"
import { DeleteCustomerDialog } from "@/components/customer-management/delete-customer-dialog"
import { CreditPaymentDialog } from "@/components/customer-management/credit-payment-dialog"

export default function CustomersClientPage() {
    // --- State Management ---
    const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS)
    const [searchQuery, setSearchQuery] = useState("")
    const [showDebtorsOnly, setShowDebtorsOnly] = useState(false)

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

    // --- Logic ---
    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) => {
            const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.phone.includes(searchQuery)
            const matchesDebtors = !showDebtorsOnly || customer.totalDue > 0
            return matchesSearch && matchesDebtors
        })
    }, [searchQuery, showDebtorsOnly, customers])

    const stats = useMemo(() => ({
        totalCustomers: customers.length,
        debtorCount: customers.filter((c) => c.totalDue > 0).length,
        totalDue: customers.reduce((sum, c) => sum + c.totalDue, 0)
    }), [customers])

    // --- Handlers ---
    const handleAddCustomer = (newCustomer: Omit<Customer, "id" | "totalDue" | "registeredDate">) => {
        const customerToAdd: Customer = {
            ...newCustomer,
            id: Date.now().toString(),
            totalDue: 0,
            registeredDate: new Date().toISOString().split("T")[0],
        }
        setCustomers([...customers, customerToAdd])
    }

    const handleDelete = () => {
        if (selectedCustomer) {
            setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id))
            setIsDeleteDialogOpen(false)
            setSelectedCustomer(null)
        }
    }

    const handleRecordPayment = (amount: number) => {
        if (selectedCustomer) {
            setCustomers(customers.map((c) =>
                c.id === selectedCustomer.id
                    ? { ...c, totalDue: Math.max(0, c.totalDue - amount) }
                    : c
            ))
            setIsCreditDialogOpen(false)
        }
    }

    return (
        <div className="min-h-screen bg-background p-4 sm:p-8">
            {/* Header & Stats */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
                        <p className="text-muted-foreground">Manage customer profiles and credit balances</p>
                    </div>
                    <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4 sm:mt-0">
                        <Plus className="mr-2 h-4 w-4" /> Register Customer
                    </Button>
                </div>
                <CustomerStats stats={stats} />
            </div>

            {/* Content Area */}
            <div className="space-y-8">
                {stats.debtorCount > 0 && (
                    <QuickReachSection customers={customers.filter(c => c.totalDue > 0).slice(0, 5)} />
                )}

                {/* Responsive Search & Filter Section */}
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

                <CustomerTable
                    customers={filteredCustomers}
                    onDelete={(c: Customer) => { setSelectedCustomer(c); setIsDeleteDialogOpen(true); }}
                    onPayment={(c: Customer) => { setSelectedCustomer(c); setIsCreditDialogOpen(true); }}
                />
            </div>

            {/* Dialogs */}
            <AddCustomerDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onAdd={handleAddCustomer}
            />

            <DeleteCustomerDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                customer={selectedCustomer}
                onConfirm={handleDelete}
            />

            <CreditPaymentDialog
                open={isCreditDialogOpen}
                onOpenChange={setIsCreditDialogOpen}
                customer={selectedCustomer}
                onConfirm={handleRecordPayment}
            />
        </div>
    )
}