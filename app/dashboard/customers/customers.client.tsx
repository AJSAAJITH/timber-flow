"use client"

import React, { useState, useMemo, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, Loader2 } from "lucide-react"

// Import Server Actions

import { CustomerFormValues } from "@/lib/validations/customer"

// Import Components
import { CustomerStats } from "@/components/customer-management/customer-stats"
import { QuickReachSection } from "@/components/customer-management/quick-reach"
import { CustomerTable } from "@/components/customer-management/customer-table"
import { AddCustomerDialog } from "@/components/customer-management/add-customer-dialog"
import { EditCustomerDialog } from "@/components/customer-management/edit-customer-dialog"
import { DeleteCustomerDialog } from "@/components/customer-management/delete-customer-dialog"
import { CreditPaymentDialog } from "@/components/customer-management/credit-payment-dialog"
import { createCustomer, deleteCustomer, getCustomers, recordCreditPayment, updateCustomer } from "@/actions/customer.action"

export default function CustomersClientPage() {
    // --- States ---
    const [customers, setCustomers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isPending, startTransition] = useTransition()

    const [searchQuery, setSearchQuery] = useState("")
    const [showDebtorsOnly, setShowDebtorsOnly] = useState(false)

    // Dialog States
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)

    // --- Initial Data Loading ---
    const fetchCustomers = async () => {
        setIsLoading(true)
        const result = await getCustomers()
        if (result.success) {
            setCustomers(result.data)
        } else {
            alert(result.error)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    // --- Search & Filter Logic ---
    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) => {
            const query = searchQuery.toLowerCase()
            const matchesSearch =
                customer.name.toLowerCase().includes(query) ||
                (customer.phone && customer.phone.includes(query)) ||
                (customer.nic && customer.nic.toLowerCase().includes(query))

            const matchesDebtors = !showDebtorsOnly || Number(customer.totalDue) > 0
            return matchesSearch && matchesDebtors
        })
    }, [searchQuery, showDebtorsOnly, customers])

    // --- Stats Calculation ---
    const stats = useMemo(() => ({
        totalCustomers: customers.length,
        debtorCount: customers.filter((c) => Number(c.totalDue) > 0).length,
        totalDue: customers.reduce((sum, c) => sum + Number(c.totalDue), 0),
    }), [customers])

    // --- Action Handlers ---

    // 1. Add Customer
    const handleAddCustomer = async (data: CustomerFormValues): Promise<boolean> => {
        const result = await createCustomer(data)
        if (result.success) {
            setCustomers((prev) => [result.data, ...prev])
            return true
        } else {
            alert(result.error)
            return false
        }
    }

    // 2. Edit Customer
    const handleEditCustomer = async (id: string, data: CustomerFormValues): Promise<boolean> => {
        const result = await updateCustomer(id, data)
        if (result.success) {
            setCustomers((prev) =>
                prev.map((c) => (c.id === id ? result.data : c))
            )
            return true
        } else {
            alert(result.error)
            return false
        }
    }

    // 3. Delete Customer
    const handleDelete = async () => {
        if (!selectedCustomer) return
        startTransition(async () => {
            const result = await deleteCustomer(selectedCustomer.id)
            if (result.success) {
                setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id))
                setIsDeleteDialogOpen(false)
                setSelectedCustomer(null)
            } else {
                alert(result.error)
            }
        })
    }

    // 4. Record Payment
    const handleRecordPayment = async (amount: number): Promise<boolean> => {
        if (!selectedCustomer) return false

        // Dummy values pass karala thiyenne - authentication system ekan real user/branch IDs align karagන්න
        const dummyBranchId = "branch-1"
        const dummyUserId = "user-1"

        const result = await recordCreditPayment(
            selectedCustomer.id,
            amount,
            dummyBranchId,
            dummyUserId
        )

        if (result.success) {
            setCustomers((prev) =>
                prev.map((c) => (c.id === selectedCustomer.id ? result.data : c))
            )
            return true
        } else {
            alert(result.error)
            return false
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
                    <QuickReachSection
                        customers={customers.filter((c) => Number(c.totalDue) > 0).slice(0, 5)}
                    />
                )}

                {/* Responsive Search & Filter Section */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                    <div className="flex-1">
                        <label className="text-xs font-semibold text-muted-foreground">Search</label>
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

                {/* Loading Spinner or Customer Table */}
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <CustomerTable
                        customers={filteredCustomers}
                        onEdit={(c: any) => {
                            setSelectedCustomer(c)
                            setIsEditDialogOpen(true)
                        }}
                        onDelete={(c: any) => {
                            setSelectedCustomer(c)
                            setIsDeleteDialogOpen(true)
                        }}
                        onPayment={(c: any) => {
                            setSelectedCustomer(c)
                            setIsCreditDialogOpen(true)
                        }}
                    />
                )}
            </div>

            {/* Dialogs */}
            <AddCustomerDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onAdd={handleAddCustomer}
            />

            <EditCustomerDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                customer={selectedCustomer}
                onUpdate={handleEditCustomer}
            />

            <DeleteCustomerDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                customer={selectedCustomer}
                onConfirm={handleDelete}
                isPending={isPending}
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