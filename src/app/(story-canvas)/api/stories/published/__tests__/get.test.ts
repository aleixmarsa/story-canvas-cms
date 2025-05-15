/**
 * @jest-environment node
 */
import { GET } from "../route";
import { createRequest } from "node-mocks-http";
import { NextRequest } from "next/server";
import { getPublishedStories } from "@/lib/actions/published/get-published-stories";

jest.mock("@/lib/actions/published/get-published-stories", () => ({
  getPublishedStories: jest.fn(),
}));

function createMockNextRequest(query: string): NextRequest {
  const nodeReq = createRequest({
    method: "GET",
    url: `http://localhost/api/published/stories${query}`,
  });
  return new NextRequest(nodeReq);
}

describe("GET /api/published/stories", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 and data when query is valid", async () => {
    (getPublishedStories as jest.Mock).mockResolvedValue({
      success: true,
      stories: [{ id: 1 }],
    });

    const req = createMockNextRequest(
      "?includeSections=true&orderBy=createdAt&order=asc"
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ success: true, stories: [{ id: 1 }] });
  });

  it("returns 400 if includeSections is invalid", async () => {
    const req = createMockNextRequest("?includeSections=notvalid");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toBe("Invalid query parameters");
    expect(json.errors).toHaveProperty("includeSections");
  });

  it("returns 400 if orderBy is invalid", async () => {
    const req = createMockNextRequest(
      "?includeSections=false&orderBy=invalidField&order=desc"
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.errors).toHaveProperty("orderBy");
  });

  it("returns 500 if getPublishedStories throws", async () => {
    (getPublishedStories as jest.Mock).mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const req = createMockNextRequest(
      "?includeSections=true&orderBy=updatedAt&order=asc"
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.message).toBe("Internal server error");
    expect(json.error).toBeDefined();
  });
});
