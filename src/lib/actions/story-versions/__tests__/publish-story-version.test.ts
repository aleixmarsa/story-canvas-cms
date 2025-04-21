/**
 * @jest-environment node
 */
import { publishStoryVersion } from "@/lib/actions/story-versions/publish-story-version";
import { publishStoryVersion as publishInDb } from "@/lib/dal/story-versions";
import { verifySession } from "@/lib/dal/auth";

jest.mock("@/lib/dal/auth", () => ({
  verifySession: jest.fn(),
}));

jest.mock("@/lib/dal/story-versions", () => ({
  publishStoryVersion: jest.fn(),
}));

const mockVerifySession = verifySession as jest.Mock;
const mockPublishInDb = publishInDb as jest.Mock;

describe("publishStoryVersion", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns error if session is invalid", async () => {
    mockVerifySession.mockResolvedValue(null);

    const res = await publishStoryVersion(123);
    expect(res).toEqual({ error: "Unauthorized" });
  });

  it("returns error if story version is not found", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: "ADMIN" });
    mockPublishInDb.mockRejectedValue(new Error("Story version not found"));

    const res = await publishStoryVersion(123);
    expect(res).toEqual({ error: "Story version not found" });
  });

  it("returns error on unexpected failure", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: "ADMIN" });
    mockPublishInDb.mockRejectedValue(new Error("Something went wrong"));

    const res = await publishStoryVersion(123);
    expect(res).toEqual({ error: "Internal server error" });
  });

  it("returns success and updated story on valid publish", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: "ADMIN" });

    const mockStory = {
      id: 123,
      currentDraft: { id: 321, slug: "draft-story" },
      publishedVersion: { id: 789, slug: "published-story" },
    };

    mockPublishInDb.mockResolvedValue(mockStory);

    const res = await publishStoryVersion(123);
    expect(res).toEqual({
      success: true,
      story: mockStory,
    });
  });
});
