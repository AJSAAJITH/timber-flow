"use server";

import { CreateExpenseInput, ExpenseRecord, FinanceFilterParams, FinanceSummaryData } from "@/app/dashboard/finance/types/finance";
import { ActionResult } from "@/lib/types/action-result";
import { getAuthenticatedUser } from "./auth";
import { actionError, actionSuccess } from "@/lib/types/action-response";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma, ExpenseType } from "@prisma/client";

// 1. GET FINANCE DATA (SUMMARY, CHARTS, & EXPENSES)
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

        // ----------------------------------------------------
        // Role-Based Branch Guard Logic
        // ----------------------------------------------------
        let targetBranchId: string | undefined = undefined;

        if (user.role === "SUPER_ADMIN") {
            if (params.branchId && params.branchId !== "ALL") {
                targetBranchId = params.branchId;
            }
        } else {
            // ADMIN / CASHIER: Force user's assigned branch
            if (!user.branch?.id) {
                return actionError("No assigned branch found for this user.", "FORBIDDEN");
            }
            targetBranchId = user.branch.id;
        }

        // ----------------------------------------------------
        // Build Base Where Clauses
        // ----------------------------------------------------
        const expenseWhere: Prisma.ExpenseWhereInput = {};
        const saleWhere: Prisma.SaleWhereInput = {};
        const creditWhere: Prisma.CreditPaymentLogWhereInput = {};

        if (targetBranchId) {
            expenseWhere.branchId = targetBranchId;
            saleWhere.branchId = targetBranchId;
            creditWhere.branchId = targetBranchId;
        }

        // Date Range Filter
        if (params.startDate || params.endDate) {
            const dateFilter: Prisma.DateTimeFilter = {};
            if (params.startDate) {
                const start = new Date(params.startDate);
                start.setHours(0, 0, 0, 0);
                dateFilter.gte = start;
            }
            if (params.endDate) {
                const end = new Date(params.endDate);
                end.setHours(23, 59, 59, 999);
                dateFilter.lte = end;
            }

            expenseWhere.createdAt = dateFilter;
            saleWhere.createdAt = dateFilter;
            creditWhere.createdAt = dateFilter;
        }

        // Specific Expense Type Filter
        if (params.expenseType && params.expenseType !== "ALL") {
            expenseWhere.type = params.expenseType as ExpenseType;
        }

        // Expense Search Query Filter
        if (params.searchQuery && params.searchQuery.trim() !== "") {
            expenseWhere.description = {
                contains: params.searchQuery.trim(),
                mode: "insensitive",
            };
        }

        // ----------------------------------------------------
        // Parallel Database Queries
        // ----------------------------------------------------
        const [
            expensesList,
            totalExpenseCount,
            salesAggregate,
            expensesAggregate,
            creditAggregate,
            expenseGroupByType,
            rawSales,
            rawExpenses
        ] = await Promise.all([
            // 1. Paginated Expense List
            prisma.expense.findMany({
                where: expenseWhere,
                include: {
                    branch: { select: { name: true } },
                    user: { select: { name: true } },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),

            // 2. Total Expense Count for Pagination
            prisma.expense.count({ where: expenseWhere }),

            // 3. Sales Financial Aggregates
            prisma.sale.aggregate({
                where: saleWhere,
                _sum: {
                    totalAmount: true,
                    paidAmount: true,
                    dueAmount: true,
                },
            }),

            // 4. Expense Total Aggregate
            prisma.expense.aggregate({
                where: expenseWhere,
                _sum: {
                    amount: true,
                },
            }),

            // 5. Credit Payments Collected Aggregate (For tracking/display purposes)
            prisma.creditPaymentLog.aggregate({
                where: creditWhere,
                _sum: {
                    amountPaid: true,
                },
            }),

            // 6. Expense Breakdown by Type
            prisma.expense.groupBy({
                by: ["type"],
                where: expenseWhere,
                _sum: {
                    amount: true,
                },
            }),

            // 7. Raw Sales for Charting
            prisma.sale.findMany({
                where: saleWhere,
                select: { createdAt: true, paidAmount: true },
            }),

            // 8. Raw Expenses for Charting
            prisma.expense.findMany({
                where: expenseWhere,
                select: { createdAt: true, amount: true },
            })
        ]);

        // ----------------------------------------------------
        // Process & Calculate Correct Financial Metrics
        // ----------------------------------------------------
        const totalSales = Number(salesAggregate._sum.totalAmount || 0);          // Gross Invoice Total
        const totalPaidAtSale = Number(salesAggregate._sum.paidAmount || 0);      // Total Paid Amount managed via Sales
        const pendingDues = Number(salesAggregate._sum.dueAmount || 0);            // Outstanding uncollected dues
        const totalCreditCollected = Number(creditAggregate._sum.amountPaid || 0); // Credit payments logged
        const totalExpenses = Number(expensesAggregate._sum.amount || 0);          // Total Expenses

        // Realized Cash Inflow = Sales Paid Amount (Credit Payment updates sales.paidAmount directly)
        const totalActualIncome = totalPaidAtSale;

        // Net Cashflow = Realized Cash Inflow - Expenses
        const netCashflow = totalActualIncome - totalExpenses;

        // Group Expenses by Type
        const expenseTypeBreakdown: Record<string, number> = {};
        expenseGroupByType.forEach((item) => {
            expenseTypeBreakdown[item.type] = Number(item._sum.amount || 0);
        });

        // Format Expense List
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

        // ----------------------------------------------------
        // Generate Daily Chart Data
        // ----------------------------------------------------
        const chartMap: Record<string, { sales: number; expenses: number }> = {};

        // 1. Sales Cash In (Includes all paid amounts managed by sales)
        rawSales.forEach((sale) => {
            const dateKey = sale.createdAt.toISOString().split("T")[0];
            if (!chartMap[dateKey]) chartMap[dateKey] = { sales: 0, expenses: 0 };
            chartMap[dateKey].sales += Number(sale.paidAmount || 0);
        });

        // 2. Expense Outflow
        rawExpenses.forEach((exp) => {
            const dateKey = exp.createdAt.toISOString().split("T")[0];
            if (!chartMap[dateKey]) chartMap[dateKey] = { sales: 0, expenses: 0 };
            chartMap[dateKey].expenses += Number(exp.amount || 0);
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

// 2. CREATE EXPENSE ACTION
export async function createExpense(
    input: CreateExpenseInput
): Promise<ActionResult<ExpenseRecord>> {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return actionError("Unauthorized access.", "UNAUTHORIZED");
        }

        // Validation
        if (!input.amount || input.amount <= 0) {
            return actionError("Amount must be greater than zero.", "VALIDATION_ERROR");
        }
        if (!input.description || input.description.trim() === "") {
            return actionError("Description is required.", "VALIDATION_ERROR");
        }

        // Determine target branch
        let resolvedBranchId: string;

        if (user.role === "SUPER_ADMIN") {
            if (!input.branchId || input.branchId === "ALL") {
                return actionError("Please select a specific branch to record this expense.", "VALIDATION_ERROR");
            }
            resolvedBranchId = input.branchId;
        } else {
            if (!user.branch?.id) {
                return actionError("You do not have an assigned branch to perform this action.", "FORBIDDEN");
            }
            resolvedBranchId = user.branch.id;
        }

        // Create Record
        const newExpense = await prisma.expense.create({
            data: {
                amount: new Prisma.Decimal(input.amount),
                description: input.description.trim(),
                type: input.type || ExpenseType.PETTY_CASH,
                branchId: resolvedBranchId,
                userId: user.id,
            },
            include: {
                branch: { select: { name: true } },
                user: { select: { name: true } },
            },
        });

        revalidatePath("/dashboard/finance");

        return actionSuccess(
            {
                id: newExpense.id,
                amount: Number(newExpense.amount),
                description: newExpense.description,
                type: newExpense.type,
                branchId: newExpense.branchId,
                branchName: newExpense.branch?.name || "Branch",
                userId: newExpense.userId,
                userName: newExpense.user?.name || user.name,
                createdAt: newExpense.createdAt,
            },
            "Expense recorded successfully."
        );
    } catch (error) {
        console.error("Error creating expense:", error);
        return actionError("Failed to save expense record.", "SERVER_ERROR");
    }
}

// 3. DELETE EXPENSE ACTION
export async function deleteExpense(
    expenseId: string
): Promise<ActionResult<{ success: boolean }>> {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return actionError("Unauthorized access.", "UNAUTHORIZED");
        }

        const existingExpense = await prisma.expense.findUnique({
            where: { id: expenseId },
        });

        if (!existingExpense) {
            return actionError("Expense record not found.", "NOT_FOUND");
        }

        // Branch Security Check for non Super Admin
        if (user.role !== "SUPER_ADMIN" && existingExpense.branchId !== user.branch?.id) {
            return actionError("You are not authorized to delete expenses for this branch.", "FORBIDDEN");
        }

        await prisma.expense.delete({
            where: { id: expenseId },
        });

        revalidatePath("/dashboard/finance");

        return actionSuccess({ success: true }, "Expense deleted successfully.");
    } catch (error) {
        console.error("Error deleting expense:", error);
        return actionError("Failed to delete expense.", "SERVER_ERROR");
    }
}