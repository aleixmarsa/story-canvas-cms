/* eslint-disable @typescript-eslint/no-unused-vars */
import { paragraphAndimageSectionSchema } from "../paragraph-and-image-section-schema";

describe("paragraphAndimageSectionSchema", () => {
  const baseValid = {
    name: "Section with text and image",
    createdBy: "Author",
    body: "Some paragraph content.",
    image: {
      url: "https://example.com/image.jpg",
      publicId: "folder/img123",
    },
    alt: "Descriptive image",
    caption: "Image caption",
    layout: "left",
    imageSize: {
      width: 400,
      height: 300,
    },
    textAnimation: {
      animationType: "fade",
    },
    imageAnimation: {
      animationType: "zoom-in",
    },
    scrollTrigger: {
      start: "top top",
      end: "bottom bottom",
      scrub: "true",
    },
  };

  it("passes with all valid fields", () => {
    const result = paragraphAndimageSectionSchema.safeParse(baseValid);
    expect(result.success).toBe(true);
  });

  it("fails if body is empty", () => {
    const result = paragraphAndimageSectionSchema.safeParse({
      ...baseValid,
      body: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().body?._errors).toContain(
      "Text cannot be empty"
    );
  });

  it("fails if image.url is invalid", () => {
    const result = paragraphAndimageSectionSchema.safeParse({
      ...baseValid,
      image: {
        ...baseValid.image,
        url: "invalid-url",
      },
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().image?.url?._errors).toContain(
      "Invalid image URL"
    );
  });

  it("fails if image.publicId is missing", () => {
    const { publicId, ...rest } = baseValid.image;
    const result = paragraphAndimageSectionSchema.safeParse({
      ...baseValid,
      image: rest,
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().image?.publicId?._errors).toContain(
      "Required"
    );
  });

  it("passes without optional alt, caption, imageSize", () => {
    const { alt, caption, imageSize, ...rest } = baseValid;
    const result = paragraphAndimageSectionSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it("fails if imageSize width is not a number", () => {
    const result = paragraphAndimageSectionSchema.safeParse({
      ...baseValid,
      imageSize: {
        width: "wide", // invalid
      },
    });
    expect(result.success).toBe(false);
  });

  it("fails if scrollTrigger has only start", () => {
    const result = paragraphAndimageSectionSchema.safeParse({
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

  it("fails if required base fields are missing", () => {
    const { name, createdBy, ...rest } = baseValid;
    const result = paragraphAndimageSectionSchema.safeParse(rest);
    expect(result.success).toBe(false);
    expect(result.error?.format().name?._errors).toContain("Required");
    expect(result.error?.format().createdBy?._errors).toContain("Required");
  });
});
