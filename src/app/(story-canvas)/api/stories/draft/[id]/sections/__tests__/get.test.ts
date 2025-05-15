/**
 * @jest-environment node
 */
import { GET } from "../route";
import { NextRequest } from "next/server";
import { getDraftStoryByStoryId } from "@/lib/dal/draft";
import { getDraftSections } from "@/lib/actions/draft/get-draft-sections-by-id";

jest.mock("@/lib/dal/draft", () => ({
  getDraftStoryByStoryId: jest.fn(),
}));

jest.mock("@/lib/actions/draft/get-draft-sections-by-id", () => ({
  getDraftSections: jest.fn(),
}));

jest.mock("@/lib/auth/session", () => ({
  verifyRequestToken: jest.fn().mockResolvedValue({ userId: "1" }),
}));

jest.mock("@/lib/auth/withAuth", () => ({
  requireAuth: jest.fn().mockResolvedValue({ userId: "1" }),
}));

describe("GET /api/draft/stories/:id/sections", () => {
  const mockParams = { id: "123" };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 404 if story is not found", async () => {
    (getDraftStoryByStoryId as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest("http://localhost");
    const res = await GET(req, { params: Promise.resolve(mockParams) });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Story not found");
  });

  it("returns 200 with sections if story exists", async () => {
    const mockStory = { id: 123, title: "Draft Story" };
    const mockSections = [
      { id: 1, name: "Section 1" },
      { id: 2, name: "Section 2" },
    ];

    (getDraftStoryByStoryId as jest.Mock).mockResolvedValue(mockStory);
    (getDraftSections as jest.Mock).mockResolvedValue({
      success: true,
      sections: mockSections,
    });

    const req = new NextRequest("http://localhost");
    const res = await GET(req, { params: Promise.resolve(mockParams) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      success: true,
      sections: mockSections,
    });
  });

  it("returns 500 if there is a server error", async () => {
    (getDraftStoryByStoryId as jest.Mock).mockRejectedValue(
      new Error("Something went wrong")
    );

    const req = new NextRequest("http://localhost");
    const res = await GET(req, { params: Promise.resolve(mockParams) });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal server error");
    expect(json.error).toBeDefined();
  });
});
