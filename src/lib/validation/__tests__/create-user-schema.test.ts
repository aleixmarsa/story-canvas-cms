import { createUserSchema } from "../create-user-schema";
import { Role } from "@prisma/client";

describe("createUserSchema", () => {
  const validData = {
    email: "user@example.com",
    password: "pasword123",
    confirmPassword: "pasword123",
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
});
