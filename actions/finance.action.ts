"use server";

import { CreateExpenseInput, ExpenseRecord, FinanceFilterParams, FinanceSummaryData } from "@/app/dashboard/finance/types/finance";
import { ActionResult } from "@/lib/types/action-result";
import { getAuthenticatedUser } from "./auth";
import { actionError, actionSuccess } from "@/lib/types/action-response";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma, ExpenseType } from "@prisma/client";

/**
 * 1. Create New Expense Action
 */
export async function createExpense(
    input: CreateExpenseInput
): Promise<ActionResult<ExpenseRecord>> {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return actionError("Unauthorized access.", "UNAUTHORIZED");
        }

        if (!input.amount || input.amount <= 0) {
            return actionError("Please enter a valid expense amount.", "BAD_REQUEST");
        }

        if (!input.description?.trim()) {
            return actionError("Description is required.", "BAD_REQUEST");
        }

        // Branch Selection & Security Guard
        let targetBranchId = input.branchId;

        if (user.role !== "SUPER_ADMIN") {
            if (!user.branch?.id) {
                return actionError("No assigned branch found for this user.", "FORBIDDEN");
            }
            targetBranchId = user.branch.id;
        }

        if (!targetBranchId || targetBranchId === "ALL") {
            return actionError("Please select a specific branch to record expense.", "BAD_REQUEST");
        }

        // Save to Database
        const newExpense = await prisma.expense.create({
            data: {
                amount: input.amount,
                description: input.description.trim(),
                type: input.type,
                branchId: targetBranchId,
                userId: user.id,
            },
            include: {
                branch: { select: { name: true } },
                user: { select: { name: true } },
            },
        });

        revalidatePath("/dashboard/finance");

        return actionSuccess({
            id: newExpense.id,
            amount: Number(newExpense.amount),
            description: newExpense.description,
            type: newExpense.type,
            branchId: newExpense.branchId,
            branchName: newExpense.branch?.name || "Unknown Branch",
            userId: newExpense.userId,
            userName: newExpense.user?.name || "System",
            createdAt: newExpense.createdAt,
        });
    } catch (error) {
        console.error("Error creating expense:", error);
        return actionError("Failed to record expense.", "SERVER_ERROR");
    }
}

/**
 * 2. Get Finance Summary & Chart Data Action
 */
