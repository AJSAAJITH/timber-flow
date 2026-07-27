"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { Branch } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";



// Components
import { BranchCard } from "@/components/branch-management/branch-card";
import { BranchTable } from "@/components/branch-management/branch-table";
import { BranchMetrics } from "@/components/branch-management/branch-metrics";
import { SearchFilterBar } from "@/components/branch-management/search-filter-bar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { createBranch, deleteBranch, getAvailableAdmins, getBranches, toggleBranchStatus, updateBranch, } from "@/actions/branch";
import { BranchFormDialog, DeleteBranchDialog } from "@/components/branch-management/branch-dialogs";

interface AdminOption {
    id: string;
    name: string;
    email: string;
}

export default function BranchManagementPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [admins, setAdmins] = useState<AdminOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">("all");

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [formData, setFormData] = useState({ name: "", location: "", assignedAdminId: "" });
    const [errorMessage, setErrorMessage] = useState("");

    // Load Initial Data from DB
    const loadData = async () => {
        setIsLoading(true);
        const [branchesRes, adminsRes] = await Promise.all([
            getBranches(),
            getAvailableAdmins(),
        ]);

        if (branchesRes.success && branchesRes.data) {
            setBranches(branchesRes.data);
        }
        if (adminsRes.success && adminsRes.data) {
            setAdmins(adminsRes.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

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
        setErrorMessage("");
        setIsCreateDialogOpen(true);
    };

    const handleOpenEdit = (branch: Branch) => {
        setSelectedBranch(branch);
        setFormData({
            name: branch.name,
            location: branch.location || "",
            assignedAdminId: branch.assignedAdmin?.id || "",
        });
        setErrorMessage("");
        setIsCreateDialogOpen(true);
    };

    // Save Branch (Create or Update)
    const handleSaveBranch = async () => {
        if (!formData.name.trim()) {
            setErrorMessage("Branch Name is required.");
            return;
        }

        setErrorMessage("");

        startTransition(async () => {
            if (selectedBranch) {
                // UPDATE Existing Branch
                const res = await updateBranch(selectedBranch.id, {
                    name: formData.name,
                    location: formData.location,
                    adminUserId: formData.assignedAdminId || null,
                });

                if (res.success) {
                    setIsCreateDialogOpen(false);
                    await loadData();
                } else {
                    setErrorMessage(res.error || "Failed to update branch");
                }
            } else {
                // CREATE New Branch
                const res = await createBranch({
                    name: formData.name,
                    location: formData.location,
                    adminUserId: formData.assignedAdminId || undefined,
                });

                if (res.success) {
                    setIsCreateDialogOpen(false);
                    await loadData();
                } else {
                    setErrorMessage(res.error || "Failed to create branch");
                }
            }
        });
    };

    // Block/Unblock Logic
    const handleToggleBlockStatus = (branch: Branch) => {
        startTransition(async () => {
            const res = await toggleBranchStatus(branch.id);
            if (res.success && res.data) {
                setBranches((prev) =>
                    prev.map((b) =>
                        b.id === branch.id
                            ? { ...b, status: res.data.isBlocked ? "blocked" : "active" }
                            : b
                    )
                );
            }
        });
    };

    // Delete Logic
    const handleOpenDeleteDialog = (branch: Branch) => {
        setSelectedBranch(branch);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedBranch) return;

        startTransition(async () => {
            const res = await deleteBranch(selectedBranch.id);
            if (res.success) {
                setBranches((prev) => prev.filter((b) => b.id !== selectedBranch.id));
                setIsDeleteDialogOpen(false);
                setSelectedBranch(null);
            }
        });
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

                {isLoading ? (
                    <div className="flex justify-center items-center py-12 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading branches...
                    </div>
                ) : (
                    <>
                        {/* Mobile View */}
                        <div className="grid grid-cols-1 gap-4 lg:hidden">
                            {filteredBranches.map((branch) => (
                                <BranchCard
                                    key={branch.id}
                                    branch={branch}
                                    onEdit={handleOpenEdit}
                                    onToggleBlock={handleToggleBlockStatus}
                                    onDelete={handleOpenDeleteDialog}
                                />
                            ))}
                        </div>

                        {/* Desktop View */}
                        <BranchTable
                            branches={filteredBranches}
                            onEdit={handleOpenEdit}
                            onToggleBlock={handleToggleBlockStatus}
                            onDelete={handleOpenDeleteDialog}
                        />
                    </>
                )}
            </div>

            {/* Dialogs */}
            <BranchFormDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                selectedBranch={selectedBranch}
                formData={formData}
                setFormData={setFormData}
                onSave={handleSaveBranch}
                admins={admins}
                isPending={isPending}
                errorMessage={errorMessage}
            />

            <DeleteBranchDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                branch={selectedBranch}
                onConfirm={handleConfirmDelete}
                isPending={isPending}
            />
        </div>
    );
}