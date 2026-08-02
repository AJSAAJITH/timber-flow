"use server"

import { customerSchema, paymentSchema, CustomerFormValues } from "@/lib/validations/customer"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { ActionResult } from "@/lib/types/action-result"
import { actionError, actionSuccess } from "@/lib/types/action-response"

// Prisma Decimal එක Plain Number එකකට Convert කරන Helper Function එක (Null-Safe)
function formatCustomer(customer: any) {
    if (!customer) return null
    return {
        ...customer,
        totalDue: Number(customer.totalDue ?? 0),
    }
}

// 1. Get All Customers
export async function getCustomers(): Promise<ActionResult<any[]>> {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: { createdAt: "desc" },
        })

        // Decimal Object එක Plain Number එකට Map කරන්න
        const formattedCustomers = customers.map(formatCustomer)

        return actionSuccess(formattedCustomers)
    } catch (error) {
        console.error("Fetch Customers Error:", error)
        return actionError("Failed to load customers from database", "SERVER_ERROR")
    }
}

// 2. Register New Customer
export async function createCustomer(data: CustomerFormValues): Promise<ActionResult<any>> {
    const validated = customerSchema.safeParse(data)

    if (!validated.success) {
        return actionError("Validation failed", "VALIDATION_ERROR", validated.error.flatten().fieldErrors)
    }

    try {
        if (validated.data.nic) {
            const existing = await prisma.customer.findUnique({
                where: { nic: validated.data.nic },
            })
            if (existing) {
                return actionError("A customer with this NIC already exists", "VALIDATION_ERROR", {
                    nic: ["NIC already registered"],
                })
            }
        }

        const newCustomer = await prisma.customer.create({
            data: {
                name: validated.data.name,
                phone: validated.data.phone || null,
                nic: validated.data.nic || null,
                address: validated.data.address || null,
                totalDue: 0,
            },
        })

        revalidatePath("/dashboard/customers")
        return actionSuccess(formatCustomer(newCustomer), "Customer created successfully")
    } catch (error) {
        console.error("Create Customer Error:", error)
        return actionError("Failed to create customer", "SERVER_ERROR")
    }
}

// 3. Update Customer Profile
export async function updateCustomer(id: string, data: CustomerFormValues): Promise<ActionResult<any>> {
    const validated = customerSchema.safeParse(data)

    if (!validated.success) {
        return actionError("Validation failed", "VALIDATION_ERROR", validated.error.flatten().fieldErrors)
    }

    try {
        if (validated.data.nic) {
            const existing = await prisma.customer.findFirst({
                where: {
                    nic: validated.data.nic,
                    NOT: { id },
                },
            })
            if (existing) {
                return actionError("A customer with this NIC already exists", "VALIDATION_ERROR", {
                    nic: ["NIC belongs to another customer"],
                })
            }
        }

        const updatedCustomer = await prisma.customer.update({
            where: { id },
            data: {
                name: validated.data.name,
                phone: validated.data.phone || null,
                nic: validated.data.nic || null,
                address: validated.data.address || null,
            },
        })

        revalidatePath("/dashboard/customers")
        return actionSuccess(formatCustomer(updatedCustomer), "Customer updated successfully")
    } catch (error) {
        console.error("Update Customer Error:", error)
        return actionError("Failed to update customer", "SERVER_ERROR")
    }
}

