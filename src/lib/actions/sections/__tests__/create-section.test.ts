/**
 * @jest-environment node
 */
import { createSection } from "@/lib/actions/sections/create-section";
import { verifySession } from "@/lib/dal/auth";
import { createSectionWithDraftVersion } from "@/lib/dal/sections";
import { ConflictError } from "@/lib/errors";
import { Role } from "@prisma/client";

jest.mock("@/lib/dal/auth", () => ({
  verifySession: jest.fn(),
}));

jest.mock("@/lib/dal/sections", () => ({
  createSectionWithDraftVersion: jest.fn(),
}));

const mockVerifySession = verifySession as jest.Mock;
const mockCreateSection = createSectionWithDraftVersion as jest.Mock;

const createFormData = (data: Record<string, string | object>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.set(
      key,
      typeof value === "object" ? JSON.stringify(value) : value
    );
  });
  return formData;
};

describe("createSection", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns error if user is not authenticated", async () => {
    mockVerifySession.mockResolvedValue(null);

    const formData = createFormData({
      storyId: "1",
      name: "Intro",
      type: "TITLE",
      order: "1",
      content: {},
      createdBy: "admin",
    });

    const res = await createSection(formData);
    expect(res).toEqual({ error: "Unauthorized" });
  });

  it("returns error on invalid input", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });

    const formData = createFormData({
      storyId: "not-a-number",
      name: "",
      type: "text",
      order: "NaN",
      content: "{}",
      createdBy: "",
    });

    const res = await createSection(formData);
    expect(res?.error).toBe("Invalid input");
    expect(res?.details).toBeDefined();
  });

  it("returns error if slug already exists", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockCreateSection.mockRejectedValue(
      new ConflictError("Slug already exists")
    );

    const formData = createFormData({
      storyId: "1",
      name: "Conflict Name",
      type: "TITLE",
      order: "1",
      content: {},
      createdBy: "admin",
    });

    const res = await createSection(formData);
    expect(res).toEqual({
      error: "Slug already exists",
      type: "slug",
    });
  });

  it("creates section successfully", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });

    const fakeSection = {
      id: 1,
      storyId: 1,
      currentDraftId: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedVersionId: null,
      lockedBy: null,
      lastEditedBy: null,
      publishedAt: null,
      currentDraft: {
        id: 10,
        name: "New Section",
        sectionId: 1,
        slug: "new-section",
        createdAt: new Date(),
        updatedAt: new Date(),
        type: "TITLE",
        order: 1,
        createdBy: "admin",
        status: "draft",
        content: {},
        comment: null,
      },
      publishedVersion: null,
    };

    mockCreateSection.mockResolvedValue(fakeSection);

    const formData = createFormData({
      storyId: "1",
      name: "New Section",
      type: "TITLE",
      order: "1",
      content: {},
      createdBy: "admin",
    });

    const res = await createSection(formData);
    expect(res).toEqual({
      success: true,
      section: fakeSection,
    });
  });

  it("returns error on unexpected exception", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockCreateSection.mockRejectedValue(new Error("DB failure"));

    const formData = createFormData({
      storyId: "1",
      name: "New Section",
      type: "TITLE",
      order: "1",
      content: {},
      createdBy: "admin",
    });

    const res = await createSection(formData);
    expect(res).toEqual({
      error: "Internal server error",
    });
  });
});
