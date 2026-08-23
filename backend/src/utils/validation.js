import { ApiError } from "./ApiError.js";

export function requiredText(value, fieldName) {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(400, `${fieldName} is required.`);
  }

  return value.trim();
}

export function optionalText(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  return requiredText(value, fieldName);
}

export function amountValue(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    throw new ApiError(400, `${fieldName} is required.`);
  }

  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new ApiError(400, `${fieldName} must be a non-negative number.`);
  }

  return amount;
}

export function optionalDate(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, "date must be a valid ISO date or timestamp.");
  }

  return date;
}
