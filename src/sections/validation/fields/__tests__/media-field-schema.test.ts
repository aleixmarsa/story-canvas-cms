import { mediaFieldSchema } from "../media-field-schema";

describe("mediaFieldSchema", () => {
  const validData = {
    url: "https://example.com/image.jpg",
    publicId: "folder/image-id",
  };

  it("passes with valid data", () => {
    const result = mediaFieldSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails if url is missing", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { url, ...rest } = validData;
    const result = mediaFieldSchema.safeParse(rest);
    expect(result.success).toBe(false);
    expect(result.error?.format().url?._errors).toContain("Required");
  });

  it("fails if url is invalid", () => {
    const result = mediaFieldSchema.safeParse({
      ...validData,
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().url?._errors).toContain("Invalid image URL");
  });

  it("fails if publicId is missing", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { publicId, ...rest } = validData;
    const result = mediaFieldSchema.safeParse(rest);
    expect(result.success).toBe(false);
    expect(result.error?.format().publicId?._errors).toContain("Required");
  });

  it("fails if publicId is not a string", () => {
    const result = mediaFieldSchema.safeParse({
      ...validData,
      publicId: 123,
    });
    expect(result.success).toBe(false);
  });

  it("fails if url is not a string", () => {
    const result = mediaFieldSchema.safeParse({
      ...validData,
      url: true,
    });
    expect(result.success).toBe(false);
  });
});
