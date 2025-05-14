import { baseUserSchema } from "../base-user-schema";
import { Role } from "@prisma/client";

describe("baseUserSchema", () => {
  const validData = {
    email: "user@example.com",
    password: "12345678aA!",
    confirmPassword: "12345678aA!",
    role: Role.EDITOR,
  };

  it("passes with valid input", () => {
    const result = baseUserSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails with invalid email", () => {
    const result = baseUserSchema.safeParse({
      ...validData,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().email?._errors).toContain("Invalid email");
  });

  it("fails with short password", () => {
    const result = baseUserSchema.safeParse({
      ...validData,
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().password?._errors).toContain(
      "Password must be at least 8 characters long"
    );
  });

  it("fails with missing role", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, ...withoutRole } = validData;
    const result = baseUserSchema.safeParse(withoutRole);
    expect(result.success).toBe(false);
    expect(result.error?.format().role?._errors.length).toBeGreaterThan(0);
  });

  it("fails with invalid role", () => {
    const result = baseUserSchema.safeParse({
      ...validData,
      role: "SUPERADMIN", // no existeix
    });
    expect(result.success).toBe(false);
  });
});
