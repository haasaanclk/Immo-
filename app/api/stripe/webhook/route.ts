import { NextResponse } from "next/server";
import Stripe from "stripe";
import { setUserTier } from "@/db";
import { isTier } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Stripe webhook — applies the purchased tier on checkout completion. */
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret) {
    return NextResponse.json({ error: "Stripe yapılandırılmamış." }, { status: 503 });
  }

  const stripe = new Stripe(key);
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig ?? "", secret);
  } catch {
    return NextResponse.json({ error: "İmza doğrulanamadı." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const tier = session.metadata?.tier;
    if (userId && tier && isTier(tier)) {
      await setUserTier(userId, tier);
    }
  }

  return NextResponse.json({ received: true });
}
