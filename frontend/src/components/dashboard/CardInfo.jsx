import { PiggyBank, Receipt, Wallet } from "lucide-react";

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

function CardInfo({ budgetList = [] }) {
  const budgets = Array.isArray(budgetList) ? budgetList : [];
  const totalBudget = budgets.reduce(
    (total, budget) => total + toNumber(budget?.amount),
    0,
  );
  const totalSpent = budgets.reduce(
    (total, budget) => total + toNumber(budget?.totalSpend),
    0,
  );

  const cards = [
    { label: "Total Budget", value: formatCurrency(totalBudget), icon: PiggyBank },
    { label: "Total Spent", value: formatCurrency(totalSpent), icon: Receipt },
    { label: "No. of Budgets", value: budgets.length, icon: Wallet },
  ];

  return (
    <div className="mt-7 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ label, value, icon: Icon }) => (
        <article
          key={label}
          className="flex items-center justify-between rounded-lg border-2 border-primary bg-violet-100 p-7 shadow-md"
        >
          <div>
            <h2 className="text-sm">{label}</h2>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon
            aria-hidden="true"
            className="h-12 w-12 rounded-full bg-primary p-3 text-white"
          />
        </article>
      ))}
    </div>
  );
}

export { CardInfo };
export default CardInfo;
