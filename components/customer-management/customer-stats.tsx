export function CustomerStats({ stats }: { stats: any }) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-background/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalCustomers}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Active Debtors</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.debtorCount}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">LKR {stats.totalDue.toLocaleString()}</p>
            </div>
        </div>
    );
}