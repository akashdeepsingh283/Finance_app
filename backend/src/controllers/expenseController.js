import mongoose from "mongoose";
import { Expense } from "../models/Expense.js";
import { findOwnedBudget } from "./budgetController.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { serializeExpense } from "../utils/serializers.js";
import { amountValue, optionalDate, requiredText } from "../utils/validation.js";

async function findOwnedExpense(id, userId) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid expense ID.");
  }

  const expense = await Expense.findOne({ _id: id, user: userId });
  if (!expense) {
    throw new ApiError(404, "Expense not found.");
  }

  return expense;
}

function requestedBudgetId(req) {
  return req.params.budgetId || req.body.budgetId;
}

export const getExpenses = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  const budgetId = req.params.budgetId || req.query.budgetId;

  if (budgetId !== undefined) {
    if (!mongoose.isValidObjectId(budgetId)) {
      throw new ApiError(400, "Invalid budget ID.");
    }

    await findOwnedBudget(budgetId, req.user._id);
    filter.budget = budgetId;
  }

  const expenses = await Expense.find(filter)
    .sort({ expenseDate: -1, createdAt: -1 })
    .populate("budget", "name icon amount")
    .lean();

  res.json({ expenses: expenses.map(serializeExpense) });
});

export const getExpense = asyncHandler(async (req, res) => {
  const expense = await findOwnedExpense(req.params.id, req.user._id);
  await expense.populate("budget", "name icon amount");
  res.json({ expense: serializeExpense(expense) });
});

export const createExpense = asyncHandler(async (req, res) => {
  const budgetId = requestedBudgetId(req);
  if (!budgetId) {
    throw new ApiError(400, "budgetId is required.");
  }

  const budget = await findOwnedBudget(budgetId, req.user._id);
  const expense = await Expense.create({
    name: requiredText(req.body.name, "name"),
    amount: amountValue(req.body.amount, "amount"),
    expenseDate: optionalDate(req.body.date),
    budget: budget._id,
    user: req.user._id,
  });

  res.status(201).json({ expense: serializeExpense(expense) });
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await findOwnedExpense(req.params.id, req.user._id);

  if (req.body.name !== undefined) {
    expense.name = requiredText(req.body.name, "name");
  }
  if (req.body.amount !== undefined) {
    expense.amount = amountValue(req.body.amount, "amount");
  }
  if (req.body.date !== undefined) {
    expense.expenseDate = optionalDate(req.body.date);
  }
  if (req.body.budgetId !== undefined) {
    const budget = await findOwnedBudget(req.body.budgetId, req.user._id);
    expense.budget = budget._id;
  }

  await expense.save();
  res.json({ expense: serializeExpense(expense) });
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await findOwnedExpense(req.params.id, req.user._id);
  await expense.deleteOne();
  res.status(204).send();
});
