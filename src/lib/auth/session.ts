import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import {
  sessionPayloadSchema,
  SessionPayload,
} from "../validation/session-payload-schema";
import { Role } from "@prisma/client";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

/**
 * Creates a session for the user by signing a JWT with the user's ID and expiration date.
 * @param userId - The ID of the user to create a session for
 * @returns A signed JWT session token
 */
export async function createSession(userId: string, role: Role) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt, role });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
}

/**
 * Deletes the session cookie.
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

/**
 * Retrieves the session from cookies and verifies it.
 * @returns The user ID and role if the session is valid, null otherwise
 */
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) {
    return null;
  }
  const payload = await decrypt(session);
  if (!payload) {
    return null;
  }
  const { userId, role, expiresAt } = payload;
  if (new Date(expiresAt) < new Date()) {
    await deleteSession();
    return null;
  }
  return { userId, role };
}
/**
 * Encrypts the session payload using JWT.
 * @param payload - The session payload to encrypt
 * @returns A signed JWT session token
 */
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

/**
 * Decrypts the session token and verifies it.
 * @param session - The session token to decrypt
 * @returns The decrypted session payload if valid, null otherwise
 */

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    const parsed = sessionPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      console.error("Invalid session structure:", parsed.error);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.log("Failed to verify session:", error);
    return null;
  }
}
