/**
 * @jest-environment node
 */
import { createStory } from "@/lib/actions/stories/create-story";
import { verifySession } from "@/lib/dal/auth";
import { createStoryWithDraft } from "@/lib/dal/stories";
import { ConflictError } from "@/lib/errors";
import { Role } from "@prisma/client";

jest.mock("@/lib/dal/auth", () => ({
  verifySession: jest.fn(),
}));

jest.mock("@/lib/dal/stories", () => ({
  createStoryWithDraft: jest.fn(),
}));

const mockVerifySession = verifySession as jest.Mock;
const mockCreateStoryWithDraft = createStoryWithDraft as jest.Mock;

const createFormData = (data: Record<string, string>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.set(key, value);
  });
  return formData;
};

describe("createStory", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns error on invalid input", async () => {
    const formData = createFormData({
      title: "",
      slug: "",
      description: "",
      theme: "",
      components: "",
      content: "",
      createdBy: "",
    });

    const res = await createStory(formData);
    expect(res.error).toBe("Invalid input");
    expect(res.details).toBeDefined();
  });

  it("returns error if session is not admin", async () => {
    mockVerifySession.mockResolvedValue({ id: "user", role: Role.EDITOR });

    const formData = createFormData({
      storyId: "1",
      title: "My Story",
      slug: "my-story",
      description: "Test",
      theme: "{}",
      components: "[]",
      content: "{}",
      createdBy: "admin",
    });

    const res = await createStory(formData);
    expect(res).toEqual({ error: "Unauthorized" });
  });

  it("returns slug conflict error", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockCreateStoryWithDraft.mockRejectedValue(
      new ConflictError("Slug already exists")
    );

    const formData = createFormData({
      title: "My Story",
      slug: "my-story",
      description: "A test story",
      theme: "{}",
      components: "[]",
      content: "{}",
      createdBy: "admin",
    });

    const res = await createStory(formData);
    expect(res).toEqual({
      error: "Slug already exists",
      type: "slug",
    });
  });

  it("creates story successfully", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });

    const fakeStory = {
      id: 1,
      currentDraftId: 10,
      currentDraft: {
        id: 10,
        title: "My Story",
        slug: "my-story",
        createdBy: "admin",
        content: {},
        components: [],
        theme: {},
        status: "draft",
      },
    };

    mockCreateStoryWithDraft.mockResolvedValue(fakeStory);

    const formData = createFormData({
      title: "My Story",
      slug: "my-story",
      description: "A test story",
      theme: "{}",
      components: "[]",
      content: "{}",
      createdBy: "admin",
    });

    const res = await createStory(formData);
    expect(res).toEqual({
      success: true,
      story: fakeStory,
    });
  });

  it("returns internal error on unexpected exception", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockCreateStoryWithDraft.mockRejectedValue(new Error("Unexpected"));

    const formData = createFormData({
      title: "My Story",
      slug: "my-story",
      description: "A test story",
      theme: "{}",
      components: "[]",
      content: "{}",
      createdBy: "admin",
    });

    const res = await createStory(formData);
    expect(res).toEqual({ error: "Internal server error" });
  });
});
