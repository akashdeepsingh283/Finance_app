import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, login as loginRequest, register as registerRequest } from "../api/auth";
import { setStoredToken, getStoredToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      if (!getStoredToken()) {
        if (active) setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        if (active) setUser(currentUser);
      } catch {
        setStoredToken(null);
        if (active) setUser(null);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const authenticate = useCallback(async (request, credentials) => {
    const result = await request(credentials);
    if (!result.token) {
      throw new Error("The server did not return an authentication token.");
    }

    setStoredToken(result.token);
    const currentUser = result.user ?? await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }, []);

  const login = useCallback((credentials) => authenticate(loginRequest, credentials), [authenticate]);
  const register = useCallback((credentials) => authenticate(registerRequest, credentials), [authenticate]);
  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  }), [user, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
