/**
 * @jest-environment node
 */

import { publishStoryAndSections } from "../publish-story-and-sections";
import { verifySession } from "@/lib/dal/auth";
import { publishStoryVersion } from "@/lib/dal/story-versions";
import { publishSectionVersion } from "@/lib/dal/section-versions";
import { getSectionsByStoryId } from "@/lib/dal/sections";
import { Role, StoryStatus } from "@prisma/client";

jest.mock("@/lib/dal/auth", () => ({
  verifySession: jest.fn(),
}));

jest.mock("@/lib/dal/story-versions", () => ({
  publishStoryVersion: jest.fn(),
}));

jest.mock("@/lib/dal/section-versions", () => ({
  publishSectionVersion: jest.fn(),
}));

jest.mock("@/lib/dal/sections", () => ({
  getSectionsByStoryId: jest.fn(),
}));

const mockVerifySession = verifySession as jest.Mock;
const mockPublishStoryVersion = publishStoryVersion as jest.Mock;
const mockPublishSectionVersion = publishSectionVersion as jest.Mock;
const mockGetSectionsByStoryId = getSectionsByStoryId as jest.Mock;

describe("publishStoryAndSections", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns unauthorized if no session or not admin", async () => {
    mockVerifySession.mockResolvedValueOnce(null);
    const res1 = await publishStoryAndSections(1, 1);
    expect(res1).toEqual({ error: "Unauthorized" });

    mockVerifySession.mockResolvedValueOnce({ id: "u1", role: Role.EDITOR });
    const res2 = await publishStoryAndSections(1, 1);
    expect(res2).toEqual({ error: "Unauthorized" });
  });

  it("publishes story and section drafts", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockPublishStoryVersion.mockResolvedValue({ id: 1, title: "Test Story" });
    mockGetSectionsByStoryId.mockResolvedValue([
      {
        id: 101,
        currentDraft: { id: 201, status: StoryStatus.draft },
        publishedVersion: null,
      },
      {
        id: 102,
        currentDraft: { id: 202, status: StoryStatus.published },
        publishedVersion: null,
      },
    ]);

    const res = await publishStoryAndSections(1, 10);

    expect(mockPublishStoryVersion).toHaveBeenCalledWith(1);
    expect(mockGetSectionsByStoryId).toHaveBeenCalledWith({ storyId: 10 });
    expect(mockPublishSectionVersion).toHaveBeenCalledTimes(1);
    expect(mockPublishSectionVersion).toHaveBeenCalledWith(201);
    expect(res).toEqual({
      success: true,
      story: { id: 1, title: "Test Story" },
    });
  });

  it("returns internal server error if something fails", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockPublishStoryVersion.mockImplementation(() => {
      throw new Error("fail");
    });

    const res = await publishStoryAndSections(1, 10);
    expect(res).toEqual({ error: "Internal server error" });
  });
});
