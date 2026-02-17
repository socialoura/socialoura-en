"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

interface HeaderBarSettings {
  enabled: boolean;
  text: string;
  backgroundColor: string;
  textColor: string;
  linkUrl?: string;
  linkText?: string;
}

export default function HeaderBar() {
  const [settings, setSettings] = useState<HeaderBarSettings | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the header bar in this session
    const dismissed = sessionStorage.getItem("headerBarDismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
      setIsVisible(false);
    }

    // Fetch settings from API
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/header-bar");
      const data = await response.json();
      if (data.settings && data.settings.enabled) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Failed to fetch header bar settings:", error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("headerBarDismissed", "true");
    setIsDismissed(true);
  };

  if (!settings || !settings.enabled || isDismissed || !isVisible) {
    return null;
  }

  return (
    <div
      className="relative w-full text-center py-2.5 px-4 text-sm font-medium z-50"
      style={{
        backgroundColor: settings.backgroundColor,
        color: settings.textColor,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <span>{settings.text}</span>
        {settings.linkUrl && settings.linkText && (
          <Link
            href={settings.linkUrl}
            className="underline font-semibold hover:opacity-80 transition-opacity"
            style={{ color: settings.textColor }}
          >
            {settings.linkText}
          </Link>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        style={{ color: settings.textColor }}
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
