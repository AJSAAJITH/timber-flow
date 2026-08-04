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

// Helper Function
function formatCustomer(customer: any) {
    if (!customer) return null;
    return {
        ...customer,
        totalDue: Number(customer.totalDue ?? 0),
    };
}

export async function processPosCheckoutAction(payload: CheckoutPayload): Promise<ActionResult<any>> {
    try {
        if (!payload.branchId || payload.branchId === "ALL") {
            return actionError("Please select a specific Branch before completing the order.", "VALIDATION_ERROR");
        }

        let enumPaymentMethod: PaymentMethod = PaymentMethod.CASH;
        const normalizedPayment = payload.paymentMethod.toUpperCase().replace(/\s+/g, '_');

        if (normalizedPayment === "CREDIT") {
            enumPaymentMethod = PaymentMethod.CREDIT;
        } else if (normalizedPayment === "BANK_TRANSFER" || normalizedPayment === "CARD") {
            enumPaymentMethod = PaymentMethod.BANK_TRANSFER;
        }

        if (enumPaymentMethod === PaymentMethod.CREDIT && (payload.isWalkIn || !payload.customerId)) {
            return actionError("Credit payment requires a registered customer.", "VALIDATION_ERROR");
        }

        const isCredit = enumPaymentMethod === PaymentMethod.CREDIT;
        const totalAmount = payload.calculations.finalTotal;
        const paidAmount = isCredit ? 0 : totalAmount;
        const dueAmount = isCredit ? totalAmount : 0;
        const paymentStatus = isCredit ? PaymentStatus.PENDING : PaymentStatus.PAID;

        // Atomic Database Transaction
        const sale = await prisma.$transaction(
            async (tx) => {
                const productIds = payload.items.map((item) => item.productId);

                // 1. Fetch inventories for items in cart
                const inventories = await tx.branchInventory.findMany({
                    where: {
                        branchId: payload.branchId,
                        productId: { in: productIds },
                    },
                    select: { productId: true, stockLevel: true } // Performance optimization: select only required fields
                });

                const inventoryMap = new Map(
                    inventories.map((inv) => [inv.productId, inv.stockLevel])
                );

                // 2. Validate stock
                for (const item of payload.items) {
                    const currentStock = inventoryMap.get(item.productId) ?? 0;
                    if (currentStock < item.quantity) {
                        throw new Error(`Insufficient stock for product ID: ${item.productId}`);
                    }
                }

                // 3. Deduct stock concurrently
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

                // 4. Update Customer totalDue if Credit
                if (isCredit && payload.customerId) {
                    await tx.customer.update({
                        where: { id: payload.customerId },
                        data: { totalDue: { increment: dueAmount } },
                    });
                }

                // 5. Create Sale Record
                return await tx.sale.create({
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
            },
            {
                maxWait: 5000,
                timeout: 10000,
            }
        );


        const formattedSale = {
            ...sale,
            totalAmount: Number(sale.totalAmount),
            paidAmount: Number(sale.paidAmount),
            dueAmount: Number(sale.dueAmount),
            customer: sale.customer ? formatCustomer(sale.customer) : null,
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