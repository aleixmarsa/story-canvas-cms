import { createUserSchema } from "../create-user-schema";
import { Role } from "@prisma/client";

describe("createUserSchema", () => {
  const validData = {
    email: "user@example.com",
    password: "12345678aA!",
    confirmPassword: "12345678aA!",
    role: Role.ADMIN,
  };

  it("passes with valid input", () => {
    const result = createUserSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when passwords do not match", () => {
    const result = createUserSchema.safeParse({
      ...validData,
      confirmPassword: "wrongpassword",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().confirmPassword?._errors).toContain(
      "Passwords do not match"
    );
  });

  it("fails with missing role", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, ...dataWithoutRole } = validData;
    const result = createUserSchema.safeParse(dataWithoutRole);
    expect(result.success).toBe(false);
  });

  it("fails with invalid email", () => {
    const result = createUserSchema.safeParse({
      ...validData,
      email: "invalid-email",
    });
    expect(result.success).toBe(false);
  });

  it("fails if password is too short", () => {
    const result = createUserSchema.safeParse({
      ...validData,
      password: "Aa1!",
      confirmPassword: "Aa1!",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().password?._errors).toContain(
      "Password must be at least 8 characters long"
    );
  });

  it("fails if password lacks a lowercase letter", () => {
    const result = createUserSchema.safeParse({
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
    const result = createUserSchema.safeParse({
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
    const result = createUserSchema.safeParse({
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
    const result = createUserSchema.safeParse({
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
