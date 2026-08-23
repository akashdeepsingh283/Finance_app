import { Link } from "react-router-dom";

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function BudgetItem({ budget, budgets }) {
  const currentBudget = budget ?? budgets ?? {};
  const amount = toNumber(currentBudget.amount);
  const totalSpend = toNumber(currentBudget.totalSpend);
  const remaining = amount - totalSpend;
  const progress = amount > 0 ? Math.min(100, Math.max(0, (totalSpend / amount) * 100)) : 0;
  const budgetId = currentBudget.id || currentBudget._id;

  const card = (
    <article className="cursor-pointer rounded-lg border-2 border-primary bg-violet-100 p-5 shadow-md transition-shadow hover:shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <p className="rounded-full bg-[#c3c2ff] px-4 py-3 text-2xl" aria-hidden="true">
            {currentBudget.icon || "💰"}
          </p>
          <div className="min-w-0">
            <h2 className="truncate font-bold">{currentBudget.name || "Untitled budget"}</h2>
            <p className="text-sm text-gray-500">
              {toNumber(currentBudget.totalItem ?? currentBudget.totalItems)} Item
              {toNumber(currentBudget.totalItem ?? currentBudget.totalItems) === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <p className="shrink-0 font-bold text-primary">{formatCurrency(amount)}</p>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-600">{formatCurrency(totalSpend)} Spent</p>
          <p className="text-xs text-slate-600">{formatCurrency(remaining)} Remaining</p>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-[#c3c2ff]"
          aria-label={`${progress.toFixed(0)}% of budget spent`}
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progress}
        >
          <div
            style={{ width: `${progress}%` }}
            className="h-2 rounded-full bg-primary"
          />
        </div>
      </div>
    </article>
  );

  if (!budgetId) return card;

  return <Link to={`/dashboard/expenses/${budgetId}`}>{card}</Link>;
}

export { BudgetItem };
export default BudgetItem;
