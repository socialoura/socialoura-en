import { NextResponse } from "next/server";
import { products } from "@/data/products";

// This endpoint syncs static products to admin packs storage
export async function POST() {
  try {
    // Import all static products as admin packs
    const packsToSync = products.flatMap((product) =>
      product.pricingTiers.map((tier) => ({
        platform: product.platform.charAt(0).toUpperCase() + product.platform.slice(1),
        type: product.type,
        quantity: tier.quantity,
        price: tier.price,
        pricePerUnit: tier.pricePerUnit,
        popular: tier.popular || false,
        productId: product.id,
      }))
    );

    return NextResponse.json({
      success: true,
      synced: packsToSync.length,
      message: `Synced ${packsToSync.length} packs from static products`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to sync packs" },
      { status: 500 }
    );
  }
}
