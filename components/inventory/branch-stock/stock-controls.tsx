import { Search } from "lucide-react";

interface StockControlsProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    selectedBranch: string;
    onBranchChange: (val: string) => void;
    branches: string[];
}

export function StockControls({ searchQuery, onSearchChange, selectedBranch, onBranchChange, branches }: StockControlsProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            <div className="flex-1">
                <label className="text-xs font-semibold text-muted-foreground">Search</label>
                <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Search by product name or SKU..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
            </div>
            <div>
                <label className="text-xs font-semibold text-muted-foreground">Branch</label>
                <select value={selectedBranch} onChange={(e) => onBranchChange(e.target.value)} className="w-full sm:w-48 mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
                    {branches.map((b) => <option key={b}>{b}</option>)}
                </select>
            </div>
        </div>
    );
}