import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { email, password, name } = await req.json().catch(() => ({}));
  if (!email || !password || !name) {
    return NextResponse.json({ error: "Ad, e-posta ve parola gerekli." }, { status: 400 });
  }
  if (String(password).length < 6) {
    return NextResponse.json({ error: "Parola en az 6 karakter olmalı." }, { status: 400 });
  }
  if (await getUserByEmail(email)) {
    return NextResponse.json({ error: "Bu e-posta zaten kayıtlı." }, { status: 409 });
  }
  const user = await createUser(email, await hashPassword(password), name);
  if (!user) return NextResponse.json({ error: "Kayıt oluşturulamadı." }, { status: 500 });
  await setSessionCookie({ userId: user.id, email: user.email, name: user.name, tier: user.tier });
  return NextResponse.json({ ok: true, tier: user.tier });
}
