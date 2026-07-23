import { AlertTriangle, Phone, MessageCircle } from "lucide-react";

export function QuickReachSection({ customers }: { customers: any[] }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-lg font-bold text-foreground">
                    Quick Reach: Outstanding Balances
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {customers.map((customer) => (
                    <div
                        key={customer.id}
                        className="rounded-lg border border-amber-200 dark:border-amber-900/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 hover:shadow-md transition-shadow"
                    >
                        {/* Customer Name */}
                        <p className="font-semibold text-foreground truncate text-sm">
                            {customer.name}
                        </p>

                        {/* Due Amount - Theme aware */}
                        <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-2.5 my-2">
                            <p className="text-xs text-muted-foreground">Due Amount</p>
                            <p className="text-xl font-bold text-red-700 dark:text-red-300">
                                LKR {customer.totalDue.toLocaleString()}
                            </p>
                        </div>

                        {/* Phone Number */}
                        <p className="text-xs text-muted-foreground font-mono">{customer.phone}</p>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs p-2 transition-colors">
                                Call
                            </button>
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs p-2 transition-colors">
                                Message
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}