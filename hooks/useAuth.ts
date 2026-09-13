"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getCurrentUser, login, logout, register, updateCurrentUser } from "@/services/auth.service";
import type { LoginPayload, RegisterPayload, User } from "@/types/user";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = useCallback(async (payload: LoginPayload) => {
    const u = await login(payload);
    setUser(u);
    return u;
  }, []);

  const handleRegister = useCallback(async (payload: RegisterPayload) => {
    const u = await register(payload);
    setUser(u);
    return u;
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setUser(null);
    router.push("/login");
  }, [router]);

  const updateProfile = useCallback(async (payload: Partial<Pick<User, "name" | "email" | "avatarUrl">>) => {
    const u = await updateCurrentUser(payload);
    setUser(u);
    return u;
  }, []);

  return { user, loading, login: handleLogin, register: handleRegister, logout: handleLogout, updateProfile };
}
