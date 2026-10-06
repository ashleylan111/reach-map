"use client";

import {
  SessionProvider,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = {
  id?: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  googleEnabled: boolean;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthBridge({ children }: { children: ReactNode }) {
  const { data, status } = useSession();
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/config")
      .then((res) => res.json())
      .then((json: { google?: boolean }) => {
        if (!cancelled) setGoogleEnabled(Boolean(json.google));
      })
      .catch(() => {
        if (!cancelled) setGoogleEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const user = useMemo<AuthUser | null>(() => {
    if (!data?.user?.email) return null;
    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      image: data.user.image,
    };
  }, [data]);

  const login = useCallback(async (email: string, password = "demo") => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      throw new Error(result.error);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await signIn("google", { callbackUrl: "/" });
  }, []);

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: "/login" });
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready: status !== "loading",
      googleEnabled,
      login,
      loginWithGoogle,
      logout,
    }),
    [user, status, googleEnabled, login, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthBridge>{children}</AuthBridge>
    </SessionProvider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
