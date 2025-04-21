/**
 * @jest-environment node
 */
import { publishSection } from "../publish-section-version";
import { verifySession } from "@/lib/dal/auth";
import { publishSectionVersion } from "@/lib/dal/section-versions";
import { Role, SectionType } from "@prisma/client";
import type { SectionWithVersions } from "@/types/section";

jest.mock("@/lib/dal/auth", () => ({
  verifySession: jest.fn(),
}));

jest.mock("@/lib/dal/section-versions", () => ({
  publishSectionVersion: jest.fn(),
}));

const mockVerifySession = verifySession as jest.Mock;
const mockPublishSectionVersion = publishSectionVersion as jest.Mock;

describe("publishSection", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns error if user is not authenticated", async () => {
    mockVerifySession.mockResolvedValue(null);

    const res = await publishSection(1);
    expect(res).toEqual({ error: "Unauthorized" });
  });

  it("returns error if versionId is not a number", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    const res = await publishSection(NaN);
    expect(res).toEqual({ error: "Invalid section version ID" });
  });

  it("returns error if version not found", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockPublishSectionVersion.mockRejectedValue(
      new Error("Section version not found")
    );

    const res = await publishSection(42);
    expect(res).toEqual({ error: "Section version not found" });
  });

  it("returns error on unexpected exception", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockPublishSectionVersion.mockRejectedValue(new Error("Boom"));

    const res = await publishSection(99);
    expect(res).toEqual({ error: "Internal server error" });
  });

  it("publishes section version successfully", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });

    const fakeSection: SectionWithVersions = {
      id: 1,
      storyId: 1,
      currentDraftId: 10,
      publishedVersionId: 9,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      lastEditedBy: "admin",
      lockedBy: null,
      currentDraft: {
        id: 10,
        name: "Draft Section",
        sectionId: 1,
        slug: "draft-section",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "admin",
        content: {},
        status: "draft",
        type: SectionType.TITLE,
        order: 1,
        comment: null,
      },
      publishedVersion: {
        id: 9,
        name: "Published Section",
        sectionId: 1,
        slug: "published-section",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "admin",
        content: {},
        status: "published",
        type: SectionType.TITLE,
        order: 1,
        comment: null,
      },
    };

    mockPublishSectionVersion.mockResolvedValue(fakeSection);

    const res = await publishSection(1);
    expect(res).toEqual({
      success: true,
      section: fakeSection,
    });
  });
});
