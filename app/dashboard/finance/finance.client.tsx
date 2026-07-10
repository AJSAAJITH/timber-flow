"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import {
    Plus,
    TrendingUp,
    TrendingDown,
    DollarSign,
    AlertCircle,
} from "lucide-react"

// Types
interface ExpenseRecord {
    id: string
    date: string
    time: string
    branch: string
    authorizedUser: string
    type: "INCOME" | "PROFIT_WITHDRAWAL" | "SALARY" | "PETTY_CASH" | "BILL_PAYMENT"
    description: string
    amount: number
}

interface ChartData {
    name: string
    income: number
    expenses: number
}

// Mock Data
const MOCK_EXPENSES: ExpenseRecord[] = [
    {
        id: "1",
        date: "2026-07-10",
        time: "16:45",
        branch: "Main Counter",
        authorizedUser: "Admin Jayasuriya",
        type: "PROFIT_WITHDRAWAL",
        description: "Profit withdrawal for personal use",
        amount: 45000,
    },
    {
        id: "2",
        date: "2026-07-10",
        time: "14:30",
        branch: "Main Counter",
        authorizedUser: "Cashier Perera",
        type: "INCOME",
        description: "Cash sales collection",
        amount: 125000,
    },
    {
        id: "3",
        date: "2026-07-10",
        time: "13:15",
        branch: "Main Counter",
        authorizedUser: "Manager Silva",
        type: "SALARY",
        description: "Monthly salary payout",
        amount: 35000,
    },
    {
        id: "4",
        date: "2026-07-10",
        time: "11:00",
        branch: "Negombo Warehouse",
        authorizedUser: "Admin Fernando",
        type: "BILL_PAYMENT",
        description: "Electricity bill payment",
        amount: 8500,
    },
    {
        id: "5",
        date: "2026-07-09",
        time: "15:30",
        branch: "Main Counter",
        authorizedUser: "Cashier Jayasuriya",
        type: "INCOME",
        description: "Credit sales collection",
        amount: 85000,
    },
    {
        id: "6",
        date: "2026-07-09",
        time: "12:00",
        branch: "Main Counter",
        authorizedUser: "Manager Nimal",
        type: "PETTY_CASH",
        description: "Office supplies and materials",
        amount: 3500,
    },
]

const CHART_DATA: ChartData[] = [
    { name: "Mon", income: 125000, expenses: 53500 },
    { name: "Tue", income: 98000, expenses: 35000 },
    { name: "Wed", income: 156000, expenses: 8500 },
    { name: "Thu", income: 112000, expenses: 50000 },
    { name: "Fri", income: 189000, expenses: 45000 },
    { name: "Sat", income: 210000, expenses: 62000 },
    { name: "Sun", income: 145000, expenses: 35000 },
]

const BRANCHES = ["All Branches", "Main Counter", "Negombo Warehouse", "Galle Branch"]
const TIMEFRAMES = ["Today", "This Week", "This Month"]
const EXPENSE_TYPES = [
    { value: "INCOME", label: "Income" },
    { value: "PROFIT_WITHDRAWAL", label: "Profit Withdrawal (Cashout)" },
    { value: "SALARY", label: "Salary" },
    { value: "PETTY_CASH", label: "Petty Cash" },
    { value: "BILL_PAYMENT", label: "Bill Payment" },
]

