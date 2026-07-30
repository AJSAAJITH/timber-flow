// lib/branch-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser } from "@/actions/auth";

export interface Branch {
    id: string;
    name: string;
}

interface BranchContextType {
    selectedBranchId: string;
    selectedBranchName: string; // 💡 Selected Branch Name එක Context එකට එක් කරන ලදී
    setSelectedBranchId: (id: string) => void;
    branches: Branch[];
    user: AuthUser;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({
    children,
    user,
    branches = [], // 💡 Server එකෙන් ලබාගන්නා Branches List එක මෙතැනට Pass කළ හැක
}: {
    children: React.ReactNode;
    user: AuthUser;
    branches?: Branch[];
}) {
    const [selectedBranchId, setSelectedBranchId] = useState<string>("ALL");

    useEffect(() => {
        if (user) {
            if (user.role === "SUPER_ADMIN") {
                const saved = localStorage.getItem("tf_selected_branch");
                setSelectedBranchId(saved || "ALL");
            } else if (user.branch?.id) {
                setSelectedBranchId(user.branch.id);
            }
        }
    }, [user]);

    const handleSetBranch = (id: string) => {
        setSelectedBranchId(id);
        if (user?.role === "SUPER_ADMIN") {
            localStorage.setItem("tf_selected_branch", id);
        }
    };

    // Selected ID එකට අදාළ Branch Name එක සොයා ගනී
    const selectedBranch = branches.find((b) => b.id === selectedBranchId);
    const selectedBranchName =
        selectedBranchId === "ALL"
            ? "All Branches (Global Overview)"
            : selectedBranch?.name || user?.branch?.name || "Selected Branch";

    return (
        <BranchContext.Provider
            value={{
                selectedBranchId,
                selectedBranchName,
                setSelectedBranchId: handleSetBranch,
                branches,
                user,
            }}
        >
            {children}
        </BranchContext.Provider>
    );
}

export const useBranch = () => {
    const context = useContext(BranchContext);
    if (!context) {
        throw new Error("useBranch must be used within a BranchProvider");
    }
    return context;
};