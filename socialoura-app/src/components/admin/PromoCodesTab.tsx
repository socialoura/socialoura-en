"use client";

import { useEffect, useState } from "react";
import { PromoCode, PromoSettings } from "@/types/admin";
import { Plus, Edit, Trash2, X, ToggleLeft, ToggleRight } from "lucide-react";
import { getToken, encodeToken } from "@/lib/admin-auth";

export default function PromoCodesTab() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [promoSettings, setPromoSettings] = useState<PromoSettings>({ enabled: true });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    discount_percent: 10,
    is_active: true,
    max_uses: 100,
    expires_at: "",
  });

  useEffect(() => {
    fetchPromoCodes();
    fetchPromoSettings();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const token = getToken();
      const response = await fetch("/api/admin/promo-codes", {
        headers: {
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
      });
      const data = await response.json();
      setPromoCodes(data.promoCodes || []);
    } catch (error) {
      console.error("Failed to fetch promo codes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromoSettings = async () => {
    try {
      const token = getToken();
      const response = await fetch("/api/admin/promo-settings", {
        headers: {
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
      });
      const data = await response.json();
      setPromoSettings(data.settings || { enabled: true });
    } catch (error) {
      console.error("Failed to fetch promo settings:", error);
    }
  };

  const handleToggleGlobalPromo = async () => {
    const token = getToken();
    try {
      const response = await fetch("/api/admin/promo-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
        body: JSON.stringify({ enabled: !promoSettings.enabled }),
      });
      const data = await response.json();
      if (data.success) {
        setPromoSettings(data.settings);
      }
    } catch (error) {
      console.error("Failed to toggle promo settings:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();

    try {
      if (editingCode) {
        const response = await fetch("/api/admin/promo-codes", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${encodeToken(token!)}`,
          },
          body: JSON.stringify({ id: editingCode.id, ...formData }),
        });
        const data = await response.json();
        if (data.success) {
          setPromoCodes((prev) =>
            prev.map((p) => (p.id === editingCode.id ? data.promoCode : p))
          );
        }
      } else {
        const response = await fetch("/api/admin/promo-codes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${encodeToken(token!)}`,
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
          setPromoCodes((prev) => [...prev, data.promoCode]);
        }
      }
      setShowModal(false);
      setEditingCode(null);
      resetForm();
    } catch (error) {
      console.error("Failed to save promo code:", error);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const token = getToken();
    try {
      const response = await fetch("/api/admin/promo-codes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setPromoCodes((prev) =>
          prev.map((p) => (p.id === id ? data.promoCode : p))
        );
      }
    } catch (error) {
      console.error("Failed to toggle promo code:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const token = getToken();
    try {
      const response = await fetch(`/api/admin/promo-codes?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setPromoCodes((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete promo code:", error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discount_percent: 10,
      is_active: true,
      max_uses: 100,
      expires_at: "",
    });
  };

  const openEditModal = (code: PromoCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      discount_percent: code.discount_percent,
      is_active: code.is_active,
      max_uses: code.max_uses || 100,
      expires_at: code.expires_at ? code.expires_at.split("T")[0] : "",
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
          <h2 className="text-2xl font-bold text-gray-900">Promo Codes</h2>
          <p className="text-gray-500 text-sm mt-1">Manage promotional discount codes</p>
        </div>
        <button
          onClick={() => {
            setEditingCode(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-orange-gradient text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Promo Code
        </button>
      </div>

      {/* Global Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Promo Code Field</h3>
            <p className="text-sm text-gray-500">
              Enable or disable promo code input on checkout
            </p>
          </div>
          <button
            onClick={handleToggleGlobalPromo}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              promoSettings.enabled
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {promoSettings.enabled ? (
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

      {/* Promo Codes Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Discount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Usage
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Expires
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {promoCodes.map((code) => (
                <tr key={code.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono font-bold text-gray-900">
                    {code.code}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-orange-600">
                    {code.discount_percent}%
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {code.current_uses} / {code.max_uses || "∞"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {code.expires_at
                      ? new Date(code.expires_at).toLocaleDateString()
                      : "No expiry"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(code.id, code.is_active)}
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        code.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {code.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(code)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(code.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCode ? "Edit Promo Code" : "Add New Promo Code"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCode(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Promo Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono uppercase"
                  placeholder="SUMMER20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount_percent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_percent: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Uses (optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_uses}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_uses: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expires At (optional)
                </label>
                <input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) =>
                    setFormData({ ...formData, expires_at: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCode(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-gradient text-white rounded-lg font-medium hover:shadow-lg"
                >
                  {editingCode ? "Update" : "Create"}
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
              Are you sure you want to delete this promo code? This action cannot be
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
