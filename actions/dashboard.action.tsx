// app/dashboard/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { DashboardData } from "@/lib/types";
import { actionError, actionSuccess } from "@/lib/types/action-response";
import { ActionResult } from "@/lib/types/action-result";

export async function getDashboardMetrics(
    branchId: string
): Promise<ActionResult<DashboardData>> {
    try {
        // 1. අද දිනට අදාළ Start සහ End Timestamps සෑදීම
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Branch Filter Condition
        const branchWhere = branchId !== "ALL" ? { branchId } : {};

        // Parallel Query Execution
        const [
            todaySalesAggregate,
            pendingSalesAggregate,
            todayIssuedItemsAggregate,
            recentSales,
        ] = await Promise.all([
            // Query 1: අද දින Total Sales & Invoice Count
            prisma.sale.aggregate({
                where: {
                    ...branchWhere,
                    createdAt: { gte: startOfToday, lte: endOfToday },
                },
                _sum: { totalAmount: true },
                _count: { id: true },
            }),

            // Query 2: Pending/Partially Paid Due Amounts
            prisma.sale.aggregate({
                where: {
                    ...branchWhere,
                    paymentStatus: { in: ["PENDING", "PARTIALLY_PAID"] },
                },
                _sum: { dueAmount: true },
                _count: { id: true },
            }),

            // Query 3: අද දින විකුණන ලද / නිකුත් කළ මුළු භාණ්ඩ ප්‍රමාණය (SaleItem aggregation)
            prisma.saleItem.aggregate({
                where: {
                    sale: {
                        ...branchWhere,
                        createdAt: { gte: startOfToday, lte: endOfToday },
                    },
                },
                _sum: { quantity: true },
            }),

            // Query 4: අද දින සිදු වූ Sales List (Top 10)
            prisma.sale.findMany({
                where: {
                    ...branchWhere,
                    createdAt: { gte: startOfToday, lte: endOfToday },
                },
                take: 10,
                orderBy: { createdAt: "desc" },
                include: {
                    customer: true,
                    branch: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            }),
        ]);

        // Formatted Today Sales List සකස් කිරීම
        const todaySales = recentSales.map((sale) => {
            const itemsSummary = sale.items
                .map((item) => `${item.product.name} (${item.quantity})`)
                .join(", ");

            return {
                id: sale.id,
                invoiceNumber: sale.invoiceNumber || `INV-${sale.id.slice(-5)}`,
                time: sale.createdAt.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }),
                customerName: sale.customer?.name || "Walk-in Customer",
                itemsSummary: itemsSummary || "No items listed",
                branchName: sale.branch.name,
                totalAmount: Number(sale.totalAmount),
                paidAmount: Number(sale.paidAmount),
                dueAmount: Number(sale.dueAmount),
                status: sale.paymentStatus,
            };
        });

        // Formatted Dashboard Object
        const dashboardData: DashboardData = {
            stats: {
                todayTotalSales: Number(todaySalesAggregate._sum.totalAmount || 0),
                todayInvoiceCount: todaySalesAggregate._count.id || 0,
                totalPendingDue: Number(pendingSalesAggregate._sum.dueAmount || 0),
                pendingInvoiceCount: pendingSalesAggregate._count.id || 0,
                todayStockIssuedUnits: todayIssuedItemsAggregate._sum.quantity || 0,
            },
            todaySales,
        };

        return actionSuccess(dashboardData);
    } catch (error) {
        console.error("Dashboard metrics fetch error:", error);
        return actionError(
            "Failed to fetch dashboard metrics.",
            "SERVER_ERROR"
        );
    }
}