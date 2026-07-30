// components/dashboard/branch-switcher.tsx
"use client";

import { useBranch } from "@/lib/branch-context";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getBranches } from "@/actions/inventory/brach-stock.action";


export function BranchSwitcher() {
    const { user, selectedBranchId, setSelectedBranchId } = useBranch();
    const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);


    useEffect(() => {
        // Super Admin ට පමණක් සියලුම Branches Fetch කර පෙන්වයි
        if (user?.role === "SUPER_ADMIN") {
            getBranches().then((res) => {
                if (res.success && res.data) {
                    setBranches(res.data);
                }
            });
        }
    }, [user]);

    // ADMIN / CASHIER සඳහා Locked Badge එකක් පමණක් පෙන්වයි
    if (user?.role !== "SUPER_ADMIN") {
        const userBranchName = user?.branch?.name || "Assigned Branch";
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary rounded-md border border-primary/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Branch: {userBranchName}
            </div>
        );
    }

    // SUPER_ADMIN සඳහා Branch Selection Dropdown එක
    return (
        <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
            <SelectTrigger className="w-[190px] h-9 text-xs font-medium">
                <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ALL">🏢 All Branches (Global)</SelectItem>
                {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                        📍 {b.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}