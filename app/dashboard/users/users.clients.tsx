"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Lock,
    Unlock,
    Trash2,
    AlertCircle,
    Users,
    Shield,
    UserCheck,
} from "lucide-react"

// Types
interface User {
    id: string
    name: string
    email: string
    role: "SUPER_ADMIN" | "ADMIN" | "CASHIER"
    branch: string
    status: "active" | "blocked"
    joinedDate: string
}

// Mock Users Data
const MOCK_USERS: User[] = [
    {
        id: "1",
        name: "Roshan Kumar",
        email: "roshan@timberflow.com",
        role: "SUPER_ADMIN",
        branch: "Main Branch",
        status: "active",
        joinedDate: "2024-01-15",
    },
    {
        id: "2",
        name: "Priya Perera",
        email: "priya@timberflow.com",
        role: "ADMIN",
        branch: "Negombo Branch",
        status: "active",
        joinedDate: "2024-02-20",
    },
    {
        id: "3",
        name: "Anura Silva",
        email: "anura@timberflow.com",
        role: "ADMIN",
        branch: "Galle Branch",
        status: "active",
        joinedDate: "2024-03-10",
    },
    {
        id: "4",
        name: "Nimal Jayasuriya",
        email: "nimal@timberflow.com",
        role: "CASHIER",
        branch: "Main Branch",
        status: "active",
        joinedDate: "2024-04-05",
    },
    {
        id: "5",
        name: "Lakshmi Wijesinghe",
        email: "lakshmi@timberflow.com",
        role: "CASHIER",
        branch: "Negombo Branch",
        status: "blocked",
        joinedDate: "2024-04-15",
    },
    {
        id: "6",
        name: "Keshan Bandara",
        email: "keshan@timberflow.com",
        role: "CASHIER",
        branch: "Galle Branch",
        status: "active",
        joinedDate: "2024-05-01",
    },
    {
        id: "7",
        name: "Samantha De Silva",
        email: "samantha@timberflow.com",
        role: "ADMIN",
        branch: "Kandy Branch",
        status: "active",
        joinedDate: "2024-05-10",
    },
    {
        id: "8",
        name: "Rajiv Menon",
        email: "rajiv@timberflow.com",
        role: "CASHIER",
        branch: "Kandy Branch",
        status: "blocked",
        joinedDate: "2024-05-20",
    },
]

const MOCK_BRANCHES = [
    "Main Branch",
    "Negombo Branch",
    "Galle Branch",
    "Kandy Branch",
]

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
    SUPER_ADMIN: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
    ADMIN: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
    CASHIER: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
}

