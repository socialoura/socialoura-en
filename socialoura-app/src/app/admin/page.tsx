"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Target,
  Calendar,
  CalendarDays,
  CalendarRange,
  Infinity as InfinityIcon,
  Trophy,
  BarChart3,
  ClipboardList,
  Tag,
  Package,
  Megaphone,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import OrdersTab from "@/components/admin/OrdersTab";
import PricingTab from "@/components/admin/PricingTab";
import PromoCodesTab from "@/components/admin/PromoCodesTab";
import HeaderSettingsTab from "@/components/admin/HeaderSettingsTab";
import { getToken, encodeToken } from "@/lib/admin-auth";

const PIE_COLORS = ["#FF4B6A", "#6366F1", "#F59E0B", "#10B981"];

interface AnalyticsData {
  revenueSummary: { today: number; last7Days: number; last30Days: number; allTime: number };
  stats: { totalRevenue: number; totalOrders: number; averageCart: number; conversionRate: number };
  revenueLast7Days: { date: string; amount: number; orders: number }[];
  revenueLast30Days: { date: string; amount: number; orders: number }[];
  platformDistribution: { platform: string; count: number; revenue: number }[];
  topPackages: { name: string; count: number; revenue: number }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "pricing" | "promo" | "header">("overview");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const token = getToken();
      const res = await fetch("/api/admin/analytics", {
        headers: { Authorization: `Bearer ${encodeToken(token!)}` },
      });
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const tabs = [
    { key: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { key: "orders", label: "Orders", icon: <ClipboardList className="w-4 h-4" /> },
    { key: "pricing", label: "Pricing", icon: <Package className="w-4 h-4" /> },
    { key: "promo", label: "Promo Codes", icon: <Tag className="w-4 h-4" /> },
    { key: "header", label: "Header Bar", icon: <Megaphone className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-[#111827]">SocialNovaly Admin</h1>
              <p className="text-xs text-[#4B5563] font-medium">Dashboard &amp; Management</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-[#FF4B6A] text-white shadow-sm"
                  : "bg-white text-[#4B5563] border border-[#E5E7EB] hover:border-[#FF4B6A]/40"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Revenue Summary — 4 cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Today", value: analytics?.revenueSummary.today ?? 0, icon: <Calendar className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" },
                { label: "Last 7 Days", value: analytics?.revenueSummary.last7Days ?? 0, icon: <CalendarDays className="w-5 h-5" />, color: "bg-purple-50 text-purple-600" },
                { label: "Last 30 Days", value: analytics?.revenueSummary.last30Days ?? 0, icon: <CalendarRange className="w-5 h-5" />, color: "bg-amber-50 text-amber-600" },
                { label: "All Time", value: analytics?.revenueSummary.allTime ?? 0, icon: <InfinityIcon className="w-5 h-5" />, color: "bg-green-50 text-green-600" },
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{card.label}</span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>{card.icon}</div>
                  </div>
                  <div className="text-2xl font-extrabold text-[#111827]">{fmt(card.value)}</div>
                </div>
              ))}
            </div>

            {/* Stats KPI — 4 cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Revenue", value: fmt(analytics?.stats.totalRevenue ?? 0), icon: <DollarSign className="w-5 h-5" /> },
                { label: "Total Orders", value: (analytics?.stats.totalOrders ?? 0).toLocaleString(), icon: <ShoppingCart className="w-5 h-5" /> },
                { label: "Average Cart", value: fmt(analytics?.stats.averageCart ?? 0), icon: <TrendingUp className="w-5 h-5" /> },
                { label: "Conversion Rate", value: `${(analytics?.stats.conversionRate ?? 0).toFixed(2)}%`, icon: <Target className="w-5 h-5" /> },
              ].map((kpi, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FFE4EC] flex items-center justify-center text-[#FF4B6A]">{kpi.icon}</div>
                    <span className="text-xs font-semibold text-[#4B5563]">{kpi.label}</span>
                  </div>
                  <div className="text-xl font-extrabold text-[#111827]">{kpi.value}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Last 7 Days — Line Chart */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#111827] mb-4">Revenue — Last 7 Days</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics?.revenueLast7Days || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#4B5563" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#4B5563" }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip
                        formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
                        contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }}
                      />
                      <Line type="monotone" dataKey="amount" stroke="#FF4B6A" strokeWidth={2.5} dot={{ r: 4, fill: "#FF4B6A" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-xs text-[#4B5563]">
                  {(analytics?.revenueLast7Days || []).reduce((s, d) => s + d.orders, 0)} orders in the last 7 days
                </div>
              </div>

              {/* Revenue Last 30 Days — Bar Chart */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#111827] mb-4">Revenue — Last 30 Days</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.revenueLast30Days || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#4B5563" }} interval={4} />
                      <YAxis tick={{ fontSize: 11, fill: "#4B5563" }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip
                        formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
                        contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }}
                      />
                      <Bar dataKey="amount" fill="#FF4B6A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-xs text-[#4B5563]">
                  {(analytics?.revenueLast30Days || []).reduce((s, d) => s + d.orders, 0)} orders in the last 30 days
                </div>
              </div>
            </div>

            {/* Bottom Row: Pie + Top Packages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Distribution — Pie Chart */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#111827] mb-4">Platform Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics?.platformDistribution || []}
                        dataKey="count"
                        nameKey="platform"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                        strokeWidth={2}
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {(analytics?.platformDistribution || []).map((_, idx) => (
                          <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any, name: any) => [value, name]}
                        contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 space-y-1">
                  {(analytics?.platformDistribution || []).map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="font-medium text-[#111827]">{p.platform}</span>
                      </div>
                      <span className="text-[#4B5563]">{p.count} orders &middot; {fmt(p.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Packages Sold */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#111827] mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#FF4B6A]" />
                  Top Packages Sold
                </h3>
                <div className="space-y-3">
                  {(analytics?.topPackages || []).length === 0 ? (
                    <p className="text-sm text-[#4B5563] text-center py-8">No sales data yet</p>
                  ) : (
                    (analytics?.topPackages || []).map((pkg, idx) => {
                      const medals = ["🥇", "🥈", "🥉"];
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]"
                        >
                          <span className="text-lg w-8 text-center flex-shrink-0">
                            {idx < 3 ? medals[idx] : `#${idx + 1}`}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-[#111827] truncate">{pkg.name}</div>
                            <div className="text-xs text-[#4B5563]">{pkg.count} sales</div>
                          </div>
                          <div className="text-sm font-bold text-[#111827]">{fmt(pkg.revenue)}</div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <OrdersTab />
          </div>
        )}

        {/* PRICING TAB */}
        {activeTab === "pricing" && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <PricingTab />
          </div>
        )}

        {/* PROMO CODES TAB */}
        {activeTab === "promo" && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <PromoCodesTab />
          </div>
        )}

        {/* HEADER BAR TAB */}
        {activeTab === "header" && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <HeaderSettingsTab />
          </div>
        )}
      </div>
    </div>
  );
}
