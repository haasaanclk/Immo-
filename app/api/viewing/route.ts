import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { createViewing, getPropertyById } from "@/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Önce giriş yapın.", authRequired: true }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { propertyId, type, preferredDate, qualification, anonymous, note } = body ?? {};

  if (!propertyId || (type !== "viewing" && type !== "interest")) {
    return NextResponse.json({ error: "Geçersiz talep." }, { status: 400 });
  }
  const property = await getPropertyById(propertyId);
  if (!property) {
    return NextResponse.json({ error: "Mülk bulunamadı." }, { status: 404 });
  }

  await createViewing(user.id, {
    propertyId,
    type,
    preferredDate: typeof preferredDate === "string" ? preferredDate.slice(0, 80) : undefined,
    qualification: typeof qualification === "string" ? qualification.slice(0, 80) : undefined,
    anonymous: anonymous !== false,
    note: typeof note === "string" ? note.slice(0, 500) : undefined,
  });

  return NextResponse.json({ ok: true });
}
