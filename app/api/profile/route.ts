import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { saveLifestyleProfile } from "@/db";
import type { LifestyleProfile } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Persist the lifestyle profile the concierge produced (logged-in users only). */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ saved: false }); // anonymous — silently ignore

  const body = await req.json().catch(() => null);
  const profile = body?.profile as LifestyleProfile | undefined;
  if (!profile?.traits || !Array.isArray(profile.traits)) {
    return NextResponse.json({ saved: false, error: "Geçersiz profil." }, { status: 400 });
  }
  await saveLifestyleProfile(user.id, profile);
  return NextResponse.json({ saved: true });
}
