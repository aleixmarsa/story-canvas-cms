import {
  sectionSchemas,
  createSectionVersionSchema,
  updateSectionVersionSchema,
} from "../section-schemas";
import { SectionType } from "@prisma/client";

describe("sectionSchemas", () => {
  it("validates TITLE schema correctly", () => {
    const result = sectionSchemas.TITLE.schema.safeParse({
      name: "Hero title",
      order: 1,
      createdBy: "user123",
      text: "This is a title",
      backgroundImage: "https://test.com/image.jpg",
    });
    expect(result.success).toBe(true);
  });

  it("fails TITLE schema without text", () => {
    const result = sectionSchemas.TITLE.schema.safeParse({
      name: "Hero title",
      order: 1,
      createdBy: "user123",
    });
    expect(result.success).toBe(false);
  });

  it("validates PARAGRAPH schema correctly", () => {
    const result = sectionSchemas.PARAGRAPH.schema.safeParse({
      name: "Intro",
      order: 2,
      createdBy: "user123",
      body: "This is a paragraph.",
    });
    expect(result.success).toBe(true);
  });

  it("fails PARAGRAPH schema without body", () => {
    const result = sectionSchemas.PARAGRAPH.schema.safeParse({
      name: "Intro",
      order: 2,
      createdBy: "user123",
    });
    expect(result.success).toBe(false);
  });

  it("validates IMAGE schema correctly", () => {
    const result = sectionSchemas.IMAGE.schema.safeParse({
      name: "Photo",
      order: 3,
      createdBy: "user123",
      url: "https://test.com/photo.jpg",
      alt: "This is a photo",
      caption: "This is a caption",
    });
    expect(result.success).toBe(true);
  });

  it("fails IMAGE schema with invalid url", () => {
    const result = sectionSchemas.IMAGE.schema.safeParse({
      name: "Photo",
      order: 3,
      createdBy: "user123",
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("validates VIDEO schema correctly", () => {
    const result = sectionSchemas.VIDEO.schema.safeParse({
      name: "Video section",
      order: 4,
      createdBy: "user123",
      embedUrl: "https://www.test.com/embed/aaaaa",
      title: "This is a video",
    });
    expect(result.success).toBe(true);
  });

  it("fails VIDEO schema with missing fields", () => {
    const result = sectionSchemas.VIDEO.schema.safeParse({
      name: "Video section",
      order: 4,
      createdBy: "user123",
    });
    expect(result.success).toBe(false);
  });
});

describe("createSectionVersionSchema", () => {
  it("validates full payload correctly", () => {
    const result = createSectionVersionSchema.safeParse({
      storyId: 1,
      name: "New section",
      type: SectionType.PARAGRAPH,
      order: 0,
      content: { body: "Test" },
      createdBy: "editor1",
      comment: "First draft",
    });
    expect(result.success).toBe(true);
  });

  it("fails with missing fields", () => {
    const result = createSectionVersionSchema.safeParse({
      storyId: 0,
      name: "",
      type: "UNKNOWN",
      order: -1,
      content: {},
      createdBy: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateSectionVersionSchema", () => {
  it("validates update correctly", () => {
    const result = updateSectionVersionSchema.safeParse({
      storyId: 2,
      name: "Updated section",
      type: SectionType.TITLE,
      order: 1,
      content: { text: "Updated title" },
      comment: "Test",
    });
    expect(result.success).toBe(true);
  });

  it("fails with invalid update", () => {
    const result = updateSectionVersionSchema.safeParse({
      storyId: -5,
      name: "",
      type: "TITLE",
      order: -1,
      content: {},
    });
    expect(result.success).toBe(false);
  });
});
