import { ExpenseType } from "@prisma/client";

export { ExpenseType };

// Form state interface
export interface NewExpenseForm {
    amount: string;
    type: ExpenseType;
    description: string;
}

export interface FinanceFilterParams {
    branchId?: string;       // "ALL" or specific Branch CUID
    startDate?: string;      // YYYY-MM-DD
    endDate?: string;        // YYYY-MM-DD
    expenseType?: string;    // "ALL" or ExpenseType Enum
    searchQuery?: string;    // Search in expense description
    page?: number;
    limit?: number;
}

export interface ExpenseRecord {
    id: string;
    amount: number;
    description: string;
    type: ExpenseType;
    branchId: string;
    branchName: string;
    userId: string;
    userName: string;
    createdAt: Date;
}

export interface ChartDataPoint {
    date: string;
    sales: number;
    expenses: number;
}

export interface FinanceSummaryData {
    stats: {
        totalSales: number;          // Gross Invoice Total
        totalActualIncome: number;   // Realized Cash Collected (paidAmount + totalCreditCollected)
        totalExpenses: number;       // Total Expense Outflow
        netCashflow: number;         // Realized Income - Expenses
        totalCreditCollected: number;// Recovered Dues
        pendingDues: number;         // Uncollected Credit Sales
    };
    expenseTypeBreakdown: Record<string, number>;
    expenses: ExpenseRecord[];
    chartData: ChartDataPoint[];
    pagination: {
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    };
}

export interface CreateExpenseInput {
    amount: number;
    description: string;
    type: ExpenseType;
    branchId?: string;
}