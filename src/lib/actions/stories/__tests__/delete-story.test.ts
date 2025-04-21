/**
 * @jest-environment node
 */
import { deleteStory } from "@/lib/actions/stories/delete-story";
import { verifySession } from "@/lib/dal/auth";
import {
  getStoryWithSectionsAndVersions,
  deleteStoryAndRelated,
} from "@/lib/dal/stories";
import { Role } from "@prisma/client";

jest.mock("@/lib/dal/auth", () => ({
  verifySession: jest.fn(),
}));

jest.mock("@/lib/dal/stories", () => ({
  getStoryWithSectionsAndVersions: jest.fn(),
  deleteStoryAndRelated: jest.fn(),
}));

const mockVerifySession = verifySession as jest.Mock;
const mockGetStory = getStoryWithSectionsAndVersions as jest.Mock;
const mockDeleteStory = deleteStoryAndRelated as jest.Mock;

describe("deleteStory", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns error if user is not admin", async () => {
    mockVerifySession.mockResolvedValue({ id: "123", role: "EDITOR" });

    const res = await deleteStory(1);
    expect(res).toEqual({ error: "Unauthorized" });
  });

  it("returns error if story is not found", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockGetStory.mockResolvedValue(null);

    const res = await deleteStory(1);
    expect(res).toEqual({ error: "Story not found" });
  });

  it("deletes story successfully", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockGetStory.mockResolvedValue({ id: 1, title: "Test Story" });
    mockDeleteStory.mockResolvedValue(undefined);

    const res = await deleteStory(1);
    expect(res).toEqual({ success: true });
    expect(mockDeleteStory).toHaveBeenCalledWith(1);
  });

  it("returns error on internal failure", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockGetStory.mockResolvedValue({ id: 1 });
    mockDeleteStory.mockRejectedValue(new Error("DB Error"));

    const res = await deleteStory(1);
    expect(res).toEqual({ error: "Internal server error" });
  });
});
