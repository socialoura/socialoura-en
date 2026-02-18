import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = "eur", metadata = {} } = body;

    // Validation
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number in cents." },
        { status: 400 }
      );
    }

    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      );
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency.toLowerCase(),
      payment_method_types: ['card', 'apple_pay', 'google_pay'],
      metadata: {
        ...metadata,
        created_at: new Date().toISOString(),
      },
    });

    // Return client secret to frontend
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    
    // Handle Stripe-specific errors
    if (error.type === "StripeCardError") {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
