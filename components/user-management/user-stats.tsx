import React from "react";

export function UserStats({ stats }: { stats: any }) {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-background/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.admins}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Cashiers</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.cashiers}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.blocked}</p>
            </div>
        </div>
    );
}