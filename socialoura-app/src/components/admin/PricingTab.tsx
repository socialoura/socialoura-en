"use client";

import { useEffect, useState } from "react";
import { PricingPack } from "@/types/admin";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { getToken, encodeToken } from "@/lib/admin-auth";

export default function PricingTab() {
  const [pricingPacks, setPricingPacks] = useState<PricingPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPack, setEditingPack] = useState<PricingPack | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    platform: "instagram" | "tiktok" | "youtube" | "facebook";
    type: "followers" | "likes" | "views";
    quantity: number;
    price: number;
    popular: boolean;
  }>({
    platform: "instagram",
    type: "followers",
    quantity: 100,
    price: 2.75,
    popular: false,
  });

  useEffect(() => {
    fetchPricingPacks();
  }, []);

  const fetchPricingPacks = async () => {
    try {
      const token = getToken();
      const response = await fetch("/api/admin/pricing", {
        headers: {
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
      });
      const data = await response.json();
      setPricingPacks(data.pricingPacks || []);
    } catch (error) {
      console.error("Failed to fetch pricing packs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    const pricePerUnit = formData.price / formData.quantity;

    try {
      if (editingPack) {
        // Update existing pack
        const response = await fetch("/api/admin/pricing", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${encodeToken(token!)}`,
          },
          body: JSON.stringify({
            id: editingPack.id,
            ...formData,
            pricePerUnit,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setPricingPacks((prev) =>
            prev.map((p) => (p.id === editingPack.id ? data.pack : p))
          );
        }
      } else {
        // Create new pack
        const response = await fetch("/api/admin/pricing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${encodeToken(token!)}`,
          },
          body: JSON.stringify({ ...formData, pricePerUnit }),
        });
        const data = await response.json();
        if (data.success) {
          setPricingPacks((prev) => [...prev, data.pack]);
        }
      }
      setShowModal(false);
      setEditingPack(null);
      resetForm();
    } catch (error) {
      console.error("Failed to save pack:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const token = getToken();
    try {
      const response = await fetch(`/api/admin/pricing?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setPricingPacks((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete pack:", error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const resetForm = () => {
    setFormData({
      platform: "instagram",
      type: "followers",
      quantity: 100,
      price: 2.75,
      popular: false,
    });
  };

  const openEditModal = (pack: PricingPack) => {
    setEditingPack(pack);
    setFormData({
      platform: pack.platform,
      type: pack.type,
      quantity: pack.quantity,
      price: pack.price,
      popular: pack.popular || false,
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pricing Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage pricing packs for all platforms</p>
        </div>
        <button
          onClick={() => {
            setEditingPack(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-orange-gradient text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Pack
        </button>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pricingPacks.map((pack) => (
          <div
            key={pack.id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900 capitalize">
                    {pack.platform}
                  </span>
                  {pack.popular && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 capitalize">{pack.type}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEditModal(pack)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(pack.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {pack.quantity.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">{pack.type}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-orange-600">
                  €{pack.price.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500">
                  (€{pack.pricePerUnit.toFixed(4)}/unit)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingPack ? "Edit Pack" : "Add New Pack"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPack(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platform: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="followers">Followers</option>
                  <option value="likes">Likes</option>
                  <option value="views">Views</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="popular"
                  checked={formData.popular}
                  onChange={(e) =>
                    setFormData({ ...formData, popular: e.target.checked })
                  }
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="popular" className="text-sm font-medium text-gray-700">
                  Mark as popular
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPack(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-gradient text-white rounded-lg font-medium hover:shadow-lg"
                >
                  {editingPack ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this pricing pack? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
