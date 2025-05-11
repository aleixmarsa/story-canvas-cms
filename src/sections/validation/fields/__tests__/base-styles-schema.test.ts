import { stylesSchema } from "../base-styles-schema";

describe("stylesSchema", () => {
  it("passes with empty object (all optional)", () => {
    const result = stylesSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("passes with valid sectionLayout", () => {
    const result = stylesSchema.safeParse({
      sectionLayout: {
        height: "100vh",
        justifyContent: "center",
        alignItems: "flex-start",
      },
    });
    expect(result.success).toBe(true);
  });

  it("fails with invalid sectionLayout height", () => {
    const result = stylesSchema.safeParse({
      sectionLayout: {
        height: "full-screen", // invalid
      },
    });
    expect(result.success).toBe(false);
    expect(
      result.error?.format().sectionLayout?.height?._errors.length
    ).toBeGreaterThan(0);
  });

  it("passes with valid sectionBackground (URL, color, size, position)", () => {
    const result = stylesSchema.safeParse({
      sectionBackground: {
        image: "https://example.com/bg.jpg",
        color: "#fff",
        size: "cover",
        position: "center",
      },
    });
    expect(result.success).toBe(true);
  });

  it("transforms empty image string to undefined", () => {
    const result = stylesSchema.parse({
      sectionBackground: {
        image: "   ",
      },
    });
    expect(result.sectionBackground?.image).toBeUndefined();
  });

  it("fails with invalid image URL", () => {
    const result = stylesSchema.safeParse({
      sectionBackground: {
        image: "not-a-url",
      },
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().sectionBackground?.image?._errors).toContain(
      "Invalid URL"
    );
  });

  it("fails with invalid color hex code", () => {
    const result = stylesSchema.safeParse({
      sectionBackground: {
        color: "red",
      },
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().sectionBackground?.color?._errors).toContain(
      "Invalid hex color code"
    );
  });

  it("passes with valid sectionPadding and sectionMargin numbers", () => {
    const result = stylesSchema.safeParse({
      sectionPadding: {
        top: 10,
        bottom: 0,
      },
      sectionMargin: {
        left: 20,
        right: 30,
      },
    });
    expect(result.success).toBe(true);
  });

  it("fails if padding values are not numbers", () => {
    const result = stylesSchema.safeParse({
      sectionPadding: {
        top: "20px", // invalid
      },
    });
    expect(result.success).toBe(false);
  });

  it("fails if margin values are negative strings", () => {
    const result = stylesSchema.safeParse({
      sectionMargin: {
        left: "-10px", // invalid
      },
    });
    expect(result.success).toBe(false);
  });
});
