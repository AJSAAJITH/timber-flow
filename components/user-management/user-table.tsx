"use client"

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreVertical, Edit2, Lock, Unlock, Trash2, Users } from "lucide-react";

// Role colors configuration
const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
    ADMIN: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
    SUPER_ADMIN: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
    CASHIER: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300" }
};

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

export function UserTable({ users, onToggleBlock, onDelete }: any) {
    return (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-border bg-secondary/50">
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user: any) => (
                        <TableRow key={user.id} className={`border-b border-border hover:bg-secondary/30 transition-colors ${user.status === "blocked" ? "opacity-60" : ""}`}>
                            <TableCell className="py-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                        {getInitials(user.name)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role]?.bg || "bg-gray-100"} ${ROLE_COLORS[user.role]?.text || "text-gray-700"}`}>
                                    {user.role}
                                </div>
                            </TableCell>
                            <TableCell className="text-sm text-foreground">{user.branch}</TableCell>
                            <TableCell>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {user.status === "active" ? "Active" : "Blocked"}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent align="end" className="w-48 p-0">
                                        <div className="flex flex-col">
                                            <button className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors">
                                                <Edit2 className="h-4 w-4" /> Edit Details
                                            </button>
                                            <button className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors">
                                                <Users className="h-4 w-4" /> Change Branch
                                            </button>
                                            <button onClick={() => onToggleBlock(user.id)} className="px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors">
                                                {user.status === "active" ? <><Lock className="h-4 w-4" /> Block User</> : <><Unlock className="h-4 w-4" /> Unblock User</>}
                                            </button>
                                            <button onClick={() => onDelete(user)} className="px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors border-t border-border">
                                                <Trash2 className="h-4 w-4" /> Delete User
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
    );
}