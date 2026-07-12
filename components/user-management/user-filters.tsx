"use client"

import React from "react";
import { Search } from "lucide-react";
import { MOCK_BRANCHES } from "@/lib/constants";

export function UserFilters({
    searchQuery, setSearchQuery,
    selectedRole, setSelectedRole,
    selectedBranch, setSelectedBranch
}: any) {
    return (
        // Grid එක column 4 කට බෙදමු. Mobile වලදී 1 යි.
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">

            {/* Search - Desktop වලදී space වැඩිපුර ලබා දෙන්න (col-span-2) */}
            <div className="md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">Search</label>
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

            {/* Role Filter */}
            <div className="md:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground">Role</label>
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="CASHIER">Cashier</option>
                </select>
            </div>

            {/* Branch Filter */}
            <div className="md:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground">Branch</label>
                <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="ALL">All Branches</option>
                    {MOCK_BRANCHES.map((branch) => (
                        <option key={branch} value={branch}>{branch}</option>
                    ))}
                </select>
            </div>


        </div>
    );
}