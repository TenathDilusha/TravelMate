import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { API_BASE } from "../services/api";

const AuthContext = createContext(null);

async function authFetch(path, options = {}) {
  return fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

async function readError(response) {
  try {
    const data = await response.json();
    const detail = data.detail || data.message;
    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg || JSON.stringify(item)).join(" ");
    }
    return detail || "Request failed";
  } catch {
    return "Request failed";
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState({
    google: false,
    github: false,
    facebook: false,
    password: true,
  });

  const refreshUser = useCallback(async () => {
    const response = await authFetch("/auth/me");
    if (!response.ok) {
      setUser(null);
      return null;
    }
    const data = await response.json();
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authFetch("/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors on logout
    }
    setUser(null);
  }, []);

  const loginWithPassword = useCallback(async ({ email, password }) => {
    const response = await authFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const detail = await readError(response);
      const error = new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
      error.status = response.status;
      throw error;
    }
    const data = await response.json();
    setUser(data.user);
    return data.user;
  }, []);

  const registerWithPassword = useCallback(async ({ username, email, password }) => {
    const response = await authFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) {
      const detail = await readError(response);
      throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
    }
    const data = await response.json();
    setUser(data.user);
    return data.user;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const providersRes = await authFetch("/auth/providers");
        if (providersRes.ok && !cancelled) {
          setProviders(await providersRes.json());
        }
      } catch {
        // API may be offline during first paint
      }

      try {
        const response = await authFetch("/auth/me");
        if (!cancelled) {
          if (response.ok) setUser(await response.json());
          else setUser(null);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const startOAuth = useCallback((provider, { mode = "login", username = "" } = {}) => {
    const params = new URLSearchParams({ mode });
    if (mode === "register" && username) {
      params.set("username", username);
    }
    window.location.href = `${API_BASE}/auth/${provider}?${params.toString()}`;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      providers,
      isAuthenticated: Boolean(user),
      refreshUser,
      logout,
      startOAuth,
      loginWithPassword,
      registerWithPassword,
    }),
    [
      user,
      loading,
      providers,
      refreshUser,
      logout,
      startOAuth,
      loginWithPassword,
      registerWithPassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
