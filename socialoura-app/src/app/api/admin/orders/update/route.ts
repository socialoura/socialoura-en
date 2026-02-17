import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/lib/admin-auth";
import { updateOrder } from "@/lib/orders-db";

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = verifyAuthHeader(authHeader);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const updatedOrder = await updateOrder(id, updates);

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("[admin/orders/update] Failed:", error);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
