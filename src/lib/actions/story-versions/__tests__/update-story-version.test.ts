/**
 * @jest-environment node
 */
import { updateStoryVersion } from "@/lib/actions/story-versions/update-story-version";
import { verifySession } from "@/lib/dal/auth";
import {
  updateStoryVersionById,
  checkSlugConflictAcrossStories,
} from "@/lib/dal/story-versions";
import { Role } from "@prisma/client";
import { ConflictError } from "@/lib/errors";

jest.mock("@/lib/dal/auth", () => ({
  verifySession: jest.fn(),
}));

jest.mock("@/lib/dal/story-versions", () => ({
  updateStoryVersionById: jest.fn(),
  checkSlugConflictAcrossStories: jest.fn(),
}));

const mockVerifySession = verifySession as jest.Mock;
const mockUpdate = updateStoryVersionById as jest.Mock;
const mockCheckSlug = checkSlugConflictAcrossStories as jest.Mock;

describe("updateStoryVersion", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const validInput = {
    title: "Test Story",
    slug: "test-story",
    description: "Some description",
    createdBy: "admin",
    storyId: 1,
  };

  it("returns unauthorized if no session", async () => {
    mockVerifySession.mockResolvedValue(null);
    const res = await updateStoryVersion(1, validInput);
    expect(res).toEqual({ error: "Unauthorized" });
  });

  it("returns error on invalid input", async () => {
    mockVerifySession.mockResolvedValue({ id: "123", role: Role.ADMIN });
    const res = await updateStoryVersion(1, { ...validInput, title: "" });
    expect(res.error).toBe("Invalid input");
  });

  it("returns slug conflict error", async () => {
    mockVerifySession.mockResolvedValue({ id: "123", role: Role.ADMIN });
    mockCheckSlug.mockImplementation(() => {
      throw new ConflictError("Slug already exists");
    });

    const res = await updateStoryVersion(1, validInput);
    expect(res).toEqual({ error: "Slug already exists", type: "slug" });
  });

  it("returns success with updated version", async () => {
    mockVerifySession.mockResolvedValue({ id: "123", role: Role.ADMIN });
    mockCheckSlug.mockResolvedValue(undefined);
    mockUpdate.mockResolvedValue({ id: 1, ...validInput });

    const res = await updateStoryVersion(1, validInput);
    expect(res).toEqual({
      success: true,
      version: { id: 1, ...validInput },
    });
  });

  it("returns internal server error", async () => {
    mockVerifySession.mockResolvedValue({ id: "123", role: Role.ADMIN });
    mockCheckSlug.mockResolvedValue(undefined);
    mockUpdate.mockRejectedValue(new Error("Unexpected"));

    const res = await updateStoryVersion(1, validInput);
    expect(res).toEqual({ error: "Internal server error" });
  });
});
