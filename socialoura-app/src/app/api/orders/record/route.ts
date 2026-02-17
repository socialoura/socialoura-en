import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminStorage } from "@/lib/admin-storage";

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      paymentIntentId,
      items,
      email,
    }: {
      paymentIntentId: string;
      items: Array<{
        productId: string;
        productName: string;
        platform: string;
        quantity: number;
        price: number;
        pricePerUnit: number;
        username?: string;
      }>;
      email: string;
    } = body;

    if (!paymentIntentId || typeof paymentIntentId !== "string") {
      return NextResponse.json({ error: "paymentIntentId is required" }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "items is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json({ error: "Payment system not configured" }, { status: 500 });
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (pi.status !== "succeeded") {
      return NextResponse.json(
        { error: `PaymentIntent status is ${pi.status}` },
        { status: 400 }
      );
    }

    const latestChargeId =
      typeof pi.latest_charge === "string"
        ? pi.latest_charge
        : pi.latest_charge?.id;

    const latestCharge = latestChargeId
      ? await stripe.charges.retrieve(latestChargeId)
      : null;

    const country = latestCharge?.billing_details?.address?.country || undefined;

    const created_at = new Date().toISOString();

    const createdOrders = items.map((item) => {
      const platform = (item.platform || "").toLowerCase() as any;
      const typeGuess = (item.productId || item.productName || "").toLowerCase();

      const type = (typeGuess.includes("likes")
        ? "likes"
        : typeGuess.includes("views")
          ? "views"
          : "followers") as "followers" | "likes" | "views";

      return adminStorage.addOrder({
        username: item.username || "",
        email,
        country,
        stripe_payment_intent_id: paymentIntentId,
        platform,
        type,
        quantity: item.quantity,
        price: item.price,
        created_at,
        order_status: "pending",
      });
    });

    return NextResponse.json({ success: true, orders: createdOrders });
  } catch (error: any) {
    console.error("Failed to record order:", error);
    return NextResponse.json({ error: "Failed to record order" }, { status: 500 });
  }
}