// 4. Record Credit Payment
export async function recordCreditPayment(
    customerId: string,
    amountPaid: number,
    branchId: string,
    userId: string,
    note?: string
): Promise<ActionResult<any>> {
    const validated = paymentSchema.safeParse({ customerId, amountPaid, note })

    if (!validated.success) {
        return actionError("Invalid payment details", "VALIDATION_ERROR", validated.error.flatten().fieldErrors)
    }

    try {
        // 1. Valid Branch එකක් තිබේදැයි පරීක්ෂා කිරීම
        let validBranchId = branchId
        let validUserId = userId

        const branchExists = await prisma.branch.findUnique({ where: { id: branchId } })
        if (!branchExists) {
            const fallbackBranch = await prisma.branch.findFirst()
            if (!fallbackBranch) {
                return actionError("System එකෙහි Branch එකක් නොමැත. කරුණාකර පළමුව Branch එකක් සාදන්න.", "SERVER_ERROR")
            }
            validBranchId = fallbackBranch.id
        }

        // 2. Valid User කෙනෙක් තිබේදැයි පරීක්ෂා කිරීම
        const userExists = await prisma.user.findUnique({ where: { id: userId } })
        if (!userExists) {
            const fallbackUser = await prisma.user.findFirst()
            if (!fallbackUser) {
                return actionError("System එකෙහි User කෙනෙක් නොමැත.", "SERVER_ERROR")
            }
            validUserId = fallbackUser.id
        }

        // 3. Transaction එක run කිරීම
        const result = await prisma.$transaction(
            async (tx) => {
                const customer = await tx.customer.findUnique({ where: { id: customerId } })
                if (!customer) throw new Error("Customer not found")

                // 3.1 Credit Payment Log එකක් සෑදීම
                await tx.creditPaymentLog.create({
                    data: {
                        amountPaid,
                        note: note || "Credit Balance Payment",
                        customerId,
                        branchId: validBranchId,
                        userId: validUserId,
                    },
                })

                // 3.2 Customer ගේ නොපියවූ (Due) Sales ලබා ගැනීම (පරණම Sale එක මුලින්ම - FIFO)
                const pendingSales = await tx.sale.findMany({
                    where: {
                        customerId: customerId,
                        dueAmount: { gt: 0 },
                    },
                    orderBy: {
                        createdAt: "asc", // Oldest sales first
                    },
                })

                let remainingPayment = amountPaid

                // 3.3 එක් එක් Sale එක සඳහා Payment එක Apply කිරීම
                for (const sale of pendingSales) {
                    if (remainingPayment <= 0) break

                    const currentDue = Number(sale.dueAmount)
                    const currentPaid = Number(sale.paidAmount)

                    if (remainingPayment >= currentDue) {
                        // Sale එක සම්පූර්ණයෙන්ම ගෙවා නිමයි (PAID)
                        await tx.sale.update({
                            where: { id: sale.id },
                            data: {
                                paidAmount: currentPaid + currentDue,
                                dueAmount: 0,
                                paymentStatus: "PAID",
                            },
                        })
                        remainingPayment -= currentDue
                    } else {
                        // Sale එකෙන් කොටසක් පමණක් ගෙවයි (PARTIALLY_PAID)
                        await tx.sale.update({
                            where: { id: sale.id },
                            data: {
                                paidAmount: currentPaid + remainingPayment,
                                dueAmount: currentDue - remainingPayment,
                                paymentStatus: "PARTIALLY_PAID",
                            },
                        })
                        remainingPayment = 0
                    }
                }

                // 3.4 Customer ගේ totalDue column එක Update කිරීම
                const newTotalDue = Math.max(0, Number(customer.totalDue) - amountPaid)
                const updatedCustomer = await tx.customer.update({
                    where: { id: customerId },
                    data: { totalDue: newTotalDue },
                })

                return updatedCustomer
            },
            {
                maxWait: 5000,
                timeout: 10000,
            }
        )

        // 4. Client Pages revalidate කිරීම
        revalidatePath("/dashboard/customers")
        revalidatePath("/dashboard/sales")

        return actionSuccess(formatCustomer(result), "Payment recorded successfully")
    } catch (error: any) {
        console.error("Record Payment Error:", error)
        return actionError(error.message || "Failed to record payment", "SERVER_ERROR")
    }
}

// 5. Delete Customer
export async function deleteCustomer(id: string): Promise<ActionResult<void>> {
    try {
        const customer = await prisma.customer.findUnique({ where: { id } })
        if (!customer) return actionError("Customer not found", "NOT_FOUND")

        if (Number(customer.totalDue) > 0) {
            return actionError("Cannot delete customer with an outstanding balance", "FORBIDDEN")
        }

        await prisma.customer.delete({ where: { id } })

        revalidatePath("/dashboard/customers")
        return actionSuccess(undefined, "Customer deleted successfully")
    } catch (error) {
        console.error("Delete Customer Error:", error)
        return actionError("Failed to delete customer", "SERVER_ERROR")
    }
}