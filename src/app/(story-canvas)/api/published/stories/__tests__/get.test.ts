/**
 * @jest-environment node
 */

import { GET } from "../route";
import { getPublishedStories } from "@/lib/actions/published/get-published-stories";

jest.mock("@/lib/actions/published/get-published-stories", () => ({
  getPublishedStories: jest.fn(),
}));

describe("GET /api/published/stories", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 and list of published stories", async () => {
    const mockStories = [
      { id: 1, publicSlug: "story-a", publishedVersion: { title: "Story A" } },
      { id: 2, publicSlug: "story-b", publishedVersion: { title: "Story B" } },
    ];

    (getPublishedStories as jest.Mock).mockResolvedValue(mockStories);

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockStories);
  });

  it("returns 500 on internal server error", async () => {
    (getPublishedStories as jest.Mock).mockRejectedValue(
      new Error("DB connection failed")
    );

    const res = await GET();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal server error");
    expect(json.error).toBeDefined();
  });
});
