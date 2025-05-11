/* eslint-disable @typescript-eslint/no-unused-vars */
import { videoSectionSchema } from "../video-section-schema";

describe("videoSectionSchema", () => {
  const baseValid = {
    name: "Video Section",
    createdBy: "Author",
    title: "Presentation Video",
    video: {
      url: "https://example.com/video.mp4",
      publicId: "videos/intro",
    },
  };

  it("passes with valid input", () => {
    const result = videoSectionSchema.safeParse(baseValid);
    expect(result.success).toBe(true);
  });

  it("fails if title is missing", () => {
    const { title, ...rest } = baseValid;
    const result = videoSectionSchema.safeParse(rest);
    expect(result.success).toBe(false);
    expect(result.error?.format().title?._errors).toContain("Required");
  });

  it("fails if title is empty", () => {
    const result = videoSectionSchema.safeParse({
      ...baseValid,
      title: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().title?._errors).toContain(
      "Title is required"
    );
  });

  it("fails if video.url is invalid", () => {
    const result = videoSectionSchema.safeParse({
      ...baseValid,
      video: {
        ...baseValid.video,
        url: "not-a-url",
      },
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().video?.url?._errors).toContain(
      "Invalid image URL"
    );
  });

  it("fails if video.publicId is missing", () => {
    const { publicId, ...rest } = baseValid.video;
    const result = videoSectionSchema.safeParse({
      ...baseValid,
      video: rest,
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().video?.publicId?._errors).toContain(
      "Required"
    );
  });

  it("fails if base fields are missing", () => {
    const { name, createdBy, ...rest } = baseValid;
    const result = videoSectionSchema.safeParse(rest);
    expect(result.success).toBe(false);
    expect(result.error?.format().name?._errors).toContain("Required");
    expect(result.error?.format().createdBy?._errors).toContain("Required");
  });

  it("passes with additional style fields (sectionLayout)", () => {
    const result = videoSectionSchema.safeParse({
      ...baseValid,
      sectionLayout: {
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      },
    });
    expect(result.success).toBe(true);
  });
});
