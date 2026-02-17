import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/admin-storage";

export async function GET(request: NextRequest) {
  try {
    const orders = adminStorage.getOrders();
    const now = new Date();

    // Revenue calculations
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const revenueToday = orders
      .filter((o) => new Date(o.created_at) >= todayStart && o.order_status !== "cancelled")
      .reduce((sum, o) => sum + o.price, 0);

    const revenue7Days = orders
      .filter((o) => new Date(o.created_at) >= last7Start && o.order_status !== "cancelled")
      .reduce((sum, o) => sum + o.price, 0);

    const revenue30Days = orders
      .filter((o) => new Date(o.created_at) >= last30Start && o.order_status !== "cancelled")
      .reduce((sum, o) => sum + o.price, 0);

    const revenueAllTime = orders
      .filter((o) => o.order_status !== "cancelled")
      .reduce((sum, o) => sum + o.price, 0);

    // Stats
    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.order_status !== "cancelled");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.price, 0);
    const averageCart = totalOrders > 0 ? totalRevenue / completedOrders.length : 0;
    const totalVisitors = 1000; // Fixed for now
    const conversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;

    // Revenue per day (last 7 days)
    const revenueLast7Days: { date: string; amount: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayOrders = orders.filter(
        (o) =>
          new Date(o.created_at) >= dayStart &&
          new Date(o.created_at) <= dayEnd &&
          o.order_status !== "cancelled"
      );

      revenueLast7Days.push({
        date: dayStart.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        amount: dayOrders.reduce((sum, o) => sum + o.price, 0),
        orders: dayOrders.length,
      });
    }

    // Revenue per day (last 30 days)
    const revenueLast30Days: { date: string; amount: number; orders: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const dayStart = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayOrders = orders.filter(
        (o) =>
          new Date(o.created_at) >= dayStart &&
          new Date(o.created_at) <= dayEnd &&
          o.order_status !== "cancelled"
      );

      revenueLast30Days.push({
        date: dayStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        amount: dayOrders.reduce((sum, o) => sum + o.price, 0),
        orders: dayOrders.length,
      });
    }

    // Platform distribution
    const platformMap: Record<string, { count: number; revenue: number }> = {};
    for (const order of completedOrders) {
      if (!platformMap[order.platform]) {
        platformMap[order.platform] = { count: 0, revenue: 0 };
      }
      platformMap[order.platform].count++;
      platformMap[order.platform].revenue += order.price;
    }
    const platformDistribution = Object.entries(platformMap).map(([platform, data]) => ({
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      count: data.count,
      revenue: data.revenue,
    }));

    // Top packages
    const packageMap: Record<string, { name: string; count: number; revenue: number }> = {};
    for (const order of completedOrders) {
      const key = `${order.platform}-${order.type}-${order.quantity}`;
      const name = `${order.quantity.toLocaleString()} ${order.platform.charAt(0).toUpperCase() + order.platform.slice(1)} ${order.type.charAt(0).toUpperCase() + order.type.slice(1)}`;
      if (!packageMap[key]) {
        packageMap[key] = { name, count: 0, revenue: 0 };
      }
      packageMap[key].count++;
      packageMap[key].revenue += order.price;
    }
    const topPackages = Object.values(packageMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      revenueSummary: {
        today: revenueToday,
        last7Days: revenue7Days,
        last30Days: revenue30Days,
        allTime: revenueAllTime,
      },
      stats: {
        totalRevenue,
        totalOrders,
        averageCart,
        conversionRate,
      },
      revenueLast7Days,
      revenueLast30Days,
      platformDistribution,
      topPackages,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
