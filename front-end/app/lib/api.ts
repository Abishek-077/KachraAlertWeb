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

function createApiError(
  message: string,
  options: {
    status?: number;
    errorCode?: string;
  } = {}
): ApiError {
  return Object.assign(new Error(message), options);
}

async function extractErrorMessage(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    if (payload?.message) {
      return payload.message;
    }
  }
  const text = (await response.text().catch(() => "")).trim();
  if (text) {
    return text;
  }
  return response.statusText || "Request failed";
}

function resolveApiUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${baseUrl}${path}`;
}

async function request<T>(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(resolveApiUrl(path), {
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
    throw createApiError(await extractErrorMessage(response), {
      status: response.status
    });
  }

  if (!response.ok || !payload.success) {
    throw createApiError(payload.message ?? "Request failed", {
      status: response.status,
      errorCode: payload.errorCode
    });
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

export async function apiGetBlob(path: string) {
  const headers = new Headers();
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  const response = await fetch(resolveApiUrl(path), {
    method: "GET",
    headers,
    cache: "no-store",
    credentials: "include"
  });
  if (!response.ok) {
    throw createApiError(await extractErrorMessage(response), {
      status: response.status
    });
  }
  return response.blob();
}
