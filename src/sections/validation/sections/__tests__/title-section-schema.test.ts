/* eslint-disable @typescript-eslint/no-unused-vars */
import { titleSectionSchema } from "../title-section-schema";

describe("titleSectionSchema", () => {
  const baseValid = {
    name: "Main Title",
    createdBy: "Admin",
    text: "Welcome to the site",
    textPadding: {
      top: 16,
      bottom: 8,
    },
    textAnimation: {
      animationType: "fade",
      delay: 0,
      duration: 1,
      easing: "power1.out",
    },
    scrollTrigger: {
      start: "top top",
      end: "bottom bottom",
      scrub: "true",
    },
  };

  it("passes with all valid fields", () => {
    const result = titleSectionSchema.safeParse(baseValid);
    expect(result.success).toBe(true);
  });

  it("fails if text is missing", () => {
    const { text, ...rest } = baseValid;
    const result = titleSectionSchema.safeParse(rest);
    expect(result.success).toBe(false);
    expect(result.error?.format().text?._errors).toContain("Required");
  });

  it("fails if text is empty", () => {
    const result = titleSectionSchema.safeParse({
      ...baseValid,
      text: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().text?._errors).toContain("Title is required");
  });

  it("passes without optional textPadding", () => {
    const { textPadding, ...rest } = baseValid;
    const result = titleSectionSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it("fails if textPadding has invalid values", () => {
    const result = titleSectionSchema.safeParse({
      ...baseValid,
      textPadding: {
        top: "big", // invalid
      },
    });
    expect(result.success).toBe(false);
  });

  it("fails if scrollTrigger is incomplete", () => {
    const result = titleSectionSchema.safeParse({
      ...baseValid,
      scrollTrigger: {
        start: "top",
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
    const result = titleSectionSchema.safeParse({
      ...baseValid,
      textAnimation: {
        animationType: "fly-in", // not in enum
      },
    });
    expect(result.success).toBe(false);
  });

  it("fails if required base fields are missing", () => {
    const { name, createdBy, ...rest } = baseValid;
    const result = titleSectionSchema.safeParse(rest);
    expect(result.success).toBe(false);
    expect(result.error?.format().name?._errors).toContain("Required");
    expect(result.error?.format().createdBy?._errors).toContain("Required");
  });
});
