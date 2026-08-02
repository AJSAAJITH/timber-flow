// actions/sales.ts
"use server";

import { GetSalesResponse, SaleRecord, SalesFilterParams } from "@/app/dashboard/sales/types/sales.types";
import { Prisma } from "@prisma/client";
import { getAuthenticatedUser } from "./auth";
import prisma from "@/lib/prisma";
import { formatSaleDateTime } from "@/app/dashboard/sales/utils/sales-helpers";

export async function getSalesHistory(params: SalesFilterParams): Promise<GetSalesResponse> {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return {
                success: false,
                data: [],
                stats: { totalRevenue: 0, totalSalesCount: 0, totalDueAmount: 0, totalPaidAmount: 0 },
                pagination: { total: 0, page: 1, totalPages: 0, limit: 10 },
                error: "Unauthorized access.",
            };
        }

        const page = params.page && params.page > 0 ? params.page : 1;
        const limit = params.limit && params.limit > 0 ? params.limit : 10;
        const skip = (page - 1) * limit;

        // ----------------------------------------------------
        // 1. Role-based Branch Security Guard
        // ----------------------------------------------------
        let targetBranchId: string | undefined = undefined;

        if (user.role === "SUPER_ADMIN") {
            if (params.branchId && params.branchId !== "ALL") {
                targetBranchId = params.branchId;
            }
        } else {
            // SUPER_ADMIN නොවන පරිශීලකයින් සඳහා ඔවුන්ට හිමි Branch එකට පමණක් Data ලිමිට් කෙරේ
            if (!user.branch?.id) {
                return {
                    success: false,
                    data: [],
                    stats: { totalRevenue: 0, totalSalesCount: 0, totalDueAmount: 0, totalPaidAmount: 0 },
                    pagination: { total: 0, page: 1, totalPages: 0, limit },
                    error: "No assigned branch found for this user.",
                };
            }
            targetBranchId = user.branch.id;
        }

        // ----------------------------------------------------
        // 2. Build Where Filter Query
        // ----------------------------------------------------
        const whereClause: Prisma.SaleWhereInput = {};

        if (targetBranchId) {
            whereClause.branchId = targetBranchId;
        }

        // Payment Method Filter
        if (params.paymentMethod && params.paymentMethod !== "ALL") {
            whereClause.paymentMethod = params.paymentMethod;
        }

        // Payment Status Filter
        if (params.paymentStatus && params.paymentStatus !== "ALL") {
            whereClause.paymentStatus = params.paymentStatus;
        }

        // Search Query Filter (Invoice Number, Customer Name, Cashier Name)
        if (params.searchQuery && params.searchQuery.trim() !== "") {
            const query = params.searchQuery.trim();
            whereClause.OR = [
                { invoiceNumber: { contains: query, mode: "insensitive" } },
                { customer: { name: { contains: query, mode: "insensitive" } } },
                { user: { name: { contains: query, mode: "insensitive" } } },
            ];
        }

        // Date Range Filter
        if (params.startDate || params.endDate) {
            whereClause.createdAt = {};
            if (params.startDate) {
                const start = new Date(params.startDate);
                start.setHours(0, 0, 0, 0);
                whereClause.createdAt.gte = start;
            }
            if (params.endDate) {
                const end = new Date(params.endDate);
                end.setHours(23, 59, 59, 999);
                whereClause.createdAt.lte = end;
            }
        }

        // ----------------------------------------------------
        // 3. Database Queries (Sales Data + Aggregate Stats + Count)
        // ----------------------------------------------------
        const [sales, totalCount, statsAggregate] = await Promise.all([
            prisma.sale.findMany({
                where: whereClause,
                include: {
                    branch: { select: { id: true, name: true } },
                    user: { select: { id: true, name: true } },
                    customer: { select: { id: true, name: true } },
                    items: {
                        include: {
                            product: { select: { id: true, name: true } },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.sale.count({ where: whereClause }),
            prisma.sale.aggregate({
                where: whereClause,
                _sum: {
                    totalAmount: true,
                    paidAmount: true,
                    dueAmount: true,
                },
            }),
        ]);

        // ----------------------------------------------------
        // 4. Format Data for Frontend Interface
        // ----------------------------------------------------
        const formattedSales: SaleRecord[] = sales.map((sale) => {
            const { date, time, timestamp } = formatSaleDateTime(sale.createdAt);

            const items = sale.items.map((item) => ({
                id: item.id,
                productName: item.product?.name || "Unknown Product",
                quantity: item.quantity,
                priceAtSale: Number(item.priceAtSale),
                originalPrice: Number(item.originalPrice),
            }));

            const subtotal = items.reduce(
                (acc, curr) => acc + curr.priceAtSale * curr.quantity,
                0
            );

            return {
                id: sale.id,
                invoiceNumber: sale.invoiceNumber || `INV-${sale.id.slice(-6).toUpperCase()}`,
                date,
                time,
                timestamp,
                branchId: sale.branchId,
                branch: sale.branch?.name || "Unknown Branch",
                customer: sale.customer?.name || "Walk-In Customer",
                cashier: sale.user?.name || "System",
                checkoutMethod: sale.paymentMethod as any,
                paymentStatus: sale.paymentStatus as any,
                subtotal,
                totalAmount: Number(sale.totalAmount),
                paidAmount: Number(sale.paidAmount),
                dueAmount: Number(sale.dueAmount),
                items,
            };
        });

        const totalRevenue = Number(statsAggregate._sum.totalAmount || 0);
        const totalPaidAmount = Number(statsAggregate._sum.paidAmount || 0);
        const totalDueAmount = Number(statsAggregate._sum.dueAmount || 0);

        return {
            success: true,
            data: formattedSales,
            stats: {
                totalRevenue,
                totalSalesCount: totalCount,
                totalDueAmount,
                totalPaidAmount,
            },
            pagination: {
                total: totalCount,
                page,
                totalPages: Math.ceil(totalCount / limit) || 1,
                limit,
            },
        };
    } catch (error: any) {
        console.error("Error fetching sales history:", error);
        return {
            success: false,
            data: [],
            stats: { totalRevenue: 0, totalSalesCount: 0, totalDueAmount: 0, totalPaidAmount: 0 },
            pagination: { total: 0, page: 1, totalPages: 0, limit: 10 },
            error: "An unexpected error occurred while fetching sales history.",
        };
    }
}