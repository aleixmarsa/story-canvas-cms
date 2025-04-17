import { sessionPayloadSchema } from "../session-payload-schema";

describe("sessionPayloadSchema", () => {
  it("validates correct input", () => {
    const result = sessionPayloadSchema.safeParse({
      userId: "12345",
      role: "ADMIN",
      expiresAt: new Date(),
    });
    expect(result.success).toBe(true);
  });

  it("fails when userId is invalid", () => {
    const result = sessionPayloadSchema.safeParse({
      userId: 3,
      expiresAt: new Date(),
    });
    expect(result.success).toBe(false);
  });

  it("fails when userId is empty", () => {
    const result = sessionPayloadSchema.safeParse({
      userId: "",
      expiresAt: new Date(),
    });
    expect(result.success).toBe(false);
  });

  it("fails when userId is missing", () => {
    const result = sessionPayloadSchema.safeParse({
      expiresAt: new Date(),
    });
    expect(result.success).toBe(false);
  });

  it("fails when expiresAt is invalid", () => {
    const result = sessionPayloadSchema.safeParse({
      userId: "12345",
      expiresAt: 12345,
    });
    expect(result.success).toBe(false);
  });
  it("fails when expiresAt is missing", () => {
    const result = sessionPayloadSchema.safeParse({
      userId: "12345",
    });
    expect(result.success).toBe(false);
  });
  it("fails when payload is empty", () => {
    const result = sessionPayloadSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
