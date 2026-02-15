import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/lib/admin-auth";
import { getPricing, setPricing } from "@/lib/db";
import { getDefaultPricing, normalizePricing, type PricingData } from "@/lib/pricing";

const DEFAULT_PRICING: PricingData = getDefaultPricing();

export async function GET() {
  try {
    const pricing = await getPricing();
    const normalizedPricing = normalizePricing(pricing ?? DEFAULT_PRICING);
    return NextResponse.json(normalizedPricing);
  } catch (error) {
    return NextResponse.json(DEFAULT_PRICING);
  }
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = verifyAuthHeader(authHeader);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as unknown;
    const normalized = normalizePricing(body);
    await setPricing(normalized);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  return PUT(request);
}