export async function getFinanceData(
    params: FinanceFilterParams
): Promise<ActionResult<FinanceSummaryData>> {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return actionError("Unauthorized access.", "UNAUTHORIZED");
        }

        const page = params.page && params.page > 0 ? params.page : 1;
        const limit = params.limit && params.limit > 0 ? params.limit : 10;
        const skip = (page - 1) * limit;

        // Role-Based Branch Guard
        let targetBranchId: string | undefined = undefined;
        if (user.role === "SUPER_ADMIN") {
            if (params.branchId && params.branchId !== "ALL") {
                targetBranchId = params.branchId;
            }
        } else {
            if (!user.branch?.id) {
                return actionError("No assigned branch found for this user.", "FORBIDDEN");
            }
            targetBranchId = user.branch.id;
        }

        // Build Where Clauses
        const expenseWhere: Prisma.ExpenseWhereInput = {};
        const saleWhere: Prisma.SaleWhereInput = {};
        const creditWhere: Prisma.CreditPaymentLogWhereInput = {};

        if (targetBranchId) {
            expenseWhere.branchId = targetBranchId;
            saleWhere.branchId = targetBranchId;
            creditWhere.branchId = targetBranchId;
        }

        if (params.startDate || params.endDate) {
            const dateFilter: Prisma.DateTimeFilter = {};
            if (params.startDate) {
                dateFilter.gte = new Date(`${params.startDate}T00:00:00.000Z`);
            }
            if (params.endDate) {
                dateFilter.lte = new Date(`${params.endDate}T23:59:59.999Z`);
            }

            expenseWhere.createdAt = dateFilter;
            saleWhere.createdAt = dateFilter;
            creditWhere.createdAt = dateFilter;
        }

        if (params.expenseType && params.expenseType !== "ALL") {
            expenseWhere.type = params.expenseType as ExpenseType;
        }

        if (params.searchQuery?.trim()) {
            expenseWhere.description = {
                contains: params.searchQuery.trim(),
                mode: "insensitive",
            };
        }

        // Parallel Database Aggregations
        const [
            expensesList,
            totalExpenseCount,
            salesAggregate,
            expensesAggregate,
            creditAggregate,
            expenseGroupByType,
            dailySalesGroup,
            dailyExpensesGroup
        ] = await Promise.all([
            prisma.expense.findMany({
                where: expenseWhere,
                select: {
                    id: true,
                    amount: true,
                    description: true,
                    type: true,
                    branchId: true,
                    userId: true,
                    createdAt: true,
                    branch: { select: { name: true } },
                    user: { select: { name: true } },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),

            prisma.expense.count({ where: expenseWhere }),

            prisma.sale.aggregate({
                where: saleWhere,
                _sum: { totalAmount: true, paidAmount: true, dueAmount: true },
            }),

            prisma.expense.aggregate({
                where: expenseWhere,
                _sum: { amount: true },
            }),

            prisma.creditPaymentLog.aggregate({
                where: creditWhere,
                _sum: { amountPaid: true },
            }),

            prisma.expense.groupBy({
                by: ["type"],
                where: expenseWhere,
                _sum: { amount: true },
            }),

            targetBranchId
                ? prisma.$queryRaw<Array<{ date: string; total: number }>>`
                    SELECT DATE("createdAt")::text as date, SUM("paidAmount")::float as total
                    FROM "Sale"
                    WHERE "branchId" = ${targetBranchId}
                    ${params.startDate ? Prisma.sql`AND "createdAt" >= ${new Date(params.startDate)}` : Prisma.empty}
                    ${params.endDate ? Prisma.sql`AND "createdAt" <= ${new Date(params.endDate + "T23:59:59.999Z")}` : Prisma.empty}
                    GROUP BY DATE("createdAt")
                    ORDER BY date ASC;
                  `
                : prisma.$queryRaw<Array<{ date: string; total: number }>>`
                    SELECT DATE("createdAt")::text as date, SUM("paidAmount")::float as total
                    FROM "Sale"
                    WHERE 1=1
                    ${params.startDate ? Prisma.sql`AND "createdAt" >= ${new Date(params.startDate)}` : Prisma.empty}
                    ${params.endDate ? Prisma.sql`AND "createdAt" <= ${new Date(params.endDate + "T23:59:59.999Z")}` : Prisma.empty}
                    GROUP BY DATE("createdAt")
                    ORDER BY date ASC;
                  `,

            targetBranchId
                ? prisma.$queryRaw<Array<{ date: string; total: number }>>`
                    SELECT DATE("createdAt")::text as date, SUM("amount")::float as total
                    FROM "Expense"
                    WHERE "branchId" = ${targetBranchId}
                    ${params.startDate ? Prisma.sql`AND "createdAt" >= ${new Date(params.startDate)}` : Prisma.empty}
                    ${params.endDate ? Prisma.sql`AND "createdAt" <= ${new Date(params.endDate + "T23:59:59.999Z")}` : Prisma.empty}
                    GROUP BY DATE("createdAt")
                    ORDER BY date ASC;
                  `
                : prisma.$queryRaw<Array<{ date: string; total: number }>>`
                    SELECT DATE("createdAt")::text as date, SUM("amount")::float as total
                    FROM "Expense"
                    WHERE 1=1
                    ${params.startDate ? Prisma.sql`AND "createdAt" >= ${new Date(params.startDate)}` : Prisma.empty}
                    ${params.endDate ? Prisma.sql`AND "createdAt" <= ${new Date(params.endDate + "T23:59:59.999Z")}` : Prisma.empty}
                    GROUP BY DATE("createdAt")
                    ORDER BY date ASC;
                  `
        ]);

        const totalSales = Number(salesAggregate._sum.totalAmount || 0);
        const totalPaidAtSale = Number(salesAggregate._sum.paidAmount || 0);
        const pendingDues = Number(salesAggregate._sum.dueAmount || 0);
        const totalCreditCollected = Number(creditAggregate._sum.amountPaid || 0);
        const totalExpenses = Number(expensesAggregate._sum.amount || 0);
        const totalActualIncome = totalPaidAtSale;
        const netCashflow = totalActualIncome - totalExpenses;

        const expenseTypeBreakdown: Record<string, number> = {};
        expenseGroupByType.forEach((item) => {
            expenseTypeBreakdown[item.type] = Number(item._sum.amount || 0);
        });

        const formattedExpenses: ExpenseRecord[] = expensesList.map((e) => ({
            id: e.id,
            amount: Number(e.amount),
            description: e.description,
            type: e.type,
            branchId: e.branchId,
            branchName: e.branch?.name || "Unknown Branch",
            userId: e.userId,
            userName: e.user?.name || "System",
            createdAt: e.createdAt,
        }));

        const chartMap: Record<string, { sales: number; expenses: number }> = {};

        dailySalesGroup.forEach((s) => {
            const dateKey = s.date;
            if (!chartMap[dateKey]) chartMap[dateKey] = { sales: 0, expenses: 0 };
            chartMap[dateKey].sales = Number(s.total || 0);
        });

        dailyExpensesGroup.forEach((e) => {
            const dateKey = e.date;
            if (!chartMap[dateKey]) chartMap[dateKey] = { sales: 0, expenses: 0 };
            chartMap[dateKey].expenses = Number(e.total || 0);
        });

        const chartData = Object.keys(chartMap)
            .sort()
            .map((date) => ({
                date,
                sales: chartMap[date].sales,
                expenses: chartMap[date].expenses,
            }));

        return actionSuccess({
            stats: {
                totalSales,
                totalActualIncome,
                totalExpenses,
                netCashflow,
                totalCreditCollected,
                pendingDues,
            },
            expenseTypeBreakdown,
            expenses: formattedExpenses,
            chartData,
            pagination: {
                total: totalExpenseCount,
                page,
                totalPages: Math.ceil(totalExpenseCount / limit) || 1,
                limit,
            },
        });
    } catch (error) {
        console.error("Error fetching finance data:", error);
        return actionError("Failed to load financial records.", "SERVER_ERROR");
    }
}