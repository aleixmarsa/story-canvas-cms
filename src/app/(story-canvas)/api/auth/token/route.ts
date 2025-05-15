import { NextResponse } from "next/server";
import { z } from "zod";
import { compare } from "bcryptjs";
import { encrypt } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/dal/users";

/**
 * @swagger
 * /api/auth/token:
 *   post:
 *     summary: Get authentication token
 *     description: >
 *       Authenticates a user with email and password and returns a signed JWT token.
 *       This token can be used in the Authorization header to access protected endpoints.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@cms.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Successful login, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input
 *                 errors:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 */

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", errors: parsed.error.format() },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const passwordMatch = await compare(password, user.password);
  if (!passwordMatch) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

  const token = await encrypt({
    userId: user.id,
    role: user.role,
    expiresAt: expiresAt,
  });

  return NextResponse.json({ token });
}
