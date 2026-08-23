import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  updateExpense,
} from "../controllers/expenseController.js";
import { requireAuth } from "../middleware/auth.js";

export const expenseRouter = Router();

expenseRouter.use(requireAuth);

expenseRouter.route("/").get(getExpenses).post(createExpense);
expenseRouter.route("/:id").get(getExpense).patch(updateExpense).delete(deleteExpense);
