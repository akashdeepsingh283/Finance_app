import mongoose from "mongoose";
import { Budget } from "../models/Budget.js";
import { Expense } from "../models/Expense.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { serializeBudget, serializeExpense } from "../utils/serializers.js";
import { amountValue, optionalText, requiredText } from "../utils/validation.js";

async function findOwnedBudget(id, userId) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid budget ID.");
  }

  const budget = await Budget.findOne({ _id: id, user: userId });
  if (!budget) {
    throw new ApiError(404, "Budget not found.");
  }

  return budget;
}

async function getBudgetSummary(budgetId, userId) {
  const [summary] = await Expense.aggregate([
    { $match: { budget: new mongoose.Types.ObjectId(budgetId), user: userId } },
    {
      $group: {
        _id: "$budget",
        totalSpend: { $sum: "$amount" },
        totalItem: { $sum: 1 },
      },
    },
  ]);

  return {
    totalSpend: summary?.totalSpend || 0,
    totalItem: summary?.totalItem || 0,
  };
}

export const getBudgets = asyncHandler(async (req, res) => {
  const [budgets, summaries] = await Promise.all([
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
  ]);

  const summariesByBudget = new Map(
    summaries.map((summary) => [summary._id.toString(), summary]),
  );

  res.json({
    budgets: budgets.map((budget) => {
      const summary = summariesByBudget.get(budget._id.toString());
      return serializeBudget(budget, summary);
    }),
  });
});

export const getBudget = asyncHandler(async (req, res) => {
  const budget = await findOwnedBudget(req.params.id, req.user._id);
  const [summary, expenses] = await Promise.all([
    getBudgetSummary(budget._id, req.user._id),
    Expense.find({ budget: budget._id, user: req.user._id })
      .sort({ expenseDate: -1, createdAt: -1 })
      .lean(),
  ]);

  res.json({
    budget: serializeBudget(budget, summary),
    expenses: expenses.map(serializeExpense),
  });
});

export const createBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.create({
    name: requiredText(req.body.name, "name"),
    amount: amountValue(req.body.amount, "amount"),
    icon: optionalText(req.body.icon, "icon") || undefined,
    user: req.user._id,
  });

  res.status(201).json({ budget: serializeBudget(budget) });
});

export const updateBudget = asyncHandler(async (req, res) => {
  const budget = await findOwnedBudget(req.params.id, req.user._id);

  if (req.body.name !== undefined) {
    budget.name = requiredText(req.body.name, "name");
  }
  if (req.body.amount !== undefined) {
    budget.amount = amountValue(req.body.amount, "amount");
  }
  if (req.body.icon !== undefined) {
    budget.icon = optionalText(req.body.icon, "icon") || "💰";
  }

  await budget.save();
  const summary = await getBudgetSummary(budget._id, req.user._id);
  res.json({ budget: serializeBudget(budget, summary) });
});

export const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await findOwnedBudget(req.params.id, req.user._id);

  await Expense.deleteMany({ budget: budget._id, user: req.user._id });
  await budget.deleteOne();

  res.status(204).send();
});

export { findOwnedBudget };
