// app/dashboard/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { DashboardData } from "@/lib/types";
import { actionError, actionSuccess } from "@/lib/types/action-response";
import { ActionResult } from "@/lib/types/action-result";
import { unstable_cache } from "next/cache";

// Internal Query Function with Payload Optimization
async function fetchDashboardMetricsFromDB(branchId: string): Promise<DashboardData> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const branchWhere = branchId !== "ALL" ? { branchId } : {};

    // Parallel Query Execution
    const [
        todaySalesAggregate,
        pendingSalesAggregate,
        todayIssuedItemsAggregate,
        recentSales,
    ] = await Promise.all([
        // Query 1: Today Sales Aggregate
        prisma.sale.aggregate({
            where: {
                ...branchWhere,
                createdAt: { gte: startOfToday, lte: endOfToday },
            },
            _sum: { totalAmount: true },
            _count: { id: true },
        }),

        // Query 2: Pending/Partially Paid Aggregate
        prisma.sale.aggregate({
            where: {
                ...branchWhere,
                paymentStatus: { in: ["PENDING", "PARTIALLY_PAID"] },
            },
            _sum: { dueAmount: true },
            _count: { id: true },
        }),

        // Query 3: Stock Issued Aggregate
        prisma.saleItem.aggregate({
            where: {
                sale: {
                    ...branchWhere,
                    createdAt: { gte: startOfToday, lte: endOfToday },
                },
            },
            _sum: { quantity: true },
        }),

        // Query 4: Recent Sales List (🔥 Payload Optimized using 'select' instead of 'include')
        prisma.sale.findMany({
            where: {
                ...branchWhere,
                createdAt: { gte: startOfToday, lte: endOfToday },
            },
            take: 10,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                invoiceNumber: true,
                createdAt: true,
                totalAmount: true,
                paidAmount: true,
                dueAmount: true,
                paymentStatus: true,
                customer: {
                    select: { name: true },
                },
                branch: {
                    select: { name: true },
                },
                items: {
                    select: {
                        quantity: true,
                        product: {
                            select: { name: true },
                        },
                    },
                },
            },
        }),
    ]);

    // Format Sales Data
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
            status: sale.paymentStatus as "PAID" | "PENDING" | "PARTIALLY_PAID",
        };
    });

    return {
        stats: {
            todayTotalSales: Number(todaySalesAggregate._sum.totalAmount || 0),
            todayInvoiceCount: todaySalesAggregate._count.id || 0,
            totalPendingDue: Number(pendingSalesAggregate._sum.dueAmount || 0),
            pendingInvoiceCount: pendingSalesAggregate._count.id || 0,
            todayStockIssuedUnits: todayIssuedItemsAggregate._sum.quantity || 0,
        },
        todaySales,
    };
}

// Next.js Cache Wrapper (Cache responses for 10 seconds per branch)
const getCachedDashboardMetrics = (branchId: string) =>
    unstable_cache(
        async () => fetchDashboardMetricsFromDB(branchId),
        [`dashboard-metrics-${branchId}`],
        { revalidate: 10, tags: ["dashboard", `dashboard-${branchId}`] }
    )();

export async function getDashboardMetrics(
    branchId: string
): Promise<ActionResult<DashboardData>> {
    try {
        const data = await getCachedDashboardMetrics(branchId);
        return actionSuccess(data);
    } catch (error) {
        console.error("Dashboard metrics fetch error:", error);
        return actionError(
            "Failed to fetch dashboard metrics.",
            "SERVER_ERROR"
        );
    }
}