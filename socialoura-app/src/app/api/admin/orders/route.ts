import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/admin-storage";
import { verifyAuthHeader } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = verifyAuthHeader(authHeader);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ orders: adminStorage.getOrders() });
}
