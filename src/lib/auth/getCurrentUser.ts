import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth/session";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;

  const payload = await decrypt(session);
  if (!payload) return null;

  return {
    id: payload.userId,
    role: payload.role,
  };
}
