import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "domaine_session";
const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "domaine-dev-secret-change-in-production-please",
);
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface Session {
  userId: string;
  email: string;
  name: string;
  tier: string;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSessionToken(session: Session): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET);
}

export async function setSessionCookie(session: Session) {
  const token = await createSessionToken(session);
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      name: String(payload.name),
      tier: String(payload.tier),
    };
  } catch {
    return null;
  }
}
