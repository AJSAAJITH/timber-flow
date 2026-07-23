import { Users } from "lucide-react";
import { Branch } from "@/lib/types";
import { BranchActionsMenu } from "./branch-actions-menu";

export function BranchCard({ branch, onEdit, onToggleBlock, onDelete }: any) {
    return (
        <div className={`rounded-lg border border-border bg-card p-4 transition-opacity ${branch.status === "blocked" ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{branch.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{branch.location}</p>
                </div>
                <BranchActionsMenu branch={branch} onEdit={onEdit} onToggleBlock={onToggleBlock} onDelete={onDelete} />
            </div>

            <div className="mb-3">
                {branch.assignedAdmin ? (
                    <div className="flex items-center gap-2 rounded-lg bg-background/50 p-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{branch.assignedAdmin.name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-foreground truncate">{branch.assignedAdmin.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{branch.assignedAdmin.email}</p>
                        </div>
                    </div>
                ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-500">
                        <Users className="h-3 w-3" /> No Admin Assigned
                    </span>
                )}
            </div>

            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${branch.status === "active" ? "bg-emerald-500/10 text-emerald-700" : "bg-red-500/10 text-red-700"}`}>
                <span className={`h-2 w-2 rounded-full ${branch.status === "active" ? "bg-emerald-600" : "bg-red-600"}`} />
                {branch.status === "active" ? "Active" : "Blocked"}
            </span>
        </div>
    );
}