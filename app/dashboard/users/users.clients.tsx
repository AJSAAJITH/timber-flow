"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MOCK_USERS } from "@/lib/constants"
import { UserStats } from "@/components/user-management/user-stats"
import { UserTable } from "@/components/user-management/user-table"
import { AddUserDialog } from "@/components/user-management/add-user-dialog"
import { UserFilters } from "@/components/user-management/user-filters"
import { DeleteUserDialog } from "@/components/user-management/delete-user-dialog"

export default function UsersPage() {
    const [users, setUsers] = useState(MOCK_USERS)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false) // Delete Dialog state
    const [selectedUser, setSelectedUser] = useState<any>(null) // Delete කිරීමට තෝරාගත් user

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("ALL");
    const [selectedBranch, setSelectedBranch] = useState("ALL");

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = selectedRole === "ALL" || user.role === selectedRole;
            const matchesBranch = selectedBranch === "ALL" || user.branch === selectedBranch;
            return matchesSearch && matchesRole && matchesBranch;
        });
    }, [users, searchQuery, selectedRole, selectedBranch]);

    const handleToggleBlock = (id: string) => {
        setUsers(prev => prev.map(user =>
            user.id === id ? { ...user, status: user.status === "active" ? "blocked" : "active" } : user
        ))
    }

    // Delete කිරීම ආරම්භ කිරීම
    const initiateDelete = (user: any) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    }

    const confirmDelete = () => {
        if (selectedUser) {
            setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
        }
    }

    const handleAddUser = (newUser: any) => {
        setUsers(prev => [...prev, { ...newUser, id: Date.now().toString(), status: "active", joinedDate: new Date().toISOString().split('T')[0] }])
        setIsAddDialogOpen(false)
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

            {/* එකම padding එකක් සහිතව තනි container එකක් */}
            <div className="p-4 sm:p-8">
                <UserFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                    selectedBranch={selectedBranch}
                    setSelectedBranch={setSelectedBranch}
                />

                <UserTable
                    users={filteredUsers}
                    onToggleBlock={handleToggleBlock}
                    onDelete={initiateDelete} // මෙතැනදී initiateDelete pass කරන්න
                />
            </div>

            <AddUserDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onAddUser={handleAddUser} />

            <DeleteUserDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                user={selectedUser}
                onConfirm={confirmDelete}
            />
        </div>
    )
}