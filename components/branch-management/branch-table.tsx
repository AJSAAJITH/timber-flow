import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Branch } from "@/lib/types";
import { BranchActionsMenu } from "./branch-actions-menu";

interface Props {
    branches: Branch[];
    onEdit: (branch: Branch) => void;
    onToggleBlock: (branch: Branch) => void;
    onDelete: (branch: Branch) => void;
}

export function BranchTable({ branches, onEdit, onToggleBlock, onDelete }: Props) {
    return (
        <div className="hidden lg:block border rounded-lg overflow-hidden">
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
                    {branches.map((branch) => (
                        <TableRow key={branch.id}>
                            <TableCell className="font-medium">{branch.name}</TableCell>
                            <TableCell>{branch.location}</TableCell>
                            <TableCell>{branch.assignedAdmin?.name || "No Admin"}</TableCell>
                            <TableCell>
                                <span className={`capitalize ${branch.status === "active" ? "text-emerald-600" : "text-red-600"}`}>
                                    {branch.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <BranchActionsMenu
                                    branch={branch}
                                    onEdit={onEdit}
                                    onToggleBlock={onToggleBlock}
                                    onDelete={onDelete}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}