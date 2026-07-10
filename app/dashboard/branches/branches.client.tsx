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
    Filter,
    MoreVertical,
    Edit2,
    Lock,
    Unlock,
    Trash2,
    AlertCircle,
    Building2,
    Users,
    CheckCircle,
} from "lucide-react"

// Types
interface Branch {
    id: string
    name: string
    location: string
    status: "active" | "blocked"
    createdAt: string
    assignedAdmin: {
        id: string
        name: string
        email: string
    } | null
}

// Mock data
const MOCK_BRANCHES: Branch[] = [
    {
        id: "1",
        name: "Main Branch",
        location: "Colombo, Western Province",
        status: "active",
        createdAt: "2024-01-15",
        assignedAdmin: {
            id: "admin1",
            name: "Roshan Kumar",
            email: "roshan@timberflow.com",
        },
    },
    {
        id: "2",
        name: "Negombo Branch",
        location: "Negombo, Western Province",
        status: "active",
        createdAt: "2024-02-20",
        assignedAdmin: {
            id: "admin2",
            name: "Priya Perera",
            email: "priya@timberflow.com",
        },
    },
    {
        id: "3",
        name: "Kandy Branch",
        location: "Kandy, Central Province",
        status: "active",
        createdAt: "2024-03-10",
        assignedAdmin: null,
    },
    {
        id: "4",
        name: "Galle Branch",
        location: "Galle, Southern Province",
        status: "blocked",
        createdAt: "2024-04-05",
        assignedAdmin: {
            id: "admin3",
            name: "Anura Silva",
            email: "anura@timberflow.com",
        },
    },
    {
        id: "5",
        name: "Jaffna Branch",
        location: "Jaffna, Northern Province",
        status: "active",
        createdAt: "2024-04-18",
        assignedAdmin: null,
    },
]

const MOCK_ADMINS = [
    { id: "admin1", name: "Roshan Kumar", email: "roshan@timberflow.com" },
    { id: "admin2", name: "Priya Perera", email: "priya@timberflow.com" },
    { id: "admin3", name: "Anura Silva", email: "anura@timberflow.com" },
    { id: "admin4", name: "Nisha Gupta", email: "nisha@timberflow.com" },
]

