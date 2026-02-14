"use client";

import { useEffect, useState } from "react";
import { StripeSettings } from "@/types/admin";
import { Key, CreditCard, Save } from "lucide-react";
import { getToken, encodeToken } from "@/lib/admin-auth";

export default function SettingsTab() {
  const [stripeSettings, setStripeSettings] = useState<StripeSettings>({
    publishable_key: "",
    secret_key: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchStripeSettings();
  }, []);

  const fetchStripeSettings = async () => {
    try {
      const token = getToken();
      const response = await fetch("/api/admin/stripe-settings", {
        headers: {
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
      });
      const data = await response.json();
      setStripeSettings(data.settings || { publishable_key: "", secret_key: "" });
    } catch (error) {
      console.error("Failed to fetch Stripe settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    try {
      const token = getToken();
      const response = await fetch("/api/admin/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Password updated successfully" });
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update password" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error" });
    }
  };

  const handleStripeSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!stripeSettings.publishable_key.startsWith("pk_")) {
      setMessage({ type: "error", text: "Publishable key must start with pk_" });
      return;
    }

    if (!stripeSettings.secret_key.startsWith("sk_")) {
      setMessage({ type: "error", text: "Secret key must start with sk_" });
      return;
    }

    try {
      const token = getToken();
      const response = await fetch("/api/admin/stripe-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
        body: JSON.stringify(stripeSettings),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Stripe settings updated successfully" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update settings" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error" });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Settings</h2>
        <p className="text-gray-500 text-sm">Manage your admin account and integrations</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
              <p className="text-xs text-gray-500">Update your admin password</p>
            </div>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Confirm new password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-orange-gradient text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              Update Password
            </button>
          </form>
        </div>

        {/* Stripe Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Stripe Configuration</h3>
              <p className="text-xs text-gray-500">Configure payment gateway</p>
            </div>
          </div>
          <form onSubmit={handleStripeSettingsUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Publishable Key
              </label>
              <input
                type="text"
                value={stripeSettings.publishable_key}
                onChange={(e) =>
                  setStripeSettings({
                    ...stripeSettings,
                    publishable_key: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                placeholder="pk_test_..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">Must start with pk_</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Secret Key
              </label>
              <input
                type="password"
                value={stripeSettings.secret_key}
                onChange={(e) =>
                  setStripeSettings({
                    ...stripeSettings,
                    secret_key: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                placeholder="sk_test_..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">Must start with sk_</p>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-orange-gradient text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              Save Stripe Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
