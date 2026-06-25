import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { saveProperty, unsaveProperty } from "@/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Önce giriş yapın.", authRequired: true }, { status: 401 });

  const { propertyId, action } = await req.json().catch(() => ({}));
  if (!propertyId) return NextResponse.json({ error: "Mülk gerekli." }, { status: 400 });

  if (action === "unsave") {
    await unsaveProperty(user.id, propertyId);
    return NextResponse.json({ saved: false });
  }
  await saveProperty(user.id, propertyId);
  return NextResponse.json({ saved: true });
}
