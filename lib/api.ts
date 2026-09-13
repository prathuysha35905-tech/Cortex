import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

/**
 * Thin fetch wrapper: prefixes NEXT_PUBLIC_API_URL, JSON-encodes the body,
 * attaches the bearer token (unless `auth: false`), and throws ApiError on
 * non-2xx responses so callers can catch a single error type.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;
  const token = auth ? getToken() : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      const raw = data.message ?? data.detail ?? message;
      if (Array.isArray(raw)) {
        message = raw
          .map((item: unknown) =>
            typeof item === "string" ? item : (item as { msg?: string })?.msg ?? JSON.stringify(item)
          )
          .join("; ");
      } else if (typeof raw === "object" && raw !== null) {
        message = (raw as { msg?: string }).msg ?? JSON.stringify(raw);
      } else {
        message = raw;
      }
    } catch {
      // response had no JSON body
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) => apiFetch<T>(path, { ...options, method: "DELETE" }),
};

/**
 * Form-encoded POST for endpoints that expect
 * application/x-www-form-urlencoded instead of JSON — e.g. a FastAPI
 * OAuth2PasswordRequestForm-based login endpoint.
 */
export async function apiPostForm<T>(path: string, fields: Record<string, string>, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const token = auth ? getToken() : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: new URLSearchParams(fields).toString(),
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      const raw = data.message ?? data.detail ?? message;
      if (Array.isArray(raw)) {
        message = raw
          .map((item: unknown) =>
            typeof item === "string" ? item : (item as { msg?: string })?.msg ?? JSON.stringify(item)
          )
          .join("; ");
      } else if (typeof raw === "object" && raw !== null) {
        message = (raw as { msg?: string }).msg ?? JSON.stringify(raw);
      } else {
        message = raw;
      }
    } catch {
      // response had no JSON body
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