export default function BranchManagementPage() {
    const [branches, setBranches] = useState<Branch[]>(MOCK_BRANCHES)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">(
        "all"
    )
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        assignedAdminId: "",
    })

    // Filter branches
    const filteredBranches = useMemo(() => {
        return branches.filter((branch) => {
            const matchesSearch =
                branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                branch.location.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus =
                statusFilter === "all" || branch.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [branches, searchQuery, statusFilter])

    // Metrics
    const totalBranches = branches.length
    const activeBranches = branches.filter((b) => b.status === "active").length
    const blockedBranches = branches.filter((b) => b.status === "blocked").length

    // Handlers
    const handleOpenCreateDialog = () => {
        setSelectedBranch(null)
        setFormData({ name: "", location: "", assignedAdminId: "" })
        setIsCreateDialogOpen(true)
    }

    const handleOpenEditDialog = (branch: Branch) => {
        setSelectedBranch(branch)
        setFormData({
            name: branch.name,
            location: branch.location,
            assignedAdminId: branch.assignedAdmin?.id || "",
        })
        setIsCreateDialogOpen(true)
    }

    const handleSaveBranch = () => {
        if (!formData.name.trim() || !formData.location.trim()) {
            alert("Please fill in all required fields")
            return
        }

        if (selectedBranch) {
            // Update existing
            setBranches((prev) =>
                prev.map((b) =>
                    b.id === selectedBranch.id
                        ? {
                            ...b,
                            name: formData.name,
                            location: formData.location,
                            assignedAdmin:
                                MOCK_ADMINS.find((a) => a.id === formData.assignedAdminId) ||
                                null,
                        }
                        : b
                )
            )
        } else {
            // Create new
            const newBranch: Branch = {
                id: String(branches.length + 1),
                name: formData.name,
                location: formData.location,
                status: "active",
                createdAt: new Date().toISOString().split("T")[0],
                assignedAdmin:
                    MOCK_ADMINS.find((a) => a.id === formData.assignedAdminId) || null,
            }
            setBranches((prev) => [...prev, newBranch])
        }

        setIsCreateDialogOpen(false)
    }

    const handleToggleBlockStatus = (branch: Branch) => {
        setBranches((prev) =>
            prev.map((b) =>
                b.id === branch.id
                    ? {
                        ...b,
                        status: b.status === "active" ? "blocked" : "active",
                    }
                    : b
            )
        )
    }

    const handleOpenDeleteDialog = (branch: Branch) => {
        setSelectedBranch(branch)
        setIsDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (selectedBranch) {
            setBranches((prev) => prev.filter((b) => b.id !== selectedBranch.id))
            setIsDeleteDialogOpen(false)
            setSelectedBranch(null)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="border-b border-border bg-card/50">
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                Branch Management
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage all branches across your organization
                            </p>
                        </div>
                        <Button
                            onClick={handleOpenCreateDialog}
                            className="flex w-full items-center justify-center gap-2 sm:w-auto"
                            size="lg"
                        >
                            <Plus className="h-5 w-5" />
                            Add New Branch
                        </Button>
                    </div>

                    {/* Metric Cards */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-border bg-background/50 p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-500/10 p-3">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Total Branches
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {totalBranches}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-border bg-background/50 p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-emerald-500/10 p-3">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Active Branches
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {activeBranches}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-border bg-background/50 p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-red-500/10 p-3">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Blocked Branches
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {blockedBranches}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4 sm:p-6 md:p-8">
                {/* Search & Filter Bar */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search branch name or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value as "all" | "active" | "blocked")
                            }
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="grid grid-cols-1 gap-4 lg:hidden">
                    {filteredBranches.map((branch) => (
                        <BranchCard
                            key={branch.id}
                            branch={branch}
                            onEdit={handleOpenEditDialog}
                            onToggleBlock={handleToggleBlockStatus}
                            onDelete={handleOpenDeleteDialog}
                        />
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block rounded-lg border border-border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Branch Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Assigned Admin</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBranches.map((branch) => (
                                <TableRow
                                    key={branch.id}
                                    className={branch.status === "blocked" ? "opacity-60" : ""}
                                >
                                    <TableCell className="font-medium">{branch.name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {branch.location}
                                    </TableCell>
                                    <TableCell>
                                        {branch.assignedAdmin ? (
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {branch.assignedAdmin.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {branch.assignedAdmin.email}
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-500">
                                                <Users className="h-3 w-3" />
                                                No Admin Assigned
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${branch.status === "active"
                                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-500"
                                                    : "bg-red-500/10 text-red-700 dark:text-red-500"
                                                }`}
                                        >
                                            <span
                                                className={`h-2 w-2 rounded-full ${branch.status === "active"
                                                        ? "bg-emerald-600"
                                                        : "bg-red-600"
                                                    }`}
                                            />
                                            {branch.status === "active" ? "Active" : "Blocked"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <BranchActionsMenu
                                            branch={branch}
                                            onEdit={handleOpenEditDialog}
                                            onToggleBlock={handleToggleBlockStatus}
                                            onDelete={handleOpenDeleteDialog}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {filteredBranches.length === 0 && (
                    <div className="flex items-center justify-center rounded-lg border border-border border-dashed bg-background/50 py-12">
                        <p className="text-muted-foreground">No branches found</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Branch Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedBranch ? "Edit Branch Details" : "Add New Branch"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedBranch
                                ? "Update branch information"
                                : "Create a new branch in your organization"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-2">
                                Branch Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                placeholder="e.g., Main Branch"
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground block mb-2">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({ ...formData, location: e.target.value })
                                }
                                placeholder="e.g., 123 Main Street, Colombo, Western Province"
                                rows={3}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground block mb-2">
                                Assign Branch Admin
                            </label>
                            <select
                                value={formData.assignedAdminId}
                                onChange={(e) =>
                                    setFormData({ ...formData, assignedAdminId: e.target.value })
                                }
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Select an admin...</option>
                                {MOCK_ADMINS.map((admin) => (
                                    <option key={admin.id} value={admin.id}>
                                        {admin.name} ({admin.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveBranch}>
                            {selectedBranch ? "Update Branch" : "Create Branch"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Branch</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-foreground">
                                {selectedBranch?.name}
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Branch
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Branch Card Component (Mobile)
function BranchCard({
    branch,
    onEdit,
    onToggleBlock,
    onDelete,
}: {
    branch: Branch
    onEdit: (branch: Branch) => void
    onToggleBlock: (branch: Branch) => void
    onDelete: (branch: Branch) => void
}) {
    return (
        <div
            className={`rounded-lg border border-border bg-card p-4 transition-opacity ${branch.status === "blocked" ? "opacity-60" : ""
                }`}
        >
            {/* Header with Actions */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                        {branch.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                        {branch.location}
                    </p>
                </div>
                <BranchActionsMenu
                    branch={branch}
                    onEdit={onEdit}
                    onToggleBlock={onToggleBlock}
                    onDelete={onDelete}
                />
            </div>

            {/* Admin Badge */}
            <div className="mb-3">
                {branch.assignedAdmin ? (
                    <div className="flex items-center gap-2 rounded-lg bg-background/50 p-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                                {branch.assignedAdmin.name.charAt(0)}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-foreground truncate">
                                {branch.assignedAdmin.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {branch.assignedAdmin.email}
                            </p>
                        </div>
                    </div>
                ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-500">
                        <Users className="h-3 w-3" />
                        No Admin Assigned
                    </span>
                )}
            </div>

            {/* Status Badge */}
            <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${branch.status === "active"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-500"
                        : "bg-red-500/10 text-red-700 dark:text-red-500"
                    }`}
            >
                <span
                    className={`h-2 w-2 rounded-full ${branch.status === "active" ? "bg-emerald-600" : "bg-red-600"
                        }`}
                />
                {branch.status === "active" ? "Active" : "Blocked"}
            </span>
        </div>
    )
}

// Branch Actions Menu Component
function BranchActionsMenu({
    branch,
    onEdit,
    onToggleBlock,
    onDelete,
}: {
    branch: Branch
    onEdit: (branch: Branch) => void
    onToggleBlock: (branch: Branch) => void
    onDelete: (branch: Branch) => void
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-2">
                <div className="space-y-1">
                    <button
                        onClick={() => onEdit(branch)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                        <Edit2 className="h-4 w-4" />
                        Edit Branch Details
                    </button>

                    <button
                        onClick={() => onToggleBlock(branch)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                        {branch.status === "active" ? (
                            <>
                                <Lock className="h-4 w-4" />
                                Block Branch
                            </>
                        ) : (
                            <>
                                <Unlock className="h-4 w-4" />
                                Unblock Branch
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => onDelete(branch)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Branch
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
