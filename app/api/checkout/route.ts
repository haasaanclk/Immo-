import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUser } from "@/lib/current-user";
import { setUserTier } from "@/db";
import { isTier, tierInfo } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Önce giriş yapın." }, { status: 401 });

  const { tier } = await req.json().catch(() => ({}));
  if (!isTier(tier) || tier === "resident") {
    return NextResponse.json({ error: "Geçersiz üyelik." }, { status: 400 });
  }
  const info = tierInfo(tier);
  const origin = new URL(req.url).origin;
  const key = process.env.STRIPE_SECRET_KEY;

  // No Stripe key → demo upgrade (mirrors the concierge demo fallback).
  if (!key) {
    await setUserTier(user.id, tier);
    return NextResponse.json({ mode: "demo", redirect: `/account?upgraded=${tier}` });
  }

  // Live Stripe Checkout.
  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: { userId: user.id, tier },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            recurring: { interval: tier === "cercle_noir" ? "year" : "month" },
            unit_amount: tier === "cercle_noir" ? 50000 : 4900,
            product_data: { name: `DOMAINE ${info.name}` },
          },
        },
      ],
      success_url: `${origin}/account?upgraded=${tier}`,
      cancel_url: `${origin}/account?canceled=1`,
    });
    return NextResponse.json({ mode: "stripe", url: session.url });
  } catch {
    return NextResponse.json({ error: "Ödeme başlatılamadı." }, { status: 502 });
  }
}
