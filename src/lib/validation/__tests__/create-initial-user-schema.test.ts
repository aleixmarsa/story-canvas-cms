import { createInitialUserSchema } from "../create-initial-user-schema";

describe("createInitialUserSchema", () => {
  const validData = {
    email: "admin@example.com",
    password: "pasword123",
    confirmPassword: "pasword123",
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
  });

  it("fails if role is passed (unexpected)", () => {
    const result = createInitialUserSchema.safeParse({
      ...validData,
      role: "ADMIN",
    });
    expect(result.success).toBe(false);
  });
});
