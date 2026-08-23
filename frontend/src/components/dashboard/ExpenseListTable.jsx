import { useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "sonner";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}

function formatAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(amount)
    : "$0.00";
}

function ExpenseListTable({
  expensesList = [],
  refreshData,
  onDelete,
  title = "Latest Expenses",
}) {
  const [deletingId, setDeletingId] = useState(null);
  const expenses = Array.isArray(expensesList) ? expensesList : [];

  const handleDelete = async (expense) => {
    if (!onDelete) return;

    const expenseId = expense.id || expense._id;
    setDeletingId(expenseId);

    try {
      const result = await onDelete(expense);

      if (result !== false) {
        toast.success("Expense deleted successfully!");
        await refreshData?.();
      }
    } catch (error) {
      toast.error(error?.message || "Could not delete the expense.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-3 max-h-[400px] shadow-md">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="max-h-[262px] overflow-y-auto rounded-md border-2 border-primary shadow-md scrollbar-hidden">
        <div className="grid min-w-[520px] grid-cols-4 bg-[#c3c2fe] p-2">
          <p className="font-bold">Name</p>
          <p className="font-bold">Amount</p>
          <p className="font-bold">Date</p>
          <p className="font-bold">Action</p>
        </div>

        {expenses.length ? (
          expenses.map((expense, index) => {
            const expenseId = expense.id || expense._id;
            const isDeleting = deletingId === expenseId;

            return (
              <div
                key={expenseId || `${expense.name || "expense"}-${index}`}
                className="grid min-w-[520px] grid-cols-4 bg-violet-100 p-2"
              >
                <p className="truncate pr-2">{expense.name || "Untitled expense"}</p>
                <p>{formatAmount(expense.amount)}</p>
                <p>{formatDate(expense.createdAt || expense.date)}</p>
                <div>
                  <button
                    type="button"
                    aria-label={`Delete ${expense.name || "expense"}`}
                    title={onDelete ? "Delete expense" : "Delete action unavailable"}
                    disabled={!onDelete || isDeleting}
                    onClick={() => handleDelete(expense)}
                    className="rounded p-1 text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash aria-hidden="true" className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="min-w-[520px] bg-violet-100 p-6 text-center text-sm text-slate-500">
            No expenses yet.
          </div>
        )}
      </div>
    </section>
  );
}

export { ExpenseListTable };
export default ExpenseListTable;
