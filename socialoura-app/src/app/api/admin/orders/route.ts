import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/lib/admin-auth";
import { getAllOrders } from "@/lib/orders-db";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = verifyAuthHeader(authHeader);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await getAllOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("[admin/orders] Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
