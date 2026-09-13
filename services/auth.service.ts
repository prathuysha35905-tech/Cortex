import { api, apiPostForm } from "@/lib/api";
import { setToken, clearToken } from "@/lib/auth";
import type { LoginPayload, RegisterPayload, User } from "@/types/user";

// Shapes as actually returned by the FastAPI backend (see
// app/schemas/user.py and app/api/auth.py) — these differ from the
// frontend's `User`/`AuthResponse` types, so we map between them here
// rather than assuming the wire format matches the UI model.
interface BackendUser {
  id: number;
  full_name: string;
  username: string;
  email: string;
  created_at?: string;
}

interface BackendAuthResponse {
  access_token: string;
  token_type: string;
  user: BackendUser;
}

function toUser(u: BackendUser): User {
  return {
    id: String(u.id),
    name: u.full_name,
    email: u.email,
    createdAt: u.created_at ?? "",
  };
}

export async function login(payload: LoginPayload): Promise<User> {
  const res = await apiPostForm<BackendAuthResponse>(
    "/auth/login",
    { username: payload.username, password: payload.password },
    { auth: false }
  );
  setToken(res.access_token);
  return toUser(res.user);
}

export async function register(payload: RegisterPayload): Promise<User> {
  // The backend's /auth/register only creates the account and does not
  // return an auth token, so we log in immediately after with the same
  // credentials to get a real session.
  await api.post<BackendUser>(
    "/auth/register",
    {
      full_name: payload.name,
      username: payload.username,
      email: payload.email,
      password: payload.password,
    },
    { auth: false }
  );
  return login({ username: payload.username, password: payload.password });
}

export async function logout(): Promise<void> {
  try {
    await api.post<void>("/auth/logout");
  } finally {
    clearToken();
  }
}

export async function getCurrentUser(): Promise<User> {
  const res = await api.get<BackendUser>("/auth/me");
  return toUser(res);
}

export async function updateCurrentUser(payload: Partial<Pick<User, "name" | "email" | "avatarUrl">>): Promise<User> {
  const res = await api.patch<BackendUser>("/auth/me", {
    full_name: payload.name,
    email: payload.email,
  });
  return toUser(res);
}
