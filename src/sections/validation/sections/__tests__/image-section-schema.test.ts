/* eslint-disable @typescript-eslint/no-unused-vars */
import { imageSectionSchema } from "../image-section-schema";

describe("imageSectionSchema", () => {
  const baseValid = {
    name: "Image Section",
    createdBy: "Author",
    image: {
      url: "https://example.com/image.jpg",
      publicId: "folder/img123",
    },
    alt: "Descriptive text",
    caption: "Image caption",
    imageSize: {
      width: 300,
      height: 200,
    },
    imageAnimation: {
      animationType: "fade",
      delay: 1,
      duration: 2,
      easing: "power1.inOut",
    },
    scrollTrigger: {
      start: "top center",
      end: "bottom top",
      scrub: "true",
    },
  };

  it("passes with full valid data", () => {
    const result = imageSectionSchema.safeParse(baseValid);
    expect(result.success).toBe(true);
  });

  it("fails if image.url is invalid", () => {
    const result = imageSectionSchema.safeParse({
      ...baseValid,
      image: {
        ...baseValid.image,
        url: "not-a-url",
      },
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().image?.url?._errors).toContain(
      "Invalid image URL"
    );
  });

  it("fails if image.publicId is missing", () => {
    const { publicId, ...rest } = baseValid.image;
    const result = imageSectionSchema.safeParse({
      ...baseValid,
      image: rest,
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().image?.publicId?._errors).toContain(
      "Required"
    );
  });

  it("passes if alt and caption are omitted", () => {
    const { alt, caption, ...rest } = baseValid;
    const result = imageSectionSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it("fails if imageSize has non-numeric width", () => {
    const result = imageSectionSchema.safeParse({
      ...baseValid,
      imageSize: {
        width: "wide", // invalid
      },
    });
    expect(result.success).toBe(false);
  });

  it("fails if animationType is invalid", () => {
    const result = imageSectionSchema.safeParse({
      ...baseValid,
      imageAnimation: {
        animationType: "spin", // invalid
      },
    });
    expect(result.success).toBe(false);
  });

  it("fails if scrollTrigger has only start", () => {
    const result = imageSectionSchema.safeParse({
      ...baseValid,
      scrollTrigger: {
        start: "top top",
      },
    });
    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((issue) =>
        issue.message.includes("ScrollTrigger settings are required")
      )
    ).toBe(true);
  });

  it("fails if name or createdBy are missing", () => {
    const { name, createdBy, ...rest } = baseValid;
    const result = imageSectionSchema.safeParse(rest);
    expect(result.success).toBe(false);
    expect(result.error?.format().name?._errors).toContain("Required");
    expect(result.error?.format().createdBy?._errors).toContain("Required");
  });
});
