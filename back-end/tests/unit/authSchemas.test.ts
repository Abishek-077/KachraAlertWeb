import test from "node:test";
import assert from "node:assert/strict";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../../src/dto/authSchemas.js";

const validRegister = {
  accountType: "resident",
  name: "Test User",
  email: "test@example.com",
  phone: "1234567890",
  password: "StrongPass1!",
  society: "Green Valley",
  building: "A",
  apartment: "101",
  terms: true
} as const;

test("registerSchema accepts a valid payload", () => {
  const parsed = registerSchema.parse(validRegister);
  assert.equal(parsed.email, validRegister.email);
});

const invalidPasswordCases = [
  { password: "short1!A", label: "too short", mutate: "Aa1!aa" },
  { password: "NOCAPS1!", label: "missing lowercase", mutate: "NOPPERCASE1!" },
  { password: "noupper1!", label: "missing uppercase", mutate: "nouppercase1!" },
  { password: "NoNumber!", label: "missing number", mutate: "NoNumber!" },
  { password: "NoSpecial1", label: "missing special", mutate: "NoSpecial1" }
];

for (const [index, invalidCase] of invalidPasswordCases.entries()) {
  test(`registerSchema rejects password rule violation #${index + 1} (${invalidCase.label})`, () => {
    const result = registerSchema.safeParse({ ...validRegister, password: invalidCase.mutate });
    assert.equal(result.success, false);
  });
}

const invalidRegisterCases: Array<{ label: string; payload: Record<string, unknown> }> = [
  { label: "invalid account type", payload: { ...validRegister, accountType: "admin" } },
  { label: "name too short", payload: { ...validRegister, name: "A" } },
  { label: "invalid email", payload: { ...validRegister, email: "invalid" } },
  { label: "phone too short", payload: { ...validRegister, phone: "123" } },
  { label: "society too short", payload: { ...validRegister, society: "A" } },
  { label: "empty building", payload: { ...validRegister, building: "" } },
  { label: "empty apartment", payload: { ...validRegister, apartment: "" } },
  { label: "terms false", payload: { ...validRegister, terms: false } },
  { label: "missing terms", payload: { ...validRegister, terms: undefined } },
  { label: "missing password", payload: { ...validRegister, password: undefined } }
];

for (const [index, testCase] of invalidRegisterCases.entries()) {
  test(`registerSchema rejects invalid payload #${index + 1} (${testCase.label})`, () => {
    const result = registerSchema.safeParse(testCase.payload);
    assert.equal(result.success, false);
  });
}

test("loginSchema accepts valid payload with optional remember and accountType", () => {
  const result = loginSchema.parse({
    email: "user@example.com",
    password: "abc",
    remember: true,
    accountType: "admin_driver"
  });

  assert.equal(result.remember, true);
  assert.equal(result.accountType, "admin_driver");
});

const invalidLoginCases: Array<{ label: string; payload: Record<string, unknown> }> = [
  { label: "invalid email", payload: { email: "wrong", password: "secret" } },
  { label: "empty password", payload: { email: "user@example.com", password: "" } },
  { label: "invalid remember type", payload: { email: "user@example.com", password: "secret", remember: "yes" } },
  { label: "invalid account type", payload: { email: "user@example.com", password: "secret", accountType: "admin" } }
];

for (const [index, testCase] of invalidLoginCases.entries()) {
  test(`loginSchema rejects invalid payload #${index + 1} (${testCase.label})`, () => {
    const result = loginSchema.safeParse(testCase.payload);
    assert.equal(result.success, false);
  });
}

test("forgotPasswordSchema accepts valid email", () => {
  const result = forgotPasswordSchema.parse({ email: "user@example.com" });
  assert.equal(result.email, "user@example.com");
});

test("forgotPasswordSchema rejects invalid email", () => {
  const result = forgotPasswordSchema.safeParse({ email: "bad" });
  assert.equal(result.success, false);
});

test("resetPasswordSchema accepts valid token and password", () => {
  const result = resetPasswordSchema.parse({ token: "token-123", password: "StrongPass1!" });
  assert.equal(result.token, "token-123");
});

const invalidResetCases: Array<{ label: string; payload: Record<string, unknown> }> = [
  { label: "empty token", payload: { token: "", password: "StrongPass1!" } },
  { label: "weak password - lowercase missing", payload: { token: "abc", password: "UPPER123!" } },
  { label: "weak password - uppercase missing", payload: { token: "abc", password: "lower123!" } },
  { label: "weak password - number missing", payload: { token: "abc", password: "NoNumber!" } },
  { label: "weak password - special missing", payload: { token: "abc", password: "NoSpecial1" } },
  { label: "weak password - too short", payload: { token: "abc", password: "Aa1!aa" } }
];

for (const [index, testCase] of invalidResetCases.entries()) {
  test(`resetPasswordSchema rejects invalid payload #${index + 1} (${testCase.label})`, () => {
    const result = resetPasswordSchema.safeParse(testCase.payload);
    assert.equal(result.success, false);
  });
}
