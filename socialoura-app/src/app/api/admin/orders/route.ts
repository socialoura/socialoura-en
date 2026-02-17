import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// In-memory storage for orders (replace with database in production)
let orders: any[] = [];

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('admin-auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Function to add order (called from payment success webhook)
export function addOrder(order: any) {
  orders.push({
    id: Date.now().toString(),
    ...order,
    createdAt: new Date().toISOString(),
  });
}
