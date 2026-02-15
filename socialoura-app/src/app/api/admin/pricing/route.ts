import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/lib/admin-auth";
import { getPricing, setPricing, type PricingData } from "@/lib/db";

const DEFAULT_PRICING: PricingData = {
  instagram: [],
  tiktok: [],
};

export async function GET() {
  try {
    const pricing = await getPricing();
    return NextResponse.json(pricing ?? DEFAULT_PRICING);
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
    const body = (await request.json()) as Partial<PricingData>;
    const instagram = body.instagram;
    const tiktok = body.tiktok;

    if (!Array.isArray(instagram) || !Array.isArray(tiktok)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const data: PricingData = { instagram, tiktok };
    await setPricing(data);
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
