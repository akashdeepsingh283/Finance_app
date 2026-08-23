import { apiFetch } from "./client";

const unwrap = (payload) => payload?.data ?? payload;

function asNumber(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}

export function normalizeBudget(budget) {
  if (!budget) return budget;
  return {
    ...budget,
    id: budget.id ?? budget._id,
    amount: asNumber(budget.amount),
    totalSpend: asNumber(budget.totalSpend ?? budget.totalSpent ?? budget.spent),
    totalItem: asNumber(budget.totalItem ?? budget.totalItems ?? budget.expenseCount),
  };
}

export function normalizeExpense(expense) {
  if (!expense) return expense;
  return {
    ...expense,
    id: expense.id ?? expense._id,
    amount: asNumber(expense.amount),
    budgetId: expense.budgetId?._id ?? expense.budgetId?.id ?? expense.budgetId,
    createdAt: expense.createdAt ?? expense.date,
  };
}

function collection(payload, names, normalize) {
  const data = unwrap(payload);
  const list = Array.isArray(data)
    ? data
    : names.map((name) => data?.[name] ?? payload?.[name]).find(Array.isArray) ?? [];
  return list.map(normalize);
}

export async function getDashboard() {
  const payload = unwrap(await apiFetch("/dashboard"));
  return {
    budgetList: collection(payload, ["budgetList", "budgets"], normalizeBudget),
    expensesList: collection(payload, ["expensesList", "expenses"], normalizeExpense),
  };
}

export async function getBudgets() {
  return collection(await apiFetch("/budgets"), ["budgets", "budgetList"], normalizeBudget);
}

export async function createBudget(values) {
  const data = unwrap(await apiFetch("/budgets", { method: "POST", body: values }));
  return normalizeBudget(data?.budget ?? data);
}

export async function getBudget(id) {
  const data = unwrap(await apiFetch(`/budgets/${id}`));
  return {
    budget: normalizeBudget(data?.budget ?? data),
    expenses: collection(data, ["expenses", "expensesList"], normalizeExpense),
  };
}

export async function updateBudget(id, values) {
  const data = unwrap(await apiFetch(`/budgets/${id}`, { method: "PATCH", body: values }));
  return normalizeBudget(data?.budget ?? data);
}

export async function deleteBudget(id) {
  return apiFetch(`/budgets/${id}`, { method: "DELETE" });
}

export async function getExpenses() {
  return collection(await apiFetch("/expenses"), ["expenses", "expensesList"], normalizeExpense);
}

export async function createExpense(budgetId, values) {
  const data = unwrap(
    await apiFetch(`/budgets/${budgetId}/expenses`, { method: "POST", body: values }),
  );
  return normalizeExpense(data?.expense ?? data);
}

export async function deleteExpense(id) {
  return apiFetch(`/expenses/${id}`, { method: "DELETE" });
}
