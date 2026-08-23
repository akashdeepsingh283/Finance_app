import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { deleteBudget, deleteExpense, getBudget } from "../api/finance";
import BudgetItem from "../components/dashboard/BudgetItem";
import ExpenseListTable from "../components/dashboard/ExpenseListTable";
import AddExpense from "../features/expenses/AddExpense";
import EditBudget from "../features/budgets/EditBudget";
import { Button } from "../components/ui/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

export default function BudgetExpensesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadBudget = useCallback(async () => {
    setLoading(true);
    try {
      const detail = await getBudget(id);
      setBudgetInfo(detail.budget);
      setExpensesList(detail.expenses);
    } catch (error) {
      toast.error(error.message || "Unable to load this budget.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBudget();
  }, [loadBudget]);

  const handleDeleteBudget = async () => {
    setIsDeleting(true);
    try {
      await deleteBudget(id);
      toast.success("Budget deleted successfully!");
      navigate("/dashboard/budgets", { replace: true });
    } catch (error) {
      toast.error(error.message || "Unable to delete the budget.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteExpense = async (expense) => {
    try {
      await deleteExpense(expense.id);
      toast.success("Expense deleted successfully!");
      await loadBudget();
    } catch (error) {
      toast.error(error.message || "Unable to delete the expense.");
    }
  };

  return (
    <div className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Budget Expenses</h1>
        <div className="flex gap-2">
          <EditBudget budgetInfo={budgetInfo} refreshData={loadBudget} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2" variant="destructive" disabled={!budgetInfo || isDeleting}>
                <TrashIcon /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your current budget and its expenses.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteBudget}>{isDeleting ? "Deleting…" : "Continue"}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {loading ? <div className="h-[145px] w-full animate-pulse rounded-lg bg-slate-200" /> : budgetInfo && <BudgetItem budgets={budgetInfo} />}
        {!loading && budgetInfo && <AddExpense budget={budgetInfo} budgetId={id} refreshData={loadBudget} />}
      </div>
      <div className="mt-4">
        <ExpenseListTable expensesList={expensesList} refreshData={loadBudget} onDelete={handleDeleteExpense} />
      </div>
    </div>
  );
}