export default function UsersPageClent() {
    const [users, setUsers] = useState<User[]>(MOCK_USERS)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRole, setSelectedRole] = useState("All")
    const [selectedBranch, setSelectedBranch] = useState("All")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    // 💡 Explicitly typed formData state to allow dynamic role assignment
    const [formData, setFormData] = useState<{
        name: string
        email: string
        role: User["role"]
        branch: string
    }>({
        name: "",
        email: "",
        role: "CASHIER",
        branch: "Main Branch",
    })

    // Filter users
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesRole = selectedRole === "All" || user.role === selectedRole
            const matchesBranch =
                selectedBranch === "All" || user.branch === selectedBranch
            return matchesSearch && matchesRole && matchesBranch
        })
    }, [searchQuery, selectedRole, selectedBranch, users])

    // Calculate stats
    const stats = useMemo(() => {
        return {
            total: users.length,
            admins: users.filter((u) => u.role === "ADMIN").length,
            cashiers: users.filter((u) => u.role === "CASHIER").length,
            blocked: users.filter((u) => u.status === "blocked").length,
        }
    }, [users])

    // Add new user
    const handleAddUser = () => {
        if (!formData.name.trim() || !formData.email.trim()) return

        const newUser: User = {
            id: Date.now().toString(),
            ...formData,
            status: "active",
            joinedDate: new Date().toISOString().split("T")[0],
        }
        setUsers([...users, newUser])
        setIsAddDialogOpen(false)
        setFormData({ name: "", email: "", role: "CASHIER", branch: "Main Branch" })
    }

    // Toggle block status
    const handleToggleBlock = (userId: string) => {
        setUsers(
            users.map((u) =>
                u.id === userId
                    ? { ...u, status: u.status === "active" ? "blocked" : "active" }
                    : u
            )
        )
    }

    // Delete user
    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter((u) => u.id !== userId))
        setIsDeleteDialogOpen(false)
        setSelectedUser(null)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="border-b border-border bg-card/50 p-4 sm:p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage team members and user permissions
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="min-h-[44px] w-full sm:w-auto gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add New User
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="rounded-lg border border-border bg-background/50 p-4">
                        <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background/50 p-4">
                        <p className="text-sm font-medium text-muted-foreground">Admins</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stats.admins}
                        </p>
                    </div>
                    <div className="rounded-lg border border-border bg-background/50 p-4">
                        <p className="text-sm font-medium text-muted-foreground">Cashiers</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {stats.cashiers}
                        </p>
                    </div>
                    <div className="rounded-lg border border-border bg-background/50 p-4">
                        <p className="text-sm font-medium text-muted-foreground">Blocked</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {stats.blocked}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 md:p-8">
                {/* Search and Filters */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                    <div className="flex-1">
                        <label className="text-xs font-semibold text-muted-foreground">
                            Search
                        </label>
                        <div className="relative mt-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-muted-foreground">
                            Role
                        </label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full sm:w-48 mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option>All</option>
                            <option>SUPER_ADMIN</option>
                            <option>ADMIN</option>
                            <option>CASHIER</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-muted-foreground">
                            Branch
                        </label>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="w-full sm:w-48 mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option>All</option>
                            {MOCK_BRANCHES.map((branch) => (
                                <option key={branch}>{branch}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className={`rounded-lg border border-border bg-card p-4 transition-opacity ${user.status === "blocked" ? "opacity-60" : ""
                                }`}
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex gap-3 flex-1 min-w-0">
                                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-foreground truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="min-h-[36px] min-w-[36px] flex items-center justify-center hover:bg-secondary rounded transition-colors active:scale-95">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent align="end" className="w-48 p-0">
                                        <div className="flex flex-col">
                                            <button className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors">
                                                <Edit2 className="h-4 w-4" />
                                                Edit User Details
                                            </button>
                                            <button className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors">
                                                <UserCheck className="h-4 w-4" />
                                                Change Branch
                                            </button>
                                            <button
                                                onClick={() => handleToggleBlock(user.id)}
                                                className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors"
                                            >
                                                {user.status === "active" ? (
                                                    <>
                                                        <Lock className="h-4 w-4" />
                                                        Block User
                                                    </>
                                                ) : (
                                                    <>
                                                        <Unlock className="h-4 w-4" />
                                                        Unblock User
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user)
                                                    setIsDeleteDialogOpen(true)
                                                }}
                                                className="px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors border-t border-border"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete User
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <p className="text-muted-foreground">Role</p>
                                    <div
                                        className={`mt-1 inline-block px-2 py-1 rounded-full font-medium ${ROLE_COLORS[user.role].bg
                                            } ${ROLE_COLORS[user.role].text}`}
                                    >
                                        {user.role === "SUPER_ADMIN"
                                            ? "Super Admin"
                                            : user.role === "ADMIN"
                                                ? "Admin"
                                                : "Cashier"}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Status</p>
                                    <div className="mt-1">
                                        {user.status === "active" ? (
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                                Blocked
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                    <strong>Branch:</strong> {user.branch}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    <strong>Joined:</strong> {new Date(user.joinedDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-border bg-secondary/50">
                                <TableHead className="h-12">User</TableHead>
                                <TableHead className="h-12">Role</TableHead>
                                <TableHead className="h-12">Branch</TableHead>
                                <TableHead className="h-12">Status</TableHead>
                                <TableHead className="h-12 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className={`border-b border-border hover:bg-secondary/30 transition-colors ${user.status === "blocked" ? "opacity-60" : ""
                                        }`}
                                >
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                                {getInitials(user.name)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role].bg
                                                } ${ROLE_COLORS[user.role].text}`}
                                        >
                                            {user.role === "SUPER_ADMIN"
                                                ? "Super Admin"
                                                : user.role === "ADMIN"
                                                    ? "Admin"
                                                    : "Cashier"}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-sm text-foreground">
                                        {user.branch}
                                    </TableCell>

                                    <TableCell>
                                        {user.status === "active" ? (
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                                Blocked
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="min-h-[36px] min-w-[36px] flex items-center justify-center hover:bg-secondary rounded transition-colors active:scale-95">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent align="end" className="w-48 p-0">
                                                <div className="flex flex-col">
                                                    <button className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors">
                                                        <Edit2 className="h-4 w-4" />
                                                        Edit User Details
                                                    </button>
                                                    <button className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors">
                                                        <Users className="h-4 w-4" />
                                                        Change Branch
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleBlock(user.id)}
                                                        className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors"
                                                    >
                                                        {user.status === "active" ? (
                                                            <>
                                                                <Lock className="h-4 w-4" />
                                                                Block User
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Unlock className="h-4 w-4" />
                                                                Unblock User
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setIsDeleteDialogOpen(true)
                                                        }}
                                                        className="px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors border-t border-border"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete User
                                                    </button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-12 text-center">
                        <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                            No users found matching your criteria
                        </p>
                    </div>
                )}
            </div>

            {/* Add User Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Create a new user account with the required information
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Select Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        role: e.target.value as User["role"],
                                    })
                                }
                                className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="SUPER_ADMIN">Super Admin</option>
                                <option value="ADMIN">Admin</option>
                                <option value="CASHIER">Cashier</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Assign Branch <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.branch}
                                onChange={(e) =>
                                    setFormData({ ...formData, branch: e.target.value })
                                }
                                className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                {MOCK_BRANCHES.map((branch) => (
                                    <option key={branch}>{branch}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAddUser}>Create User</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            Delete User
                        </DialogTitle>
                    </DialogHeader>

                    <p className="text-muted-foreground">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-foreground">
                            {selectedUser?.name}
                        </span>
                        ? This action cannot be undone.
                    </p>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
                        >
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}