import { Search, Filter } from "lucide-react";

interface SearchFilterBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: "all" | "active" | "blocked";
    setStatusFilter: (filter: "all" | "active" | "blocked") => void;
}

export function SearchFilterBar({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter
}: SearchFilterBarProps) {
    return (
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
                    onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "blocked")}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>
        </div>
    );
}