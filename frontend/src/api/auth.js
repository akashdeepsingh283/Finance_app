import { apiFetch } from "./client";

function unwrap(payload) {
  return payload?.data ?? payload;
}

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    id: user.id ?? user._id,
    name: user.name ?? user.fullName ?? user.username ?? user.email?.split("@")[0] ?? "User",
  };
}

function normalizeAuthResponse(payload) {
  const data = unwrap(payload);
  return {
    token: data?.token ?? data?.accessToken ?? payload?.token ?? payload?.accessToken,
    user: normalizeUser(data?.user ?? payload?.user),
  };
}

export async function register(credentials) {
  return normalizeAuthResponse(
    await apiFetch("/auth/register", { method: "POST", body: credentials, token: null }),
  );
}

export async function login(credentials) {
  return normalizeAuthResponse(
    await apiFetch("/auth/login", { method: "POST", body: credentials, token: null }),
  );
}

export async function getCurrentUser() {
  const payload = unwrap(await apiFetch("/auth/me"));
  return normalizeUser(payload?.user ?? payload);
}
