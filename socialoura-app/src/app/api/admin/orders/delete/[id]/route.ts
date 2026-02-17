import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/lib/admin-auth";
import { deleteOrder } from "@/lib/orders-db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get("Authorization");
  const token = verifyAuthHeader(authHeader);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Order ID required" }, { status: 400 });
  }

  const deleted = await deleteOrder(id);

  if (!deleted) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
