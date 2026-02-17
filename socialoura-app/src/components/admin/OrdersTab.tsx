"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/admin";
import { Search, Filter, Edit, Trash2, X } from "lucide-react";
import { getToken, encodeToken } from "@/lib/admin-auth";

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, platformFilter, statusFilter]);

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

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (platformFilter !== "all") {
      filtered = filtered.filter((order) => order.platform === platformFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.order_status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order["order_status"]) => {
    const token = getToken();
    try {
      const response = await fetch("/api/admin/orders/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
        body: JSON.stringify({ id: orderId, order_status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleUpdateNotes = async (orderId: string, notes: string) => {
    const token = getToken();
    try {
      const response = await fetch("/api/admin/orders/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
        body: JSON.stringify({ id: orderId, notes }),
      });
      const data = await response.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        setEditingOrder(null);
      }
    } catch (error) {
      console.error("Failed to update notes:", error);
    }
  };

  const handleDelete = async (orderId: string) => {
    const token = getToken();
    try {
      const response = await fetch(`/api/admin/orders/delete/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${encodeToken(token!)}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Orders Management</h2>
        <p className="text-gray-500 text-sm">View and manage all customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4B6A] text-sm"
            />
          </div>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4B6A] text-sm"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4B6A] text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            {filteredOrders.length} orders found
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Platform
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Country
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">
                      {order.username}
                    </div>
                    <div className="text-xs text-gray-500">{order.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {order.platform}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {order.quantity.toLocaleString()} {order.type}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    ${order.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.country || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.order_status}
                      onChange={(e) =>
                        handleUpdateStatus(order.id, e.target.value as any)
                      }
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                        order.order_status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingOrder(order)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit notes"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(order.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete order"
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

      {/* Edit Notes Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Edit Notes</h3>
              <button
                onClick={() => setEditingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order Notes
              </label>
              <textarea
                defaultValue={editingOrder.notes || ""}
                id="notes-textarea"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4B6A]"
                placeholder="Add notes about this order..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditingOrder(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const textarea = document.getElementById(
                    "notes-textarea"
                  ) as HTMLTextAreaElement;
                  handleUpdateNotes(editingOrder.id, textarea.value);
                }}
                className="flex-1 px-4 py-2 bg-[#FF4B6A] hover:bg-[#E8435F] text-white rounded-lg font-medium transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this order? This action cannot be undone.
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
