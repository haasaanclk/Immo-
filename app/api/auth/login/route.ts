import { NextResponse } from "next/server";
import { getUserByEmail } from "@/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: "E-posta ve parola gerekli." }, { status: 400 });
  }
  const user = await getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "E-posta veya parola hatalı." }, { status: 401 });
  }
  await setSessionCookie({ userId: user.id, email: user.email, name: user.name, tier: user.tier });
  return NextResponse.json({ ok: true, tier: user.tier });
}
