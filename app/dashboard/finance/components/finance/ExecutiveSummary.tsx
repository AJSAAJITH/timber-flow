import React from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { formatCurrency } from "../../utils/finance";

interface Props {
    metrics: {
        totalIncome: number;
        totalExpenses: number;
        netCashFlow: number;
    };
    overallMetrics?: {
        totalIncome: number;
        totalExpenses: number;
        netCashFlow: number;
    };
    timeframeLabel?: string;
}

export const ExecutiveSummary: React.FC<Props> = ({
    metrics,
    overallMetrics,
    timeframeLabel = "Selected Period",
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Income */}
            <div className="rounded-lg border border-green-200 dark:border-green-900/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">Total Income</h3>
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300 mb-1 tracking-tight">
                    {formatCurrency(metrics.totalIncome)}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 truncate">
                    From sales and collections ({timeframeLabel})
                </p>

                {/* Overall System Income Footer */}
                {overallMetrics && (
                    <div className="mt-3 pt-2.5 border-t border-green-200/80 dark:border-green-900/50 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">System Total (All Time):</span>
                        <span className="font-semibold text-green-800 dark:text-green-300">
                            {formatCurrency(overallMetrics.totalIncome)}
                        </span>
                    </div>
                )}
            </div>

            {/* Total Expenses */}
            <div className="rounded-lg border border-red-200 dark:border-red-900/30 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">Total Expenses</h3>
                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-red-700 dark:text-red-300 mb-1 tracking-tight">
                    {formatCurrency(metrics.totalExpenses)}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 truncate">
                    Withdrawals, salaries & bills ({timeframeLabel})
                </p>

                {/* Overall System Expenses Footer */}
                {overallMetrics && (
                    <div className="mt-3 pt-2.5 border-t border-red-200/80 dark:border-red-900/50 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">System Total (All Time):</span>
                        <span className="font-semibold text-red-800 dark:text-red-300">
                            {formatCurrency(overallMetrics.totalExpenses)}
                        </span>
                    </div>
                )}
            </div>

            {/* Net Cash Flow */}
            <div className="rounded-lg border border-blue-200 dark:border-blue-900/30 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">Net Cash Flow</h3>
                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                </div>
                <p
                    className={`text-2xl sm:text-3xl font-bold mb-1 tracking-tight ${metrics.netCashFlow >= 0
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-red-700 dark:text-red-300"
                        }`}
                >
                    {formatCurrency(metrics.netCashFlow)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
                    Income minus expenses ({timeframeLabel})
                </p>

                {/* Overall System Net Cash Flow Footer */}
                {overallMetrics && (
                    <div className="mt-3 pt-2.5 border-t border-blue-200/80 dark:border-blue-900/50 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">System Total (All Time):</span>
                        <span
                            className={`font-semibold ${overallMetrics.netCashFlow >= 0
                                    ? "text-blue-800 dark:text-blue-300"
                                    : "text-red-700 dark:text-red-300"
                                }`}
                        >
                            {formatCurrency(overallMetrics.netCashFlow)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};