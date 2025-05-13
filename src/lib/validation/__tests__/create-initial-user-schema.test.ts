import { createInitialUserSchema } from "../create-initial-user-schema";

describe("createInitialUserSchema", () => {
  const validData = {
    email: "admin@example.com",
    password: "12345678aA!",
    confirmPassword: "12345678aA!",
  };

  it("passes with valid input", () => {
    const result = createInitialUserSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when passwords do not match", () => {
    const result = createInitialUserSchema.safeParse({
      ...validData,
      confirmPassword: "mismatch",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().confirmPassword?._errors).toContain(
      "Passwords do not match"
    );
  });

  it("fails with invalid email", () => {
    const result = createInitialUserSchema.safeParse({
      ...validData,
      email: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("fails with short password", () => {
    const result = createInitialUserSchema.safeParse({
      ...validData,
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().password?._errors).toContain(
      "Password must be at least 8 characters long"
    );
  });

  it("fails if role is passed (unexpected)", () => {
    const result = createInitialUserSchema.safeParse({
      ...validData,
      role: "ADMIN",
    });
    expect(result.success).toBe(false);
  });

  it("fails if password lacks a lowercase letter", () => {
    const result = createInitialUserSchema.safeParse({
      ...validData,
      password: "ABCDEFG1!",
      confirmPassword: "ABCDEFG1!",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().password?._errors).toContain(
      "Password must contain at least one lowercase letter"
    );
  });

  it("fails if password lacks an uppercase letter", () => {
    const result = createInitialUserSchema.safeParse({
      ...validData,
      password: "abcdefg1!",
      confirmPassword: "abcdefg1!",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().password?._errors).toContain(
      "Password must contain at least one uppercase letter"
    );
  });

  it("fails if password lacks a number", () => {
    const result = createInitialUserSchema.safeParse({
      ...validData,
      password: "Abcdefgh!",
      confirmPassword: "Abcdefgh!",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().password?._errors).toContain(
      "Password must contain at least one number"
    );
  });

  it("fails if password lacks a special character", () => {
    const result = createInitialUserSchema.safeParse({
      ...validData,
      password: "Abcdefg1",
      confirmPassword: "Abcdefg1",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().password?._errors).toContain(
      "Password must contain at least one special character"
    );
  });
});
