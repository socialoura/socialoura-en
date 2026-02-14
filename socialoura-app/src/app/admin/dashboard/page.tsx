"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, isTokenValid, removeToken } from "@/lib/admin-auth";
import { LayoutDashboard, DollarSign, ShoppingBag, BarChart3, Settings, Tag, LogOut } from "lucide-react";
import PricingTab from "@/components/admin/PricingTab";
import OrdersTab from "@/components/admin/OrdersTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import SettingsTab from "@/components/admin/SettingsTab";
import PromoCodesTab from "@/components/admin/PromoCodesTab";

type Tab = "pricing" | "orders" | "analytics" | "settings" | "promo-codes";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("pricing");
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!isTokenValid(token)) {
      router.push("/admin");
      return;
    }
    setUsername(token!.username);
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/admin");
  };

  const tabs = [
    { id: "pricing" as Tab, label: "Pricing", icon: DollarSign },
    { id: "orders" as Tab, label: "Orders", icon: ShoppingBag },
    { id: "analytics" as Tab, label: "Analytics", icon: BarChart3 },
    { id: "settings" as Tab, label: "Settings", icon: Settings },
    { id: "promo-codes" as Tab, label: "Promo Codes", icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-gradient rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">Welcome, {username}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "pricing" && <PricingTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "settings" && <SettingsTab />}
        {activeTab === "promo-codes" && <PromoCodesTab />}
      </main>
    </div>
  );
}
