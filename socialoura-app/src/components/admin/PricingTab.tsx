"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Save, X, Instagram, Music, Youtube, Facebook } from "lucide-react";
import { encodeToken, getToken } from "@/lib/admin-auth";
import { getDefaultPricing, type Goal, type PlatformKey, type PricingData, type ProductType } from "@/lib/pricing";

const platformIcons = {
  instagram: Instagram,
  tiktok: Music,
  youtube: Youtube,
  facebook: Facebook,
};

export default function PricingTab() {
  const [pricing, setPricing] = useState<PricingData>(getDefaultPricing());
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ platform: PlatformKey; type: ProductType; index: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const hasToken = useMemo(() => {
    const token = getToken();
    return Boolean(token);
  }, []);

  useEffect(() => {
    async function fetchPricing() {
      try {
        const response = await fetch("/api/admin/pricing");
        const data = await response.json();
        setPricing(data);
      } catch (error) {
        console.error("Failed to fetch pricing:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPricing();
  }, []);

  const handleAddGoal = (platform: PlatformKey, type: ProductType) => {
    setPricing((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [type]: [...(prev[platform]?.[type] ?? []), { followers: "", price: "" }],
      },
    }));
  };

  const handleUpdateGoal = (
    platform: PlatformKey,
    type: ProductType,
    index: number,
    field: keyof Goal,
    value: string
  ) => {
    setPricing((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [type]: (prev[platform]?.[type] ?? []).map((g, i) => (i === index ? { ...g, [field]: value } : g)),
      },
    }));
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    const { platform, type, index } = deleteConfirm;
    setPricing((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [type]: (prev[platform]?.[type] ?? []).filter((_, i) => i !== index),
      },
    }));
    setDeleteConfirm(null);
  };

  const handleSave = async () => {
    const token = getToken();
    if (!token) {
      alert("Tu dois être connecté pour sauvegarder");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodeToken(token)}`,
        },
        body: JSON.stringify(pricing),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data?.error || "Erreur lors de la sauvegarde");
        return;
      }

      if (!data?.success) {
        alert("Erreur lors de la sauvegarde");
        return;
      }
    } catch (error) {
      console.error("Failed to save pricing:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#FF4B6A] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[#111827]/60 text-sm font-medium">Loading pricing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Sticky save bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Pricing Management</h1>
            <p className="text-sm text-[#111827]/60 font-medium mt-0.5">
              Ajoutez/modifiez vos packs, puis sauvegardez en une fois.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasToken || saving}
            className="flex items-center gap-2 bg-[#FF4B6A] text-white px-6 py-3 rounded-lg font-semibold text-[15px] hover:bg-[#E8435F] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">
        {([
          {
            platform: "instagram" as const,
            label: "Instagram",
            types: [
              { type: "followers" as const, label: "Followers" },
              { type: "likes" as const, label: "Likes" },
              { type: "views" as const, label: "Views" },
            ],
          },
          {
            platform: "tiktok" as const,
            label: "TikTok",
            types: [
              { type: "followers" as const, label: "Followers" },
              { type: "likes" as const, label: "Likes" },
              { type: "views" as const, label: "Views" },
            ],
          },
          {
            platform: "youtube" as const,
            label: "YouTube",
            types: [
              { type: "followers" as const, label: "Subscribers" },
              { type: "likes" as const, label: "Likes" },
              { type: "views" as const, label: "Views" },
            ],
          },
          {
            platform: "facebook" as const,
            label: "Facebook",
            types: [
              { type: "followers" as const, label: "Followers" },
              { type: "likes" as const, label: "Likes" },
            ],
          },
        ] as const).map((section) => {
          const Icon = platformIcons[section.platform];
          return (
            <div key={section.platform} className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
              {/* Section header */}
              <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#111827]" />
                  </div>
                  <h2 className="text-lg font-bold text-[#111827]">{section.label}</h2>
                </div>
              </div>

              {/* Section content */}
              <div className="p-6 space-y-6">
                {section.types.map((t) => {
                  const goals = pricing?.[section.platform]?.[t.type] ?? [];
                  return (
                    <div key={`${section.platform}-${t.type}`} className="space-y-3">
                      {/* Type header */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                        <h3 className="text-[15px] font-semibold text-[#111827]">{t.label}</h3>
                        <button
                          onClick={() => handleAddGoal(section.platform, t.type)}
                          className="flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#111827] px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#F9FAFB] hover:border-[#FF4B6A] hover:text-[#FF4B6A] transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          Add Pack
                        </button>
                      </div>

                      {/* Packs list */}
                      {goals.length === 0 ? (
                        <div className="text-center py-8 bg-[#F9FAFB] rounded-lg border border-dashed border-[#E5E7EB]">
                          <p className="text-[#111827]/40 text-sm font-medium">
                            Aucun pack configuré. Cliquez sur "Add Pack" pour commencer.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {goals.map((goal, index) => (
                            <div
                              key={`${section.platform}-${t.type}-${index}`}
                              className="group grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end bg-white border border-[#E5E7EB] rounded-lg p-4 hover:bg-[#F9FAFB] hover:border-[#FF4B6A]/30 transition-all"
                            >
                              <div>
                                <label className="block text-sm font-semibold text-[#111827] mb-2">
                                  Quantité
                                </label>
                                <input
                                  type="text"
                                  value={goal.followers}
                                  onChange={(e) =>
                                    handleUpdateGoal(section.platform, t.type, index, "followers", e.target.value)
                                  }
                                  className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-md text-[#111827] text-[15px] placeholder-[#111827]/30 focus:outline-none focus:ring-2 focus:ring-[#FF4B6A]/20 focus:border-[#FF4B6A] transition-all"
                                  placeholder="1000"
                                  inputMode="numeric"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-[#111827] mb-2">
                                  Prix (€)
                                </label>
                                <input
                                  type="text"
                                  value={goal.price}
                                  onChange={(e) =>
                                    handleUpdateGoal(section.platform, t.type, index, "price", e.target.value)
                                  }
                                  className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-md text-[#111827] text-[15px] placeholder-[#111827]/30 focus:outline-none focus:ring-2 focus:ring-[#FF4B6A]/20 focus:border-[#FF4B6A] transition-all"
                                  placeholder="9.99"
                                  inputMode="decimal"
                                />
                              </div>
                              <div className="flex md:justify-end">
                                <button
                                  onClick={() => setDeleteConfirm({ platform: section.platform, type: t.type, index })}
                                  className="group/delete p-2.5 text-[#111827]/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  aria-label="Delete pack"
                                  title="Delete pack"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#111827]">Supprimer ce pack ?</h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-[#111827]/40 hover:text-[#111827] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[15px] text-[#111827]/60 mb-6 leading-relaxed">
              Cette action est irréversible. Le pack sera définitivement supprimé.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-[#E5E7EB] text-[#111827] rounded-lg hover:bg-[#F9FAFB] transition-colors font-semibold text-[15px]"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold text-[15px] shadow-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
