const DEFAULT_API_URL = "http://localhost:5001/api";

export const API_URL = (
  import.meta.env.VITE_API_URL || DEFAULT_API_URL
).replace(/\/$/, "");

export const TOKEN_STORAGE_KEY = "expense-tracker-token";

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token) {
  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

function getErrorMessage(payload, fallback) {
  if (typeof payload === "string") return payload;
  return payload?.message || payload?.error || payload?.errors?.[0]?.message || fallback;
}

/**
 * Shared HTTP client for every Express endpoint.  It always reads the latest
 * JWT from localStorage so requests made after sign-in are authenticated.
 */
export async function apiFetch(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    token = getStoredToken(),
    signal,
  } = options;

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new Error("Unable to reach the server. Please try again.");
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    const error = new Error(getErrorMessage(payload, "The request could not be completed."));
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}
