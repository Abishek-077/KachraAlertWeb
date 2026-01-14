export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

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

  const payload = (await response.json().catch(() => ({
    success: false,
    message: "Unexpected server response"
  }))) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    const error = new Error(payload.message ?? "Request failed") as Error & { errorCode?: string };
    error.errorCode = payload.errorCode;
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
