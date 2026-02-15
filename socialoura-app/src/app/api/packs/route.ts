import { NextResponse } from "next/server";
import { getPricing } from "@/lib/db";
import { type Goal, type PlatformKey, type ProductType } from "@/lib/pricing";

// Public API to get packs for product pages
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const type = searchParams.get("type");

    const pricing = await getPricing();
    const p = platform?.toLowerCase() as PlatformKey | undefined;
    const t = type?.toLowerCase() as ProductType | undefined;

    const goals: Goal[] =
      pricing && p && t && Array.isArray(pricing[p]?.[t])
        ? (pricing[p]?.[t] as Goal[])
        : [];

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
