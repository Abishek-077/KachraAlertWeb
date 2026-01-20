export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
};

export type ApiError = Error & {
  status?: number;
  errorCode?: string;
};

export const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function request<T>(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    credentials: "include"
  });

  const contentType = response.headers.get("content-type") ?? "";
  let payload: ApiResponse<T> | null = null;

  if (response.status !== 204 && contentType.includes("application/json")) {
    payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  }

  if (!payload) {
    if (response.ok) {
      return {
        success: true,
        message: "",
        data: undefined
      } as ApiResponse<T>;
    }
    const error = new Error(response.statusText || "Request failed") as ApiError;
    error.status = response.status;
    throw error;
  }

  if (!response.ok || !payload.success) {
    const error = new Error(payload.message ?? "Request failed") as ApiError;
    error.errorCode = payload.errorCode;
    error.status = response.status;
    throw error;
  }

  return payload;
}

export function apiGet<T>(path: string) {
  return request<T>(path, { method: "GET" });
}

export function apiPost<T>(path: string, body?: unknown) {
  return request<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined
  });
}

export function apiPatch<T>(path: string, body?: unknown) {
  return request<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined
  });
}

export function apiDelete<T>(path: string) {
  return request<T>(path, { method: "DELETE" });
}
