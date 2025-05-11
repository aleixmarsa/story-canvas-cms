/* eslint-disable @typescript-eslint/no-unused-vars */
import { paragraphSectionSchema } from "../paragraph-section-schema";

describe("paragraphSectionSchema", () => {
  const baseValid = {
    name: "Paragraph Section",
    createdBy: "Author",
    body: "This is a paragraph section.",
    textPadding: {
      top: 10,
      bottom: 20,
    },
    textAnimation: {
      animationType: "slide-up",
      delay: 0.5,
      duration: 1,
      easing: "power2.out",
    },
    scrollTrigger: {
      start: "top top",
      end: "bottom bottom",
      scrub: "true",
    },
  };

  it("passes with valid input", () => {
    const result = paragraphSectionSchema.safeParse(baseValid);
    expect(result.success).toBe(true);
  });

  it("fails if body is empty", () => {
    const result = paragraphSectionSchema.safeParse({
      ...baseValid,
      body: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().body?._errors).toContain(
      "Text cannot be empty"
    );
  });

  it("fails if body is missing", () => {
    const { body, ...rest } = baseValid;
    const result = paragraphSectionSchema.safeParse(rest);
    expect(result.success).toBe(false);
    expect(result.error?.format().body?._errors).toContain("Required");
  });

  it("passes if textPadding is omitted", () => {
    const { textPadding, ...rest } = baseValid;
    const result = paragraphSectionSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it("fails if textPadding has non-numeric values", () => {
    const result = paragraphSectionSchema.safeParse({
      ...baseValid,
      textPadding: {
        top: "large", // invalid
      },
    });
    expect(result.success).toBe(false);
  });

  it("fails if scrollTrigger has only start", () => {
    const result = paragraphSectionSchema.safeParse({
      ...baseValid,
      scrollTrigger: {
        start: "top center",
      },
    });
    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((issue) =>
        issue.message.includes("ScrollTrigger settings are required")
      )
    ).toBe(true);
  });

  it("fails if textAnimation has invalid animationType", () => {
    const result = paragraphSectionSchema.safeParse({
      ...baseValid,
      textAnimation: {
        animationType: "rotate", // not in enum
      },
    });
    expect(result.success).toBe(false);
  });

  it("fails if required base fields are missing", () => {
    const { name, createdBy, ...rest } = baseValid;
    const result = paragraphSectionSchema.safeParse(rest);
    expect(result.success).toBe(false);
    expect(result.error?.format().name?._errors).toContain("Required");
    expect(result.error?.format().createdBy?._errors).toContain("Required");
  });
});
