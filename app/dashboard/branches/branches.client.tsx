"use client";

import { useState, useMemo } from "react";
import { MOCK_ADMINS_Brabch, MOCK_BRANCHES_Branch } from "@/lib/constants";
import { Branch } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Components
import { BranchCard } from "@/components/branch-management/branch-card";
import { BranchTable } from "@/components/branch-management/branch-table";
import { BranchFormDialog, DeleteBranchDialog } from "@/components/branch-management/branch-dialogs";
import { BranchMetrics } from "@/components/branch-management/branch-metrics";
import { SearchFilterBar } from "@/components/branch-management/search-filter-bar";

export default function BranchManagementPage() {
    const [branches, setBranches] = useState<Branch[]>(MOCK_BRANCHES_Branch);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">("all");

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [formData, setFormData] = useState({ name: "", location: "", assignedAdminId: "" });

    // Metric Calculations
    const activeBranches = branches.filter((b) => b.status === "active").length;
    const blockedBranches = branches.filter((b) => b.status === "blocked").length;
    const totalBranches = branches.length;

    // Filter Logic
    const filteredBranches = useMemo(() => {
        return branches.filter((branch) => {
            const matchesSearch = branch.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || branch.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [branches, searchQuery, statusFilter]);

    // Handlers
    const handleOpenCreateDialog = () => {
        setSelectedBranch(null);
        setFormData({ name: "", location: "", assignedAdminId: "" });
        setIsCreateDialogOpen(true);
    };

    const handleOpenEdit = (branch: Branch) => {
        setSelectedBranch(branch);
        setFormData({ name: branch.name, location: branch.location, assignedAdminId: branch.assignedAdmin?.id || "" });
        setIsCreateDialogOpen(true);
    };

    // Block/Unblock Logic
    const handleToggleBlockStatus = (branch: Branch) => {
        setBranches((prev) =>
            prev.map((b) =>
                b.id === branch.id
                    ? { ...b, status: b.status === "active" ? "blocked" : "active" }
                    : b
            )
        );
    };

    // Delete Logic
    const handleOpenDeleteDialog = (branch: Branch) => {
        setSelectedBranch(branch);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedBranch) {
            setBranches((prev) => prev.filter((b) => b.id !== selectedBranch.id));
            setIsDeleteDialogOpen(false);
            setSelectedBranch(null);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card/50">
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Branch Management</h1>
                            <p className="mt-1 text-sm text-muted-foreground">Manage all branches across your organization</p>
                        </div>
                        <Button onClick={handleOpenCreateDialog} className="flex w-full items-center justify-center gap-2 sm:w-auto" size="lg">
                            <Plus className="h-5 w-5" /> Add New Branch
                        </Button>
                    </div>

                    <BranchMetrics
                        total={totalBranches}
                        active={activeBranches}
                        blocked={blockedBranches}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4 sm:p-6 md:p-8">
                <SearchFilterBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />

                {/* Mobile View */}
                <div className="grid grid-cols-1 gap-4 lg:hidden">
                    {filteredBranches.map(branch => (
                        <BranchCard
                            key={branch.id}
                            branch={branch}
                            onEdit={handleOpenEdit}
                            onToggleBlock={handleToggleBlockStatus} // Function එක pass කළා
                            onDelete={handleOpenDeleteDialog}       // Function එක pass කළා
                        />
                    ))}
                </div>

                {/* Desktop View */}
                <BranchTable
                    branches={filteredBranches}
                    onEdit={handleOpenEdit}
                    onToggleBlock={handleToggleBlockStatus}        // Function එක pass කළා
                    onDelete={handleOpenDeleteDialog}              // Function එක pass කළා
                />
            </div>

            {/* Dialogs */}
            <BranchFormDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                selectedBranch={selectedBranch}
                formData={formData}
                setFormData={setFormData}
                onSave={() => setIsCreateDialogOpen(false)}
                admins={MOCK_ADMINS_Brabch}
            />
            <DeleteBranchDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                branch={selectedBranch}
                onConfirm={handleConfirmDelete}              // Confirm බොත්තම වැඩ කරනවා
            />
        </div>
    );
}