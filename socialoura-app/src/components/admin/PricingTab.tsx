"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { encodeToken, getToken } from "@/lib/admin-auth";

type PlatformKey = "instagram" | "tiktok";
type Goal = { followers: string; price: string };
type PricingState = Record<PlatformKey, Goal[]>;

export default function PricingTab() {
  const [pricing, setPricing] = useState<PricingState>({ instagram: [], tiktok: [] });
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ platform: PlatformKey; index: number } | null>(null);
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
        setPricing({
          instagram: Array.isArray(data.instagram) ? data.instagram : [],
          tiktok: Array.isArray(data.tiktok) ? data.tiktok : [],
        });
      } catch (error) {
        console.error("Failed to fetch pricing:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPricing();
  }, []);

  const handleAddGoal = (platform: PlatformKey) => {
    setPricing((prev) => ({
      ...prev,
      [platform]: [...prev[platform], { followers: "", price: "" }],
    }));
  };

  const handleUpdateGoal = (
    platform: PlatformKey,
    index: number,
    field: keyof Goal,
    value: string
  ) => {
    setPricing((prev) => ({
      ...prev,
      [platform]: prev[platform].map((g, i) => (i === index ? { ...g, [field]: value } : g)),
    }));
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    const { platform, index } = deleteConfirm;
    setPricing((prev) => ({
      ...prev,
      [platform]: prev[platform].filter((_, i) => i !== index),
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
    return <div className="text-center py-8 text-gray-300">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Pricing</h2>
          <p className="text-sm text-gray-300 font-medium">
            Ajoute/modifie tes packs, puis sauvegarde en une fois.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasToken || saving}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {(["instagram", "tiktok"] as PlatformKey[]).map((platform) => (
        <div key={platform} className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-white capitalize">{platform}</h3>
            <button
              onClick={() => handleAddGoal(platform)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-2 rounded-xl font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Goal
            </button>
          </div>

          {pricing[platform].length === 0 ? (
            <p className="text-gray-300 text-sm">Aucun pack. Clique sur "Add Goal".</p>
          ) : (
            <div className="space-y-3">
              {pricing[platform].map((goal, index) => (
                <div
                  key={`${platform}-${index}`}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center bg-white/5 border border-white/10 rounded-xl p-3"
                >
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Followers</label>
                    <input
                      value={goal.followers}
                      onChange={(e) => handleUpdateGoal(platform, index, "followers", e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="1000"
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Price (€)</label>
                    <input
                      value={goal.price}
                      onChange={(e) => handleUpdateGoal(platform, index, "price", e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="9.99"
                      inputMode="decimal"
                    />
                  </div>
                  <div className="flex md:justify-end">
                    <button
                      onClick={() => setDeleteConfirm({ platform, index })}
                      className="text-red-400 hover:text-red-300 transition-colors px-2 py-2"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-gray-900">Supprimer ce pack ?</h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
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
