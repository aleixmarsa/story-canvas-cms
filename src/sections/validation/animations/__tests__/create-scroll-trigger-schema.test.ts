import { createScrollTriggerSchema } from "../create-scroll-trigger-schema";

describe("createScrollTriggerSchema", () => {
  const schema = createScrollTriggerSchema();

  it("passes with undefined (optional schema)", () => {
    const result = schema.safeParse(undefined);
    expect(result.success).toBe(true);
  });

  it("passes with both start and end", () => {
    const result = schema.safeParse({
      start: "top top",
      end: "bottom bottom",
    });
    expect(result.success).toBe(true);
  });

  it("passes with full valid input including scrub", () => {
    const result = schema.safeParse({
      start: "top top",
      end: "bottom bottom",
      scrub: "true",
    });
    expect(result.success).toBe(true);
  });

  it("fails if only start is provided", () => {
    const result = schema.safeParse({
      start: "top top",
    });
    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((issue) =>
        issue.message.includes("ScrollTrigger settings are required")
      )
    ).toBe(true);
  });

  it("fails if only end is provided", () => {
    const result = schema.safeParse({
      end: "bottom bottom",
    });
    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((issue) =>
        issue.message.includes("ScrollTrigger settings are required")
      )
    ).toBe(true);
  });

  it("fails if start is empty string", () => {
    const result = schema.safeParse({
      start: "",
      end: "bottom bottom",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().start?._errors).toContain(
      "Start is required"
    );
  });

  it("fails if end is empty string", () => {
    const result = schema.safeParse({
      start: "top top",
      end: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().end?._errors).toContain("End is required");
  });

  it("fails if scrub is invalid", () => {
    const result = schema.safeParse({
      start: "top",
      end: "bottom",
      scrub: "maybe",
    });
    expect(result.success).toBe(false);
  });
});
