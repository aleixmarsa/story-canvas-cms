// /app/api/auth/token/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { compare } from "bcryptjs";
import { encrypt } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/dal/users";

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
