import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'

interface ProductSearchHeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onCreateClick: () => void;
}

export function ProductSearchHeader({
    searchQuery,
    onSearchChange,
    onCreateClick,
}: ProductSearchHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
                <label className="text-xs font-semibold text-muted-foreground">Search</label>
                <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>
            <Button
                onClick={onCreateClick}
                className="min-h-[44px] w-full sm:w-auto gap-2"
            >
                <Plus className="h-4 w-4" />
                Create Product
            </Button>
        </div>
    )
}