export default function FinanceClientPage() {
    const [selectedBranch, setSelectedBranch] = useState("All Branches")
    const [selectedTimeframe, setSelectedTimeframe] = useState("This Week")
    const [isRecordExpenseOpen, setIsRecordExpenseOpen] = useState(false)
    const [newExpense, setNewExpense] = useState({
        amount: "",
        type: "PROFIT_WITHDRAWAL",
        description: "",
    })

    // Filter expenses by branch
    const filteredExpenses = useMemo(() => {
        return MOCK_EXPENSES.filter(
            (exp) => selectedBranch === "All Branches" || exp.branch === selectedBranch
        )
    }, [selectedBranch])

    // Calculate metrics
    const metrics = useMemo(() => {
        const income = filteredExpenses
            .filter((exp) => exp.type === "INCOME")
            .reduce((sum, exp) => sum + exp.amount, 0)

        const expenses = filteredExpenses
            .filter((exp) => exp.type !== "INCOME")
            .reduce((sum, exp) => sum + exp.amount, 0)

        return {
            totalIncome: income,
            totalExpenses: expenses,
            netCashFlow: income - expenses,
        }
    }, [filteredExpenses])

    // Handle expense submission
    const handleRecordExpense = () => {
        if (!newExpense.amount || !newExpense.description) return

        const expense: ExpenseRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
            branch: selectedBranch === "All Branches" ? "Main Counter" : selectedBranch,
            authorizedUser: "Current Admin",
            type: newExpense.type as any,
            description: newExpense.description,
            amount: parseFloat(newExpense.amount),
        }

        setIsRecordExpenseOpen(false)
        setNewExpense({ amount: "", type: "PROFIT_WITHDRAWAL", description: "" })
    }

    // Get badge colors
    const getTypeColor = (type: string) => {
        switch (type) {
            case "INCOME":
                return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
            case "PROFIT_WITHDRAWAL":
                return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
            case "SALARY":
                return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
            case "PETTY_CASH":
                return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            case "BILL_PAYMENT":
                return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
            default:
                return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300"
        }
    }

    const formatCurrency = (amount: number) => `LKR ${amount.toLocaleString()}`

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="border-b border-border bg-card/50 p-4 sm:p-6 md:p-8">
                <h1 className="text-3xl font-bold text-foreground">Finance & Expense Management</h1>
                <p className="mt-1 text-muted-foreground">Track income, expenses, and cash flow across branches</p>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8 space-y-6">
                {/* Top Control Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                        {/* Branch Selector */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground block mb-2">Branch</label>
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                {BRANCHES.map((branch) => (
                                    <option key={branch}>{branch}</option>
                                ))}
                            </select>
                        </div>

                        {/* Timeframe Filter */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground block mb-2">Timeframe</label>
                            <div className="flex gap-1 bg-secondary rounded-lg p-1">
                                {TIMEFRAMES.map((timeframe) => (
                                    <button
                                        key={timeframe}
                                        onClick={() => setSelectedTimeframe(timeframe)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${selectedTimeframe === timeframe
                                            ? "bg-primary text-primary-foreground"
                                            : "text-secondary-foreground hover:bg-secondary/80"
                                            }`}
                                    >
                                        {timeframe}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Record Expense Button */}
                    <Button
                        onClick={() => setIsRecordExpenseOpen(true)}
                        className="gap-2 min-h-[44px] w-full sm:w-auto bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4" />
                        Record Expense / Cash Out
                    </Button>
                </div>

                {/* Executive Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Total Income */}
                    <div className="rounded-lg border border-green-200 dark:border-green-900/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-foreground">Total Income</h3>
                            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300 mb-1">
                            {formatCurrency(metrics.totalIncome)}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">From sales and collections</p>
                    </div>

                    {/* Total Expenses */}
                    <div className="rounded-lg border border-red-200 dark:border-red-900/30 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-foreground">Total Expenses</h3>
                            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="text-3xl font-bold text-red-700 dark:text-red-300 mb-1">
                            {formatCurrency(metrics.totalExpenses)}
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400">Withdrawals, salaries & bills</p>
                    </div>

                    {/* Net Cash Flow */}
                    <div className="rounded-lg border border-blue-200 dark:border-blue-900/30 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-foreground">Net Cash Flow</h3>
                            <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p
                            className={`text-3xl font-bold mb-1 ${metrics.netCashFlow >= 0
                                ? "text-blue-700 dark:text-blue-300"
                                : "text-red-700 dark:text-red-300"
                                }`}
                        >
                            {formatCurrency(metrics.netCashFlow)}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Income minus expenses</p>
                    </div>
                </div>

                {/* Main Analytics Layout */}
                <div className="space-y-6">
                    {/* Mobile: Tabs View */}
                    <div className="md:hidden">
                        <Tabs defaultValue="logs" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="logs">Financial Logs</TabsTrigger>
                                <TabsTrigger value="chart">Analytics Chart</TabsTrigger>
                            </TabsList>

                            {/* Logs Tab */}
                            <TabsContent value="logs" className="space-y-4 mt-4">
                                <div className="space-y-3">
                                    {filteredExpenses.map((expense) => (
                                        <div key={expense.id} className="rounded-lg border border-border bg-card p-4">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-foreground truncate">{expense.description}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {expense.date} {expense.time}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getTypeColor(expense.type)}`}
                                                >
                                                    {EXPENSE_TYPES.find((t) => t.value === expense.type)?.label}
                                                </span>
                                            </div>

                                            <div className="space-y-1.5 text-sm border-t border-border pt-3">
                                                <p className="text-muted-foreground">Branch: {expense.branch}</p>
                                                <p className="text-muted-foreground">User: {expense.authorizedUser}</p>
                                                <p className={`font-bold text-lg ${expense.type === "INCOME" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                                    {expense.type === "INCOME" ? "+" : "-"}{formatCurrency(expense.amount)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Chart Tab */}
                            <TabsContent value="chart" className="mt-4">
                                <div className="rounded-lg border border-border bg-card p-4">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={CHART_DATA}>
                                            <defs>
                                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                            <Legend />
                                            <Area
                                                type="monotone"
                                                dataKey="income"
                                                stroke="#10b981"
                                                fillOpacity={1}
                                                fill="url(#colorIncome)"
                                                name="Income"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="expenses"
                                                stroke="#ef4444"
                                                fillOpacity={1}
                                                fill="url(#colorExpenses)"
                                                name="Expenses"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Desktop: Split View */}
                    <div className="hidden md:grid grid-cols-[1.85fr_1.15fr] gap-6">
                        {/* Left: Expense Log Table */}
                        <div className="rounded-lg border border-border bg-card overflow-hidden">
                            <div className="p-4 border-b border-border">
                                <h3 className="font-semibold text-foreground">Expense & Income Log</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-border bg-secondary/50">
                                            <TableHead className="h-12">Date & Time</TableHead>
                                            <TableHead className="h-12">Branch</TableHead>
                                            <TableHead className="h-12">Authorized User</TableHead>
                                            <TableHead className="h-12">Type</TableHead>
                                            <TableHead className="h-12">Description</TableHead>
                                            <TableHead className="h-12 text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredExpenses.map((expense) => (
                                            <TableRow
                                                key={expense.id}
                                                className={`border-b border-border hover:bg-secondary/30 transition-colors ${expense.type === "PROFIT_WITHDRAWAL" ? "bg-orange-50/50 dark:bg-orange-950/10" : ""
                                                    }`}
                                            >
                                                <TableCell className="text-sm font-mono text-muted-foreground">
                                                    {expense.date} {expense.time}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{expense.branch}</TableCell>
                                                <TableCell className="text-sm text-foreground">{expense.authorizedUser}</TableCell>
                                                <TableCell className="text-sm">
                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getTypeColor(expense.type)}`}>
                                                        {EXPENSE_TYPES.find((t) => t.value === expense.type)?.label}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm text-foreground truncate max-w-xs">
                                                    {expense.description}
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right text-sm font-bold ${expense.type === "INCOME" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                                        }`}
                                                >
                                                    {expense.type === "INCOME" ? "+" : "-"}{formatCurrency(expense.amount)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Right: Analytics Chart */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <h3 className="font-semibold text-foreground mb-4">Income vs Expenses Trend</h3>
                            <ResponsiveContainer width="100%" height={350}>
                                <AreaChart data={CHART_DATA}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="income"
                                        stroke="#10b981"
                                        fillOpacity={1}
                                        fill="url(#colorIncome)"
                                        name="Income"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="expenses"
                                        stroke="#ef4444"
                                        fillOpacity={1}
                                        fill="url(#colorExpenses)"
                                        name="Expenses"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Record Expense Sheet */}
            <Sheet open={isRecordExpenseOpen} onOpenChange={setIsRecordExpenseOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md">
                    <SheetHeader className="border-b border-border pb-4">
                        <SheetTitle>Record Expense / Cash Out</SheetTitle>
                    </SheetHeader>

                    <div className="py-6 space-y-6">
                        {/* Amount Input */}
                        <div>
                            <label className="text-sm font-semibold text-foreground block mb-2">
                                Amount (LKR) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                className="w-full px-4 py-3 text-lg bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                            />
                        </div>

                        {/* Expense Type Dropdown */}
                        <div>
                            <label className="text-sm font-semibold text-foreground block mb-2">
                                Expense Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={newExpense.type}
                                onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value })}
                                className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                {EXPENSE_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description Textarea */}
                        <div>
                            <label className="text-sm font-semibold text-foreground block mb-2">
                                Description/Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Why is this money being taken from the branch register?"
                                value={newExpense.description}
                                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                className="w-full px-4 py-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary min-h-24 resize-none"
                            />
                        </div>

                        {/* Alert */}
                        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3 flex gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                This transaction will be logged and audited. Ensure all details are accurate.
                            </p>
                        </div>
                    </div>

                    <SheetFooter className="border-t border-border pt-4">
                        <Button variant="outline" onClick={() => setIsRecordExpenseOpen(false)} className="min-h-[44px]">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRecordExpense}
                            disabled={!newExpense.amount || !newExpense.description}
                            className="min-h-[44px] bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                        >
                            Record Transaction
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
