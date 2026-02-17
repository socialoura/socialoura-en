import { NextResponse } from "next/server";
import { adminStorage } from "@/lib/admin-storage";

// Public API - no auth required
export async function GET() {
  try {
    const settings = adminStorage.getHeaderBarSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[header-bar] GET failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
