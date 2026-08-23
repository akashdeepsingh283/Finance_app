import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteExpense, getDashboard } from "../api/finance";
import { useAuth } from "../context/AuthContext";
import CardInfo from "../components/dashboard/CardInfo";
import BarChartDash from "../components/dashboard/BarChartDash";
import BudgetItem from "../components/dashboard/BudgetItem";
import ExpenseListTable from "../components/dashboard/ExpenseListTable";

export default function DashboardPage() {
  const { user } = useAuth();
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const dashboard = await getDashboard();
      setBudgetList(dashboard.budgetList);
      setExpensesList(dashboard.expensesList);
    } catch (error) {
      toast.error(error.message || "Unable to load the dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleDeleteExpense = async (expense) => {
    try {
      await deleteExpense(expense.id);
      toast.success("Expense deleted successfully!");
      await loadDashboard();
    } catch (error) {
      toast.error(error.message || "Unable to delete the expense.");
    }
  };

  return (
    <div className="p-5 md:p-8">
      <h1 className="text-3xl font-bold">Hi, {user?.name || "there"}</h1>
      <p className="text-gray-800">📊 Visualize Your Finances, Track Every Dollar with Insight!</p>
      <CardInfo budgetList={budgetList} />

      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
        <div className="md:col-span-2">
          <BarChartDash budgetList={budgetList} />
          <ExpenseListTable expensesList={expensesList} refreshData={loadDashboard} onDelete={handleDeleteExpense} />
        </div>
        <div>
          <h2 className="text-lg font-bold">Latest Budgets</h2>
          <div className="scrollbar-hidden grid max-h-[650px] gap-2 overflow-y-auto scroll-smooth">
            {loading && [1, 2, 3].map((item) => <div key={item} className="h-[145px] animate-pulse rounded-lg bg-slate-200" />)}
            {!loading && budgetList.map((budget) => <BudgetItem budgets={budget} key={budget.id} />)}
            {!loading && !budgetList.length && <p className="p-4 text-sm text-gray-500">Create a budget to see it here.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
