import { NextResponse } from "next/server";
import { getPricing, type Goal } from "@/lib/db";

// Public API to get packs for product pages
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');

    const pricing = await getPricing();
    const instagram = pricing?.instagram ?? [];
    const tiktok = pricing?.tiktok ?? [];

    const goals: Goal[] =
      platform?.toLowerCase() === "instagram" ? instagram :
      platform?.toLowerCase() === "tiktok" ? tiktok :
      [];

    const pricingTiers = goals
      .map((g) => {
        const quantity = Number(String(g.followers).replace(/\s/g, ""));
        const price = Number(String(g.price).replace(",", "."));
        if (!Number.isFinite(quantity) || !Number.isFinite(price) || quantity <= 0) return null;
        return {
          quantity,
          price,
          pricePerUnit: price / quantity,
        };
      })
      .filter((x): x is { quantity: number; price: number; pricePerUnit: number } => x !== null);

    // Sort by quantity
    pricingTiers.sort((a, b) => a.quantity - b.quantity);

    return NextResponse.json({ pricingTiers });
  } catch (error) {
    console.error("Error fetching packs:", error);
    return NextResponse.json({ pricingTiers: [] });
  }
}
