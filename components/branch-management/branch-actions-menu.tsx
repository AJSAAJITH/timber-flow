import { MoreVertical, Edit2, Lock, Unlock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Branch } from "@/lib/types";

interface Props {
    branch: Branch;
    onEdit: (branch: Branch) => void;
    onToggleBlock: (branch: Branch) => void;
    onDelete: (branch: Branch) => void;
}

export function BranchActionsMenu({ branch, onEdit, onToggleBlock, onDelete }: Props) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-2">
                <div className="space-y-1">
                    <button onClick={() => onEdit(branch)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">
                        <Edit2 className="h-4 w-4" /> Edit Branch Details
                    </button>
                    <button onClick={() => onToggleBlock(branch)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">
                        {branch.status === "active" ? <><Lock className="h-4 w-4" /> Block Branch</> : <><Unlock className="h-4 w-4" /> Unblock Branch</>}
                    </button>
                    <button onClick={() => onDelete(branch)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" /> Delete Branch
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}