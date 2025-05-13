import { loginSchema } from "../login-schema";

describe("loginSchema", () => {
  const validEmail = "user@example.com";
  const validPassword = "12345678aA!";

  it("validates correct input", () => {
    const result = loginSchema.safeParse({
      email: validEmail,
      password: validPassword,
    });
    expect(result.success).toBe(true);
  });

  it("fails when email is invalid", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: validPassword,
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().email?._errors).toContain(
      "Invalid email address"
    );
  });

  it("fails when email is missing", () => {
    const result = loginSchema.safeParse({
      password: validPassword,
    });
    expect(result.success).toBe(false);
  });

  it("fails when password is missing", () => {
    const result = loginSchema.safeParse({
      email: validEmail,
    });
    expect(result.success).toBe(false);
  });
});
