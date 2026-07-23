import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { ExpenseType, NewExpenseForm } from "../../types/finance";
import { EXPENSE_TYPES } from "../../constants/finance";


interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    newExpense: NewExpenseForm;
    setNewExpense: React.Dispatch<React.SetStateAction<NewExpenseForm>>;
    onSubmit: () => void;
}

export const RecordExpenseSheet: React.FC<Props> = ({
    isOpen,
    onOpenChange,
    newExpense,
    setNewExpense,
    onSubmit,
}) => {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col justify-between">
                <div>
                    <SheetHeader className="border-b border-border pb-4">
                        <SheetTitle>Record Expense / Cash Out</SheetTitle>
                    </SheetHeader>

                    <div className="py-6 space-y-6">
                        {/* Amount Input */}
                        <div>
                            <label className="text-sm font-semibold text-foreground block mb-2">
                                Amount (LKR) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={newExpense.amount}
                                onChange={(e) =>
                                    setNewExpense({ ...newExpense, amount: e.target.value })
                                }
                                className="w-full px-4 py-3 text-lg bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                            />
                        </div>

                        {/* Expense Type Dropdown */}
                        <div>
                            <label className="text-sm font-semibold text-foreground block mb-2">
                                Expense Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={newExpense.type}
                                onChange={(e) =>
                                    setNewExpense({
                                        ...newExpense,
                                        type: e.target.value as ExpenseType,
                                    })
                                }
                                className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                {EXPENSE_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description Textarea */}
                        <div>
                            <label className="text-sm font-semibold text-foreground block mb-2">
                                Description/Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Why is this money being taken from the branch register?"
                                value={newExpense.description}
                                onChange={(e) =>
                                    setNewExpense({ ...newExpense, description: e.target.value })
                                }
                                className="w-full px-4 py-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary min-h-24 resize-none"
                            />
                        </div>

                        {/* Alert */}
                        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3 flex gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                This transaction will be logged and audited. Ensure all details are accurate.
                            </p>
                        </div>
                    </div>
                </div>

                <SheetFooter className="border-t border-border pt-4 gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700">
                        Submit Record
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};