"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PaymentMethod, PaymentStatus, Customer, Sale } from "@prisma/client";
import { actionError, actionSuccess } from "@/lib/types/action-response";
import { ActionResult } from "@/lib/types/action-result";

export interface CreateCustomerInput {
    name: string;
    phone: string;
}

export interface CheckoutPayload {
    branchId: string;
    customerId?: string | null;
    isWalkIn: boolean;
    paymentMethod: string; // "Cash" | "Card" | "Credit" | "Bank Transfer"
    items: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
        discount: number;
    }>;
    calculations: {
        subtotal: number;
        totalDiscount: number;
        finalTotal: number;
    };
    userId: string; // Cashier / Admin ID
}

/**
 * 1. Register a new customer
 */
export async function createCustomerAction(data: CreateCustomerInput): Promise<ActionResult<Customer>> {
    try {
        if (!data.name.trim() || !data.phone.trim()) {
            return actionError("Customer name and phone number are required.", "VALIDATION_ERROR");
        }

        const customer = await prisma.customer.create({
            data: {
                name: data.name.trim(),
                phone: data.phone.trim(),
            },
        });

        return actionSuccess(customer, "Customer registered successfully");
    } catch (error: any) {
        console.error("Create Customer Error:", error);
        return actionError(error.message || "Failed to create customer.", "SERVER_ERROR");
    }
}

/**
 * 2. Process POS Checkout, Deduct Stock & Record Sale
 */
export async function processPosCheckoutAction(payload: CheckoutPayload): Promise<ActionResult<any>> {
    try {
        // Validation 1: Branch context check
        if (!payload.branchId || payload.branchId === "ALL") {
            return actionError("Please select a specific Branch before completing the order.", "VALIDATION_ERROR");
        }

        // Map String Payment Method to Prisma Enum
        let enumPaymentMethod: PaymentMethod = PaymentMethod.CASH;
        const normalizedPayment = payload.paymentMethod.toUpperCase().replace(/\s+/g, '_');

        if (normalizedPayment === "CREDIT") {
            enumPaymentMethod = PaymentMethod.CREDIT;
        } else if (normalizedPayment === "BANK_TRANSFER" || normalizedPayment === "CARD") {
            enumPaymentMethod = PaymentMethod.BANK_TRANSFER;
        }

        // Validation 2: Credit payment restriction for walk-ins
        if (enumPaymentMethod === PaymentMethod.CREDIT && (payload.isWalkIn || !payload.customerId)) {
            return actionError("Credit payment requires a registered customer.", "VALIDATION_ERROR");
        }

        // Calculate Amounts & Status based on Payment Method
        const isCredit = enumPaymentMethod === PaymentMethod.CREDIT;
        const totalAmount = payload.calculations.finalTotal;
        const paidAmount = isCredit ? 0 : totalAmount;
        const dueAmount = isCredit ? totalAmount : 0;
        const paymentStatus = isCredit ? PaymentStatus.PENDING : PaymentStatus.PAID;

        // Transaction with extended maxWait & timeout settings + Batch optimization
        const sale = await prisma.$transaction(
            async (tx) => {
                // A. Single Query to fetch all inventories for items in cart
                const productIds = payload.items.map((item) => item.productId);
                const inventories = await tx.branchInventory.findMany({
                    where: {
                        branchId: payload.branchId,
                        productId: { in: productIds },
                    },
                });

                const inventoryMap = new Map(
                    inventories.map((inv) => [inv.productId, inv])
                );

                // B. Validate stock for all items
                for (const item of payload.items) {
                    const inventory = inventoryMap.get(item.productId);
                    if (!inventory || inventory.stockLevel < item.quantity) {
                        throw new Error(`Insufficient stock for product ID: ${item.productId}`);
                    }
                }

                // C. Parallel updates for stock reduction
                await Promise.all(
                    payload.items.map((item) =>
                        tx.branchInventory.update({
                            where: {
                                branchId_productId: {
                                    branchId: payload.branchId,
                                    productId: item.productId,
                                },
                            },
                            data: {
                                stockLevel: { decrement: item.quantity },
                            },
                        })
                    )
                );

                // D. If Credit Transaction, Update Customer's totalDue
                if (isCredit && payload.customerId) {
                    await tx.customer.update({
                        where: { id: payload.customerId },
                        data: {
                            totalDue: { increment: dueAmount },
                        },
                    });
                }

                // E. Create Sale Record
                const createdSale = await tx.sale.create({
                    data: {
                        branchId: payload.branchId,
                        userId: payload.userId,
                        customerId: payload.isWalkIn ? null : payload.customerId,
                        paymentMethod: enumPaymentMethod,
                        paymentStatus: paymentStatus,
                        totalAmount: totalAmount,
                        paidAmount: paidAmount,
                        dueAmount: dueAmount,
                        items: {
                            create: payload.items.map((item) => {
                                const unitDiscount = item.quantity > 0 ? item.discount / item.quantity : 0;
                                return {
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    originalPrice: item.unitPrice,
                                    priceAtSale: item.unitPrice - unitDiscount,
                                };
                            }),
                        },
                    },
                    include: {
                        items: true,
                        customer: true,
                        branch: true,
                    },
                });

                return createdSale;
            },
            {
                maxWait: 10000,
                timeout: 20000,
            }
        );

        // Revalidate POS page
        revalidatePath("/dashboard/pos");

        // Prisma Decimal Objects -> Plain JS Numbers වලට Convert කිරීම (Next.js Client Component Serialization සඳහා)
        const formattedSale = {
            ...sale,
            totalAmount: Number(sale.totalAmount),
            paidAmount: Number(sale.paidAmount),
            dueAmount: Number(sale.dueAmount),
            items: sale.items.map((item) => ({
                ...item,
                originalPrice: Number(item.originalPrice),
                priceAtSale: Number(item.priceAtSale),
            })),
        };

        return actionSuccess(formattedSale, "Sale completed successfully!");
    } catch (error: any) {
        console.error("POS Checkout Error:", error);
        return actionError(error.message || "Transaction failed. Please try again.", "SERVER_ERROR");
    }
}