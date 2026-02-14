import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/admin-storage";
import { verifyAuthHeader } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = verifyAuthHeader(authHeader);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = adminStorage.getStripeSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = verifyAuthHeader(authHeader);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { publishable_key, secret_key } = await request.json();

    // Validate Stripe keys format
    if (!publishable_key?.startsWith("pk_")) {
      return NextResponse.json(
        { error: "Invalid publishable key format (must start with pk_)" },
        { status: 400 }
      );
    }

    if (!secret_key?.startsWith("sk_")) {
      return NextResponse.json(
        { error: "Invalid secret key format (must start with sk_)" },
        { status: 400 }
      );
    }

    const updatedSettings = adminStorage.updateStripeSettings({
      publishable_key,
      secret_key,
    });

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
