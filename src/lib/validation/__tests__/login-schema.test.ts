import { loginSchema } from "../login-schema";

describe("loginSchema", () => {
  it("validates correct input", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "strongpassword",
    });
    expect(result.success).toBe(true);
  });

  it("fails when email is invalid", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "strongpassword",
    });
    expect(result.success).toBe(false);
  });

  it("fails when password is too short", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("fails when email is missing", () => {
    const result = loginSchema.safeParse({
      password: "validPassword123",
    });
    expect(result.success).toBe(false);
  });

  it("fails when password is missing", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
    });
    expect(result.success).toBe(false);
  });
});
