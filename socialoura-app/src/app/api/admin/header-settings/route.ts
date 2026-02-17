import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/admin-storage";
import { verifyAuthHeader } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = verifyAuthHeader(authHeader);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = adminStorage.getHeaderBarSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[admin/header-settings] GET failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = verifyAuthHeader(authHeader);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = adminStorage.updateHeaderBarSettings(body);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("[admin/header-settings] PUT failed:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 400 }
    );
  }
}
