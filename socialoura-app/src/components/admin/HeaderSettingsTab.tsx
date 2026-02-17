"use client";

import { useEffect, useState } from "react";
import { HeaderBarSettings } from "@/types/admin";
import { ToggleLeft, ToggleRight, Save, Eye } from "lucide-react";
import { getToken, encodeToken } from "@/lib/admin-auth";

export default function HeaderSettingsTab() {
  const [settings, setSettings] = useState<HeaderBarSettings>({
    enabled: false,
    text: "",
    backgroundColor: "#FF4B6A",
    textColor: "#FFFFFF",
    linkUrl: "",
    linkText: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = getToken();
      const response = await fetch("/api/admin/header-settings", {
        headers: {
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
      });
      const data = await response.json();
      setSettings(data.settings || settings);
    } catch (error) {
      console.error("Failed to fetch header settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const response = await fetch("/api/admin/header-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (data.success) {
        alert("Header bar settings saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save header settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Header Bar Settings</h2>
        <p className="text-gray-500 text-sm mt-1">
          Configure the announcement banner displayed at the top of your website
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Display Header Bar</h3>
            <p className="text-sm text-gray-500">
              Show or hide the announcement banner on your website
            </p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              settings.enabled
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {settings.enabled ? (
              <>
                <ToggleRight className="w-5 h-5" />
                Enabled
              </>
            ) : (
              <>
                <ToggleLeft className="w-5 h-5" />
                Disabled
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="space-y-6">
          {/* Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Announcement Text *
            </label>
            <input
              type="text"
              value={settings.text}
              onChange={(e) => setSettings({ ...settings, text: e.target.value })}
              placeholder="🎉 Special Offer: 20% off all packages!"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4B6A] text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use emojis to make it more engaging
            </p>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) =>
                    setSettings({ ...settings, backgroundColor: e.target.value })
                  }
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.backgroundColor}
                  onChange={(e) =>
                    setSettings({ ...settings, backgroundColor: e.target.value })
                  }
                  placeholder="#FF4B6A"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4B6A] text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Text Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.textColor}
                  onChange={(e) =>
                    setSettings({ ...settings, textColor: e.target.value })
                  }
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.textColor}
                  onChange={(e) =>
                    setSettings({ ...settings, textColor: e.target.value })
                  }
                  placeholder="#FFFFFF"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4B6A] text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Link (optional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Link URL (optional)
              </label>
              <input
                type="text"
                value={settings.linkUrl || ""}
                onChange={(e) => setSettings({ ...settings, linkUrl: e.target.value })}
                placeholder="/#services"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4B6A] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Link Text (optional)
              </label>
              <input
                type="text"
                value={settings.linkText || ""}
                onChange={(e) => setSettings({ ...settings, linkText: e.target.value })}
                placeholder="Shop Now"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4B6A] text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Preview</h3>
        </div>
        <div
          className="rounded-lg overflow-hidden"
          style={{
            backgroundColor: settings.backgroundColor,
            color: settings.textColor,
          }}
        >
          <div className="px-4 py-3 text-center text-sm font-medium">
            {settings.text || "Your announcement text will appear here"}
            {settings.linkUrl && settings.linkText && (
              <>
                {" "}
                <span className="underline font-semibold cursor-pointer">
                  {settings.linkText}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !settings.text}
          className="flex items-center gap-2 bg-[#FF4B6A] hover:bg-[#E8435F] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
