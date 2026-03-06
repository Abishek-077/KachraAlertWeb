import test from "node:test";
import assert from "node:assert/strict";
import type { Server } from "node:http";

function setRequiredEnv(overrides: Record<string, string> = {}) {
  process.env.FRONTEND_URL = overrides.FRONTEND_URL ?? "http://localhost:3000";
  process.env.MONGODB_URI = overrides.MONGODB_URI ?? "mongodb://localhost:27017/test";
  process.env.JWT_ACCESS_SECRET = overrides.JWT_ACCESS_SECRET ?? "access-secret";
  process.env.JWT_REFRESH_SECRET = overrides.JWT_REFRESH_SECRET ?? "refresh-secret";
  process.env.ALLOW_VERCEL_PREVIEW_ORIGINS = overrides.ALLOW_VERCEL_PREVIEW_ORIGINS ?? "false";
  process.env.NODE_ENV = "test";
}

async function withServer(
  appModulePath: string,
  run: (baseUrl: string) => Promise<void>
) {
  const { default: app } = await import(appModulePath);
  const server: Server = app.listen(0);

  await new Promise<void>((resolve) => server.once("listening", () => resolve()));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Failed to resolve test server address");
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;
  try {
    await run(baseUrl);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

test("GET / returns API metadata", async () => {
  setRequiredEnv();
  await withServer("../../src/app.ts?integration=root", async (baseUrl) => {
    const response = await fetch(`${baseUrl}/`);
    assert.equal(response.status, 200);
    const body = (await response.json()) as { success: boolean; health: string };
    assert.equal(body.success, true);
    assert.equal(body.health, "/api/v1/health");
  });
});

test("GET /api/v1/health returns OK", async () => {
  setRequiredEnv();
  await withServer("../../src/app.ts?integration=health", async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/health`);
    assert.equal(response.status, 200);
    const body = (await response.json()) as { message: string };
    assert.equal(body.message, "OK");
  });
});

test("GET /api/v1/auth/oauth/google/start returns 501 placeholder", async () => {
  setRequiredEnv();
  await withServer("../../src/app.ts?integration=oauthstart", async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/auth/oauth/google/start`);
    assert.equal(response.status, 501);
    const body = (await response.json()) as { errorCode: string };
    assert.equal(body.errorCode, "OAUTH_NOT_IMPLEMENTED");
  });
});

test("GET /api/v1/auth/oauth/google/callback returns 501 placeholder", async () => {
  setRequiredEnv();
  await withServer("../../src/app.ts?integration=oauthcallback", async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/auth/oauth/google/callback`);
    assert.equal(response.status, 501);
    const body = (await response.json()) as { success: boolean };
    assert.equal(body.success, false);
  });
});

test("POST /api/v1/auth/refresh without cookie returns null access token", async () => {
  setRequiredEnv();
  await withServer("../../src/app.ts?integration=refresh", async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/auth/refresh`, { method: "POST" });
    assert.equal(response.status, 200);
    const body = (await response.json()) as { data: { accessToken: string | null } };
    assert.equal(body.data.accessToken, null);
  });
});

test("POST /api/v1/auth/logout without cookie succeeds", async () => {
  setRequiredEnv();
  await withServer("../../src/app.ts?integration=logout", async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/auth/logout`, { method: "POST" });
    assert.equal(response.status, 200);
    const body = (await response.json()) as { success: boolean; message: string };
    assert.equal(body.success, true);
    assert.equal(body.message, "Logged out");
  });
});

test("CORS allows configured origin", async () => {
  setRequiredEnv({ FRONTEND_URL: "http://localhost:3000,https://allowed.example.com" });
  await withServer("../../src/app.ts?integration=corsallowed", async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/health`, {
      headers: { Origin: "http://localhost:3000" }
    });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:3000");
  });
});

test("CORS blocks unknown origin", async () => {
  setRequiredEnv({ FRONTEND_URL: "http://localhost:3000", ALLOW_VERCEL_PREVIEW_ORIGINS: "false" });
  await withServer("../../src/app.ts?integration=corsblocked", async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/health`, {
      headers: { Origin: "https://blocked.example.com" }
    });
    assert.equal(response.status, 500);
  });
});
