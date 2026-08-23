function asPlainObject(document) {
  return document?.toObject ? document.toObject() : document;
}

export function serializeUser(user) {
  const value = asPlainObject(user);

  return {
    id: value._id.toString(),
    name: value.name,
    email: value.email,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

export function serializeBudget(budget, { totalSpend = 0, totalItem = 0 } = {}) {
  const value = asPlainObject(budget);
  const { _id, __v, user, ...publicBudget } = value;

  return {
    ...publicBudget,
    id: _id.toString(),
    totalSpend: Number(totalSpend),
    totalItem: Number(totalItem),
    remainingAmount: value.amount - Number(totalSpend),
  };
}

export function serializeExpense(expense) {
  const value = asPlainObject(expense);
  const { _id, __v, user, ...publicExpense } = value;
  const budgetId = value.budget?._id
    ? value.budget._id.toString()
    : value.budget?.toString();

  return {
    ...publicExpense,
    id: _id.toString(),
    budgetId,
  };
}
