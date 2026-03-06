import test from "node:test";
import assert from "node:assert/strict";
import { validateBody } from "../../src/middleware/validate.js";

process.env.FRONTEND_URL = "http://localhost:3000,https://app.example.com";
process.env.MONGODB_URI = "mongodb://localhost:27017/test";
process.env.JWT_ACCESS_SECRET = "access-secret";
process.env.JWT_REFRESH_SECRET = "refresh-secret";
process.env.ALLOW_VERCEL_PREVIEW_ORIGINS = "true";

const { isAllowedCorsOrigin } = await import("../../src/utils/origin.js");

test("isAllowedCorsOrigin allows requests with no origin", () => {
  assert.equal(isAllowedCorsOrigin(undefined), true);
});

test("isAllowedCorsOrigin allows configured origin", () => {
  assert.equal(isAllowedCorsOrigin("https://app.example.com/"), true);
});

test("isAllowedCorsOrigin rejects unknown non-vercel origin", () => {
  assert.equal(isAllowedCorsOrigin("https://blocked.example.com"), false);
});

test("isAllowedCorsOrigin allows valid vercel preview origin over https", () => {
  assert.equal(isAllowedCorsOrigin("https://my-branch.vercel.app"), true);
});

test("isAllowedCorsOrigin rejects vercel preview origin over http", () => {
  assert.equal(isAllowedCorsOrigin("http://my-branch.vercel.app"), false);
});

test("isAllowedCorsOrigin rejects malformed origin", () => {
  assert.equal(isAllowedCorsOrigin(":not_a_url"), false);
});

test("validateBody parses and rewrites req.body then calls next without error", async () => {
  const { z } = await import("zod");
  const middleware = validateBody(z.object({ email: z.string().email() }));

  const req = { body: { email: "user@example.com" } } as any;
  let nextError: unknown = null;
  let called = false;

  await middleware(req, {} as any, (err?: unknown) => {
    called = true;
    nextError = err ?? null;
  });

  assert.equal(called, true);
  assert.equal(nextError, null);
  assert.equal(req.body.email, "user@example.com");
});

test("validateBody forwards zod error to next", async () => {
  const { z, ZodError } = await import("zod");
  const middleware = validateBody(z.object({ email: z.string().email() }));

  const req = { body: { email: "bad-email" } } as any;
  let capturedError: unknown;

  await middleware(req, {} as any, (err?: unknown) => {
    capturedError = err;
  });

  assert.ok(capturedError instanceof ZodError);
});
