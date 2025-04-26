/**
 * @jest-environment node
 */
import { updateSectionVersion } from "../update-section-version";
import { verifySession } from "@/lib/dal/auth";
import {
  checkSectionSlugConflict,
  getSectionWithVersions,
} from "@/lib/dal/sections";
import { updateSectionVersionById } from "@/lib/dal/section-versions";
import { ConflictError } from "@/lib/errors";
import { Role } from "@prisma/client";

jest.mock("@/lib/dal/auth", () => ({
  verifySession: jest.fn(),
}));

jest.mock("@/lib/dal/sections", () => ({
  checkSectionSlugConflict: jest.fn(),
  getSectionWithVersions: jest.fn(),
}));

jest.mock("@/lib/dal/section-versions", () => ({
  updateSectionVersionById: jest.fn(),
}));

const mockVerifySession = verifySession as jest.Mock;
const mockCheckSlug = checkSectionSlugConflict as jest.Mock;
const mockUpdate = updateSectionVersionById as jest.Mock;
const mockGetSection = getSectionWithVersions as jest.Mock;

describe("updateSectionVersion", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const validData = {
    storyId: 1,
    sectionId: 2,
    name: "Updated Section",
    type: "TITLE",
    order: 1,
    createdBy: "admin",
    content: {},
    comment: "Updated content",
  };

  it("returns error if session is invalid", async () => {
    mockVerifySession.mockResolvedValue(null);

    const res = await updateSectionVersion(1, validData);
    expect(res).toEqual({ error: "Unauthorized" });
  });

  it("returns error on invalid input", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });

    const invalidData = {
      ...validData,
      name: "", // invalid because name is required
    };
    const res = await updateSectionVersion(1, invalidData);
    expect(res?.error).toBe("Invalid input");
    expect(res?.details).toBeDefined();
  });

  it("returns conflict error if slug already exists", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockCheckSlug.mockImplementation(() => {
      throw new ConflictError("Slug already exists");
    });

    const res = await updateSectionVersion(1, validData);
    expect(res).toEqual({ error: "Slug already exists", type: "slug" });
  });

  it("returns error on unexpected exception", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockCheckSlug.mockResolvedValue(undefined);
    mockUpdate.mockRejectedValue(new Error("Something failed"));

    const res = await updateSectionVersion(1, validData);
    expect(res).toEqual({ error: "Internal server error" });
  });

  it("updates section version successfully", async () => {
    const fakeUpdatedVersion = {
      id: 1,
      sectionId: 2,
    };

    const fakeSection = {
      id: 2,
      currentDraftId: 3,
      publishedVersionId: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      storyId: 1,
      lockedBy: null,
      lastEditedBy: "admin",
      publishedAt: new Date(),
      currentDraft: {
        id: 3,
        name: "Draft",
        sectionId: 2,
        slug: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "admin",
        content: {},
        status: "draft",
        type: "TITLE",
        order: 1,
        comment: null,
      },
      publishedVersion: null,
    };

    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockCheckSlug.mockResolvedValue(undefined);
    mockUpdate.mockResolvedValue(fakeUpdatedVersion);
    mockGetSection.mockResolvedValue(fakeSection);

    const res = await updateSectionVersion(1, validData);

    expect(res).toEqual({
      success: true,
      section: fakeSection,
    });
  });
});
