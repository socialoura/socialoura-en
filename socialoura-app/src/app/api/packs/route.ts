import { NextResponse } from "next/server";
import { readPacks } from "@/lib/packs-storage";

// Public API to get packs for product pages
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const type = searchParams.get('type');

    const packs = await readPacks();

    // Filter by platform and type if provided
    let filteredPacks = packs;
    
    if (platform) {
      filteredPacks = filteredPacks.filter(
        pack => pack.platform.toLowerCase() === platform.toLowerCase()
      );
    }
    
    if (type) {
      filteredPacks = filteredPacks.filter(
        pack => pack.type.toLowerCase() === type.toLowerCase()
      );
    }

    // Convert to pricing tier format
    const pricingTiers = filteredPacks.map(pack => ({
      quantity: pack.quantity,
      price: pack.price,
      pricePerUnit: pack.price / pack.quantity,
    }));

    // Sort by quantity
    pricingTiers.sort((a, b) => a.quantity - b.quantity);

    return NextResponse.json({ pricingTiers });
  } catch (error) {
    console.error("Error fetching packs:", error);
    return NextResponse.json({ pricingTiers: [] });
  }
}
