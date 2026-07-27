"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { UserStats } from "@/components/user-management/user-stats"
import { UserTable } from "@/components/user-management/user-table"
import { AddUserDialog } from "@/components/user-management/add-user-dialog"
import { EditUserDialog } from "@/components/user-management/edit-user-dialog"
import { ChangeBranchDialog } from "@/components/user-management/change-branch-dialog"
import { DeleteUserDialog } from "@/components/user-management/delete-user-dialog"
import { UserFilters } from "@/components/user-management/user-filters"

// Existing Server Actions Imports
import {
    getUsers,
    createUser,
    updateUser,
    changeUserBranch,
    toggleUserBlockStatus,
    deleteUser
} from "@/actions/user"

// Direct Import from your actions/branch.ts
import { getAllBranches } from "@/actions/branch"

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [branches, setBranches] = useState<{ id: string; name: string }[]>([])
    const [loading, setLoading] = useState(true)

    // Dialog States
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isChangeBranchOpen, setIsChangeBranchOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // Selected User State
    const [selectedUser, setSelectedUser] = useState<any>(null)

    // Filter States
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRole, setSelectedRole] = useState("ALL")
    const [selectedBranch, setSelectedBranch] = useState("ALL")

    // Fetch initial users and branches simultaneously
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true)
            const [usersRes, branchesRes] = await Promise.all([
                getUsers(),
                getAllBranches()
            ])

            if (usersRes.success && usersRes.data) {
                setUsers(usersRes.data)
            }
            if (branchesRes.success && branchesRes.data) {
                setBranches(branchesRes.data)
            }
            setLoading(false)
        }

        loadInitialData()
    }, [])

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = selectedRole === "ALL" || user.role === selectedRole;
            const matchesBranch = selectedBranch === "ALL" || user.branch === selectedBranch;
            return matchesSearch && matchesRole && matchesBranch;
        });
    }, [users, searchQuery, selectedRole, selectedBranch]);

    // Handlers
    const handleAddUser = async (formData: any) => {
        const response = await createUser(formData);
        if (response.success) {
            setUsers(prev => [response.data, ...prev]);
            setIsAddDialogOpen(false);
        } else {
            alert(response.error || "Failed to create user");
        }
    }

    const handleUpdateUser = async (formData: any) => {
        const response = await updateUser(formData);
        if (response.success) {
            setUsers(prev => prev.map(u => u.id === formData.id ? { ...u, ...response.data } : u));
            setIsEditDialogOpen(false);
            setSelectedUser(null);
        } else {
            alert(response.error || "Failed to update user");
        }
    }

    const handleChangeBranch = async (userId: string, branchId: string) => {
        const response = await changeUserBranch({ userId, branchId });
        if (response.success) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, branch: response.data.branch } : u));
            setIsChangeBranchOpen(false);
            setSelectedUser(null);
        } else {
            alert(response.error || "Failed to change branch");
        }
    }

    const handleToggleBlock = async (user: any) => {
        const isBlocked = user.status === "blocked";
        const response = await toggleUserBlockStatus(user.id, isBlocked);
        if (response.success) {
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: response.data.status } : u));
        } else {
            alert(response.error || "Failed to update user status");
        }
    }

    const confirmDelete = async () => {
        if (!selectedUser) return;
        const response = await deleteUser(selectedUser.id);
        if (response.success) {
            setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
        } else {
            alert(response.error || "Failed to delete user");
        }
    }

    // Trigger Dialog Handlers
    const initiateEdit = (user: any) => {
        setSelectedUser(user);
        setIsEditDialogOpen(true);
    }

    const initiateChangeBranch = (user: any) => {
        setSelectedUser(user);
        setIsChangeBranchOpen(true);
    }

    const initiateDelete = (user: any) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    }

    const stats = useMemo(() => ({
        total: users.length,
        admins: users.filter(u => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length,
        cashiers: users.filter(u => u.role === "CASHIER").length,
        blocked: users.filter(u => u.status === "blocked").length,
    }), [users])

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border bg-card/50 p-4 sm:p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                    </div>
                    <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" /> Add New User
                    </Button>
                </div>
                <UserStats stats={stats} />
            </div>

            <div className="p-4 sm:p-8">
                <UserFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                    selectedBranch={selectedBranch}
                    setSelectedBranch={setSelectedBranch}
                    branches={branches}
                />

                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <UserTable
                        users={filteredUsers}
                        onToggleBlock={handleToggleBlock}
                        onDelete={initiateDelete}
                        onEdit={initiateEdit}
                        onChangeBranch={initiateChangeBranch}
                    />
                )}
            </div>

            <AddUserDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onAddUser={handleAddUser}
            />

            <EditUserDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                user={selectedUser}
                onUpdateUser={handleUpdateUser}
            />

            <ChangeBranchDialog
                open={isChangeBranchOpen}
                onOpenChange={setIsChangeBranchOpen}
                user={selectedUser}
                branches={branches}
                onChangeBranch={handleChangeBranch}
            />

            <DeleteUserDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                user={selectedUser}
                onConfirm={confirmDelete}
            />
        </div>
    )
}