export const PAYMENT_STATUSES = ["ALL", "PAID", "PENDING", "PARTIALLY_PAID"] as const

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        maximumFractionDigits: 2,
    }).format(amount)
}

export const getPaymentStatusColor = (status: string) => {
    switch (status) {
        case "PAID":
            return "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400"
        case "PENDING":
            return "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400"
        case "PARTIALLY_PAID":
            return "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400"
        default:
            return "bg-secondary text-secondary-foreground"
    }
}

export const getPaymentMethodColor = (method: string) => {
    switch (method) {
        case "CASH":
            return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
        case "CREDIT":
            return "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400"
        case "BANK_TRANSFER":
            return "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-400"
        default:
            return "bg-secondary text-secondary-foreground"
    }
}