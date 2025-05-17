/**
 * @jest-environment node
 */
import { softDeleteSection } from "@/lib/actions/sections/delete-section";
import { verifySession } from "@/lib/dal/auth";
import {
  getSectionWithVersions,
  softDeleteSectionWithVersions,
} from "@/lib/dal/sections";
import { Role } from "@prisma/client";

jest.mock("@/lib/dal/auth", () => ({
  verifySession: jest.fn(),
}));

jest.mock("@/lib/dal/sections", () => ({
  getSectionWithVersions: jest.fn(),
  softDeleteSectionWithVersions: jest.fn(),
}));

const mockVerifySession = verifySession as jest.Mock;
const mockGetSection = getSectionWithVersions as jest.Mock;
const mockDeleteSection = softDeleteSectionWithVersions as jest.Mock;

describe("deleteSection", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns error if user is not authenticated", async () => {
    mockVerifySession.mockResolvedValue(null);

    const res = await softDeleteSection(1);
    expect(res).toEqual({ error: "Unauthorized" });
  });

  it("returns error if section is not found", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockGetSection.mockResolvedValue(null);

    const res = await softDeleteSection(123);
    expect(res).toEqual({ error: "Section not found" });
  });

  it("deletes section successfully", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockGetSection.mockResolvedValue({
      id: 1,
      currentDraft: {},
      publishedVersion: {},
    });
    mockDeleteSection.mockResolvedValue(undefined);

    const res = await softDeleteSection(1);
    expect(res).toEqual({ success: true });
    expect(mockDeleteSection).toHaveBeenCalledWith(1);
  });

  it("returns error on unexpected exception", async () => {
    mockVerifySession.mockResolvedValue({ id: "admin", role: Role.ADMIN });
    mockGetSection.mockRejectedValue(new Error("DB exploded"));

    const res = await softDeleteSection(1);
    expect(res).toEqual({ error: "Internal server error" });
  });
});
