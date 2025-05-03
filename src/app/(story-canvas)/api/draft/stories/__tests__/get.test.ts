/**
 * @jest-environment node
 */

import { GET } from "../route";
import { getCurrentDraftStories } from "@/lib/actions/draft/get-draft-stories";

jest.mock("@/lib/actions/draft/get-draft-stories", () => ({
  getCurrentDraftStories: jest.fn(),
}));

describe("GET /api/draft/stories/draft", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 and list of current draft stories", async () => {
    const mockStories = [
      { id: 1, currentDraft: { title: "Story A", slug: "story-a" } },
      { id: 2, currentDraft: { title: "Story B", slug: "story-b" } },
    ];

    (getCurrentDraftStories as jest.Mock).mockResolvedValue(mockStories);

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockStories);
  });

  it("returns 500 on internal server error", async () => {
    (getCurrentDraftStories as jest.Mock).mockRejectedValue(
      new Error("Database failed")
    );

    const res = await GET();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal server error");
    expect(json.error).toBeDefined();
  });
});
