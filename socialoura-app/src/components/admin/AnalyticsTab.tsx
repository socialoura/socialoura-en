"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/admin";
import { TrendingUp, DollarSign, ShoppingCart, Percent } from "lucide-react";
import { getToken, encodeToken } from "@/lib/admin-auth";

export default function AnalyticsTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = getToken();
      const response = await fetch("/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate KPIs
  const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0);
  const totalOrders = orders.length;
  const averageCart = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalVisitors = 1250; // Mock data
  const conversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;

  // Revenue last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const revenue7Days = last7Days.map((date) => {
    const dayOrders = orders.filter(
      (o) => o.created_at.split("T")[0] === date
    );
    return {
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      amount: dayOrders.reduce((sum, o) => sum + o.price, 0),
    };
  });

  // Platform distribution
  const platformStats = orders.reduce((acc, order) => {
    if (!acc[order.platform]) {
      acc[order.platform] = { count: 0, revenue: 0 };
    }
    acc[order.platform].count++;
    acc[order.platform].revenue += order.price;
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  const platformDistribution = Object.entries(platformStats).map(
    ([platform, stats]) => ({
      platform,
      count: stats.count,
      revenue: stats.revenue,
      percentage: (stats.count / totalOrders) * 100,
    })
  );

  // Top packages
  const packageStats = orders.reduce((acc, order) => {
    const key = `${order.platform}-${order.type}-${order.quantity}`;
    if (!acc[key]) {
      acc[key] = {
        name: `${order.platform} ${order.quantity} ${order.type}`,
        count: 0,
        revenue: 0,
      };
    }
    acc[key].count++;
    acc[key].revenue += order.price;
    return acc;
  }, {} as Record<string, { name: string; count: number; revenue: number }>);

  const topPackages = Object.values(packageStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Analytics Dashboard</h2>
        <p className="text-gray-500 text-sm">Overview of your business performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Revenue</span>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            €{totalRevenue.toFixed(2)}
          </div>
          <p className="text-xs text-green-600 mt-1">↑ All time</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Orders</span>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalOrders}</div>
          <p className="text-xs text-blue-600 mt-1">All time</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Average Cart</span>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            €{averageCart.toFixed(2)}
          </div>
          <p className="text-xs text-orange-600 mt-1">Per order</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Percent className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {conversionRate.toFixed(1)}%
          </div>
          <p className="text-xs text-purple-600 mt-1">{totalVisitors} visitors</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Last 7 Days */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue (Last 7 Days)</h3>
          <div className="space-y-3">
            {revenue7Days.map((day, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-16">{day.date}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-orange-gradient h-full rounded-full flex items-center justify-end pr-3"
                    style={{
                      width: `${Math.max(
                        (day.amount / Math.max(...revenue7Days.map((d) => d.amount))) * 100,
                        5
                      )}%`,
                    }}
                  >
                    <span className="text-xs font-semibold text-white">
                      €{day.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Platform Distribution
          </h3>
          <div className="space-y-4">
            {platformDistribution.map((platform, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {platform.platform}
                  </span>
                  <span className="text-sm text-gray-600">
                    {platform.count} orders (€{platform.revenue.toFixed(2)})
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-orange-gradient h-2 rounded-full"
                    style={{ width: `${platform.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Packages */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Top Packages</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Package
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Orders
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topPackages.map((pkg, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
                    {pkg.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{pkg.count}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    €{pkg.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
