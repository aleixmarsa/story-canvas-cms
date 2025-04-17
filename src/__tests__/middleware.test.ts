/**
 * @jest-environment node
 */
import { middleware } from "@/middleware";
import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "@/lib/constants/dashboard";

jest.mock("@/lib/auth/session", () => ({
  getSession: jest.fn(),
}));

import { getSession } from "@/lib/auth/session";

const expectRedirect = (
  res: NextResponse | undefined,
  expectedPathname: string
) => {
  expect(res).toBeDefined();

  const location = res?.headers.get("location");
  expect(location).toBeDefined();

  const actualPath = new URL(location!).pathname;
  expect(actualPath).toBe(expectedPathname);
};

const mockRequest = (pathname: string) =>
  new NextRequest(`http://localhost${pathname}`);

describe("middleware", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to /admin/login if route is protected and no session", async () => {
    (getSession as jest.Mock).mockResolvedValue(null);

    const req = mockRequest(ROUTES.dashboard);
    const res = await middleware(req);

    expect(res?.status).toBe(307);
    expectRedirect(res, ROUTES.login);
  });

  it("redirects to /admin/dashboard if public route and session exists", async () => {
    (getSession as jest.Mock).mockResolvedValue("mock-user-id");

    const req = mockRequest(ROUTES.login);
    const res = await middleware(req);

    expect(res?.status).toBe(307);
    expectRedirect(res, ROUTES.dashboard);
  });

  it("allows access if route is protected and session exists", async () => {
    (getSession as jest.Mock).mockResolvedValue("mock-user-id");

    const req = mockRequest(ROUTES.dashboard);
    const res = await middleware(req);

    expect(res?.status).toBe(200);
    expect(res?.headers.get("x-middleware-request-x-user-id")).toBe(
      "mock-user-id"
    );
  });

  it("adds x-current-path header in all cases", async () => {
    (getSession as jest.Mock).mockResolvedValue(null);
    const req = mockRequest("/admin/create-initial-user");
    const res = await middleware(req);
    expect(res?.headers.get("x-middleware-request-x-current-path")).toBe(
      "/admin/create-initial-user"
    );
  });
});
