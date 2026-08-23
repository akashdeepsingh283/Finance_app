import { Budget } from "../models/Budget.js";
import { Expense } from "../models/Expense.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { serializeBudget, serializeExpense } from "../utils/serializers.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const [budgets, summaries, expenses] = await Promise.all([
    Budget.find({ user: req.user._id }).sort({ createdAt: -1 }).lean(),
    Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$budget",
          totalSpend: { $sum: "$amount" },
          totalItem: { $sum: 1 },
        },
      },
    ]),
    Expense.find({ user: req.user._id })
      .sort({ expenseDate: -1, createdAt: -1 })
      .populate("budget", "name icon amount")
      .lean(),
  ]);

  const summariesByBudget = new Map(
    summaries.map((summary) => [summary._id.toString(), summary]),
  );
  const serializedBudgets = budgets.map((budget) =>
    serializeBudget(budget, summariesByBudget.get(budget._id.toString())),
  );
  const totalBudget = serializedBudgets.reduce((total, budget) => total + budget.amount, 0);
  const totalSpend = serializedBudgets.reduce((total, budget) => total + budget.totalSpend, 0);

  res.json({
    overview: {
      totalBudget,
      totalSpend,
      totalItem: expenses.length,
      budgetCount: serializedBudgets.length,
      remainingAmount: totalBudget - totalSpend,
    },
    budgets: serializedBudgets,
    expenses: expenses.map(serializeExpense),
  });
});
