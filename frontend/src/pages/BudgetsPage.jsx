import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getBudgets } from "../api/finance";
import CreateBudget from "../features/budgets/CreateBudget";
import BudgetItem from "../components/dashboard/BudgetItem";

export default function BudgetsPage() {
  const [budgetList, setBudgetList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBudgets = useCallback(async () => {
    setLoading(true);
    try {
      setBudgetList(await getBudgets());
    } catch (error) {
      toast.error(error.message || "Unable to load budgets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  return (
    <div className="p-5 md:p-10">
      <h1 className="text-3xl font-bold">My Budgets</h1>
      <div className="mt-7 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        <CreateBudget refreshData={loadBudgets} />
        {loading && [1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-[145px] w-full animate-pulse rounded-lg bg-slate-200" />)}
        {!loading && budgetList.map((budget) => <BudgetItem key={budget.id} budgets={budget} />)}
      </div>
    </div>
  );
}
