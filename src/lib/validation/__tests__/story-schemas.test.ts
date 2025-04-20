import { storySchema } from "../story-schemas";

describe("storySchema", () => {
  it("validates correct input", () => {
    const result = storySchema.safeParse({
      title: "A great story",
      slug: "a-great-story",
      createdBy: "user123",
      description: "Optional description",
      theme: {},
      components: [],
      content: { sections: [] },
      storyId: 42,
    });
    expect(result.success).toBe(true);
  });

  it("fails with short title", () => {
    const result = storySchema.safeParse({
      title: "No",
      slug: "valid-slug",
      createdBy: "user123",
    });
    expect(result.success).toBe(false);
  });

  it("fails with invalid slug format", () => {
    const result = storySchema.safeParse({
      title: "Valid title",
      slug: "Invalid Slug!",
      createdBy: "user123",
    });
    expect(result.success).toBe(false);
  });

  it("fails when createdBy is missing", () => {
    const result = storySchema.safeParse({
      title: "Valid title",
      slug: "valid-title",
    });
    expect(result.success).toBe(false);
  });

  it("passes with only required fields", () => {
    const result = storySchema.safeParse({
      title: "Another title",
      slug: "another-title",
      createdBy: "user1",
    });
    expect(result.success).toBe(true);
  });

  it("fails with non-string slug", () => {
    const result = storySchema.safeParse({
      title: "Story title",
      slug: 123,
      createdBy: "user1",
    });
    expect(result.success).toBe(false);
  });
});
