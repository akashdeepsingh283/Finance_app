import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteExpense, getExpenses } from "../api/finance";
import ExpenseListTable from "../components/dashboard/ExpenseListTable";

export default function ExpensesPage() {
  const [expensesList, setExpensesList] = useState([]);

  const loadExpenses = useCallback(async () => {
    try {
      setExpensesList(await getExpenses());
    } catch (error) {
      toast.error(error.message || "Unable to load expenses.");
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleDeleteExpense = async (expense) => {
    try {
      await deleteExpense(expense.id);
      toast.success("Expense deleted successfully!");
      await loadExpenses();
    } catch (error) {
      toast.error(error.message || "Unable to delete the expense.");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">My Expenses</h1>
      <ExpenseListTable expensesList={expensesList} refreshData={loadExpenses} onDelete={handleDeleteExpense} />
    </div>
  );
}
