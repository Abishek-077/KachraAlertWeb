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
let refreshInFlight: Promise<boolean> | null = null;

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

function isAuthPath(path: string) {
  return path.includes("/api/v1/auth/");
}

async function refreshAccessToken() {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    try {
      const response = await fetch(resolveApiUrl("/api/v1/auth/refresh"), {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        setAccessToken(null);
        return false;
      }
      const payload = (await response.json().catch(() => null)) as ApiResponse<{
        accessToken: string | null;
      }> | null;
      const nextToken = payload?.data?.accessToken ?? null;
      setAccessToken(nextToken);
      return Boolean(nextToken);
    } catch {
      setAccessToken(null);
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
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

  let response = await fetch(resolveApiUrl(path), {
    ...options,
    headers,
    credentials: "include"
  });

  if (response.status === 401 && !isAuthPath(path)) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      } else {
        headers.delete("Authorization");
      }
      response = await fetch(resolveApiUrl(path), {
        ...options,
        headers,
        credentials: "include"
      });
    }
  }

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

export function apiPostForm<T>(path: string, body: FormData) {
  return request<T>(path, {
    method: "POST",
    body
  });
}

export function apiPatch<T>(path: string, body?: unknown) {
  return request<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined
  });
}

export function apiPutForm<T>(path: string, body: FormData) {
  return request<T>(path, {
    method: "PUT",
    body
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
  let response = await fetch(resolveApiUrl(path), {
    method: "GET",
    headers,
    cache: "no-store",
    credentials: "include"
  });
  if (response.status === 401 && !isAuthPath(path)) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      } else {
        headers.delete("Authorization");
      }
      response = await fetch(resolveApiUrl(path), {
        method: "GET",
        headers,
        cache: "no-store",
        credentials: "include"
      });
    }
  }
  if (!response.ok) {
    throw createApiError(await extractErrorMessage(response), {
      status: response.status
    });
  }
  return response.blob();
}
