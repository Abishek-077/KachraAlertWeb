import test from "node:test";
import assert from "node:assert/strict";
import { updateProfileSchema, uploadProfileImageSchema, authUpdateSchema } from "../../src/dto/userSchemas.js";
import { adminCreateUserSchema, adminUpdateUserSchema, adminUpdateUserStatusSchema } from "../../src/dto/adminUserSchemas.js";
import { normalizeAccountType } from "../../src/utils/accountType.js";
import { AppError } from "../../src/utils/errors.js";

const validProfilePatch = {
  name: "Updated Name",
  phone: "9876543210",
  society: "Community",
  building: "B",
  apartment: "19"
};

test("updateProfileSchema accepts valid partial payload", () => {
  const result = updateProfileSchema.parse({ name: "Only Name" });
  assert.equal(result.name, "Only Name");
});

test("updateProfileSchema rejects empty object", () => {
  const result = updateProfileSchema.safeParse({});
  assert.equal(result.success, false);
});

for (const [index, key] of ["name", "phone", "society", "building", "apartment"].entries()) {
  test(`updateProfileSchema rejects empty ${key} field`, () => {
    const result = updateProfileSchema.safeParse({ ...validProfilePatch, [key]: "" });
    assert.equal(result.success, false);
  });

  test(`authUpdateSchema rejects empty ${key} field`, () => {
    const result = authUpdateSchema.safeParse({ ...validProfilePatch, [key]: "" });
    assert.equal(result.success, false);
  });
}

test("authUpdateSchema accepts optional field set", () => {
  const parsed = authUpdateSchema.parse({ phone: "1234567" });
  assert.equal(parsed.phone, "1234567");
});

test("uploadProfileImageSchema accepts a valid image payload", () => {
  const parsed = uploadProfileImageSchema.parse({
    image: {
      name: "avatar.png",
      mimeType: "image/png",
      dataBase64: "aGVsbG8="
    }
  });
  assert.equal(parsed.image.mimeType, "image/png");
});

const invalidImageCases = [
  { label: "missing image", payload: {} },
  { label: "empty image name", payload: { image: { name: "", mimeType: "image/png", dataBase64: "abc" } } },
  { label: "empty mime type", payload: { image: { name: "x", mimeType: "", dataBase64: "abc" } } },
  { label: "empty base64", payload: { image: { name: "x", mimeType: "image/png", dataBase64: "" } } }
];

for (const [index, testCase] of invalidImageCases.entries()) {
  test(`uploadProfileImageSchema rejects invalid payload #${index + 1} (${testCase.label})`, () => {
    const result = uploadProfileImageSchema.safeParse(testCase.payload);
    assert.equal(result.success, false);
  });
}

const validAdminCreate = {
  accountType: "resident",
  name: "Admin Created",
  email: "created@example.com",
  phone: "9999999999",
  password: "abcdef",
  society: "Society",
  building: "C",
  apartment: "303"
};

test("adminCreateUserSchema accepts valid payload", () => {
  const parsed = adminCreateUserSchema.parse(validAdminCreate);
  assert.equal(parsed.email, validAdminCreate.email);
});

const invalidAdminCreateCases = [
  { label: "invalid accountType", payload: { ...validAdminCreate, accountType: "admin" } },
  { label: "invalid email", payload: { ...validAdminCreate, email: "bad" } },
  { label: "short password", payload: { ...validAdminCreate, password: "123" } },
  { label: "empty name", payload: { ...validAdminCreate, name: "" } },
  { label: "empty society", payload: { ...validAdminCreate, society: "" } }
];

for (const [index, testCase] of invalidAdminCreateCases.entries()) {
  test(`adminCreateUserSchema rejects invalid payload #${index + 1} (${testCase.label})`, () => {
    const result = adminCreateUserSchema.safeParse(testCase.payload);
    assert.equal(result.success, false);
  });
}

test("adminUpdateUserSchema accepts full optional payload", () => {
  const parsed = adminUpdateUserSchema.parse({
    accountType: "admin_driver",
    name: "Updated",
    email: "updated@example.com",
    phone: "1234567",
    password: "123456",
    society: "Society",
    building: "D",
    apartment: "10",
    isBanned: false,
    lateFeePercent: 25
  });
  assert.equal(parsed.lateFeePercent, 25);
});

const invalidAdminUpdateCases = [
  { label: "invalid email", payload: { email: "bad" } },
  { label: "lateFeePercent below range", payload: { lateFeePercent: -1 } },
  { label: "lateFeePercent above range", payload: { lateFeePercent: 101 } },
  { label: "short password", payload: { password: "123" } },
  { label: "invalid accountType", payload: { accountType: "driver" } }
];

for (const [index, testCase] of invalidAdminUpdateCases.entries()) {
  test(`adminUpdateUserSchema rejects invalid payload #${index + 1} (${testCase.label})`, () => {
    const result = adminUpdateUserSchema.safeParse(testCase.payload);
    assert.equal(result.success, false);
  });
}

test("adminUpdateUserStatusSchema accepts valid isBanned update", () => {
  const parsed = adminUpdateUserStatusSchema.parse({ isBanned: true });
  assert.equal(parsed.isBanned, true);
});

test("adminUpdateUserStatusSchema accepts valid lateFeePercent update", () => {
  const parsed = adminUpdateUserStatusSchema.parse({ lateFeePercent: 0 });
  assert.equal(parsed.lateFeePercent, 0);
});

for (const lateFee of [-10, 120]) {
  test(`adminUpdateUserStatusSchema rejects out-of-range lateFeePercent: ${lateFee}`, () => {
    const result = adminUpdateUserStatusSchema.safeParse({ lateFeePercent: lateFee });
    assert.equal(result.success, false);
  });
}

const accountTypeCases: Array<[string, "resident" | "admin_driver"]> = [
  ["resident", "resident"],
  ["admin_driver", "admin_driver"],
  ["admin", "admin_driver"],
  ["anything_else", "resident"]
];

for (const [value, expected] of accountTypeCases) {
  test(`normalizeAccountType maps '${value}' to '${expected}'`, () => {
    assert.equal(normalizeAccountType(value), expected);
  });
}

test("AppError sets properties correctly", () => {
  const err = new AppError("Boom", 400, "BAD_REQUEST");
  assert.equal(err.message, "Boom");
  assert.equal(err.statusCode, 400);
  assert.equal(err.errorCode, "BAD_REQUEST");
});
