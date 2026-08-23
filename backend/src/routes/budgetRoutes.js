import { Router } from "express";
import {
  createBudget,
  deleteBudget,
  getBudget,
  getBudgets,
  updateBudget,
} from "../controllers/budgetController.js";
import { createExpense, getExpenses } from "../controllers/expenseController.js";
import { requireAuth } from "../middleware/auth.js";

export const budgetRouter = Router();

budgetRouter.use(requireAuth);

budgetRouter.route("/").get(getBudgets).post(createBudget);
budgetRouter.route("/:id").get(getBudget).patch(updateBudget).delete(deleteBudget);
budgetRouter.route("/:budgetId/expenses").get(getExpenses).post(createExpense);
