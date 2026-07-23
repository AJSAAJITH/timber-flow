import { Building2, CheckCircle, AlertCircle } from "lucide-react";

interface MetricProps {
    total: number;
    active: number;
    blocked: number;
}

export function BranchMetrics({ total, active, blocked }: MetricProps) {
    return (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Total Branches */}
            <div className="rounded-lg border border-border bg-background/50 p-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-3">
                        <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Total Branches</p>
                        <p className="text-2xl font-bold text-foreground">{total}</p>
                    </div>
                </div>
            </div>

            {/* Active Branches */}
            <div className="rounded-lg border border-border bg-background/50 p-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-500/10 p-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Active Branches</p>
                        <p className="text-2xl font-bold text-foreground">{active}</p>
                    </div>
                </div>
            </div>

            {/* Blocked Branches */}
            <div className="rounded-lg border border-border bg-background/50 p-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-red-500/10 p-3">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Blocked Branches</p>
                        <p className="text-2xl font-bold text-foreground">{blocked}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}