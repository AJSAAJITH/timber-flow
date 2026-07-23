import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function BranchFormDialog({ open, onOpenChange, selectedBranch, formData, setFormData, onSave, admins }: any) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedBranch ? "Edit Branch Details" : "Add New Branch"}</DialogTitle>
                    <DialogDescription>{selectedBranch ? "Update branch information" : "Create a new branch in your organization"}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium text-foreground block mb-2">Branch Name <span className="text-red-500">*</span></label>
                        <input placeholder="e.g., Main Branch" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-foreground block mb-2">Location <span className="text-red-500">*</span></label>
                        <textarea placeholder="e.g., 123 Main Street, Colombo, Western Province" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} rows={3} className="w-full rounded-lg border border-border bg-background px-4 py-2" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-foreground block mb-2">Assign Branch Admin</label>
                        <select value={formData.assignedAdminId} onChange={(e) => setFormData({ ...formData, assignedAdminId: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2">
                            <option value="">Select an admin...</option>
                            {admins.map((admin: any) => <option key={admin.id} value={admin.id}>{admin.name} ({admin.email})</option>)}
                        </select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={onSave}>{selectedBranch ? "Update Branch" : "Create Branch"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function DeleteBranchDialog({ open, onOpenChange, branch, onConfirm }: any) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Branch</DialogTitle>
                    <DialogDescription>Are you sure you want to delete <span className="font-semibold text-foreground">{branch?.name}</span>? This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm}>Delete Branch</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}