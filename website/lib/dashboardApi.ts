"use client";

export type ApiErrorBody = {
  error?: string;
  message?: string;
};

export class DashboardApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "DashboardApiError";
    this.status = status;
  }
}

export async function dashboardFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit & { timeoutMs?: number }
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), init?.timeoutMs ?? 15000);

  try {
    const response = await fetch(input, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json")
      ? ((await response.json()) as ApiErrorBody | T)
      : undefined;

    if (!response.ok) {
      const errorBody =
        body && typeof body === "object" && !Array.isArray(body)
          ? (body as ApiErrorBody)
          : undefined;
      const message =
        errorBody
          ? errorBody.error || errorBody.message || "Request failed"
          : `Request failed with status ${response.status}`;
      if (
        (response.status === 401 || response.status === 403) &&
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/dashboard") &&
        window.location.pathname !== "/dashboard/login"
      ) {
        window.location.assign(new URL(`/dashboard/login?reason=${response.status === 403 ? "admin" : "session"}`, window.location.origin));
      }
      throw new DashboardApiError(message, response.status);
    }

    return body as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new DashboardApiError("The request timed out. Please check your connection and try again.", 408);
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function redirectIfAuthError(error: unknown) {
  if (
    error instanceof DashboardApiError &&
    (error.status === 401 || error.status === 403) &&
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/dashboard") &&
    window.location.pathname !== "/dashboard/login"
  ) {
    window.location.assign(new URL(`/dashboard/login?reason=${error.status === 403 ? "admin" : "session"}`, window.location.origin));
    return true;
  }
  return false;
}
