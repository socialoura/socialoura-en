"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, ShoppingCart, LogOut, Plus, Trash2, TrendingUp, RefreshCw } from "lucide-react";
import { products as staticProducts } from "@/data/products";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "packs">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [packs, setPacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddPack, setShowAddPack] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sortBy, setSortBy] = useState<'quantity' | 'price' | 'platform' | 'type' | 'none'>('none');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // New pack form
  const [newPack, setNewPack] = useState({
    platform: "Instagram",
    type: "followers",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, packsRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/packs"),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }

      if (packsRes.ok) {
        const packsData = await packsRes.json();
        setPacks(packsData.packs || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncPacks = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch("/api/admin/packs/sync", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Synchronisé ${data.synced} packs depuis les produits statiques`);
        fetchData();
      }
    } catch (error) {
      console.error("Failed to sync packs:", error);
      alert("Erreur lors de la synchronisation");
    } finally {
      setIsSyncing(false);
    }
  };

  // Get all static products as packs for display
  const allStaticPacks = staticProducts.flatMap((product) =>
    product.pricingTiers.map((tier) => ({
      id: `static-${product.id}-${tier.quantity}`,
      platform: product.platform.charAt(0).toUpperCase() + product.platform.slice(1),
      type: product.type,
      quantity: tier.quantity,
      price: tier.price,
      isStatic: true,
      popular: tier.popular,
    }))
  );

  // Combine static and dynamic packs
  const allPacks = [...allStaticPacks, ...packs];

  // Sort packs based on selected criteria
  const sortedPacks = [...allPacks].sort((a: any, b: any) => {
    if (sortBy === 'none') return 0;
    
    let comparison = 0;
    
    switch (sortBy) {
      case 'quantity':
        comparison = a.quantity - b.quantity;
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'platform':
        comparison = a.platform.localeCompare(b.platform);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      default:
        return 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleAddPack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/admin/packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPack,
          quantity: parseInt(newPack.quantity),
          price: parseFloat(newPack.price),
        }),
      });

      if (response.ok) {
        setShowAddPack(false);
        setNewPack({ platform: "Instagram", type: "followers", quantity: "", price: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Failed to add pack:", error);
    }
  };

  const handleDeletePack = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pack?")) return;
    
    try {
      const response = await fetch(`/api/admin/packs?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete pack:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-300 font-medium">Manage your orders and packs</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 font-semibold">Total Orders</p>
                <p className="text-3xl font-black text-white mt-2">{orders.length}</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 font-semibold">Total Packs</p>
                <p className="text-3xl font-black text-white mt-2">{packs.length}</p>
              </div>
              <Package className="w-12 h-12 text-pink-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 font-semibold">Revenue</p>
                <p className="text-3xl font-black text-white mt-2">
                  {orders.reduce((sum, order) => sum + (order.amount || 0), 0).toFixed(2)}€
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 rounded-xl font-black transition-all ${
              activeTab === "orders"
                ? "bg-white text-purple-900"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("packs")}
            className={`px-6 py-3 rounded-xl font-black transition-all ${
              activeTab === "packs"
                ? "bg-white text-purple-900"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Packs
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          {activeTab === "orders" ? (
            <div>
              <h2 className="text-xl font-black text-white mb-4">Recent Orders</h2>
              {isLoading ? (
                <p className="text-gray-300">Loading...</p>
              ) : orders.length === 0 ? (
                <p className="text-gray-300">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{order.product || "Order"}</p>
                          <p className="text-sm text-gray-300">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-lg font-black text-green-400">
                          {order.amount?.toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-white">Manage Packs</h2>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      <option value="none">Trier par...</option>
                      <option value="quantity">Quantité</option>
                      <option value="price">Prix</option>
                      <option value="platform">Plateforme</option>
                      <option value="type">Type</option>
                    </select>
                    {sortBy !== 'none' && (
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                      >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleSyncPacks}
                    disabled={isSyncing}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync Static'}
                  </button>
                  <button
                    onClick={() => setShowAddPack(!showAddPack)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-bold hover:shadow-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Pack
                  </button>
                </div>
              </div>

              {showAddPack && (
                <form onSubmit={handleAddPack} className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">Platform</label>
                      <select
                        value={newPack.platform}
                        onChange={(e) => setNewPack({ ...newPack, platform: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="TikTok">TikTok</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Facebook">Facebook</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">Type</label>
                      <select
                        value={newPack.type}
                        onChange={(e) => setNewPack({ ...newPack, type: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      >
                        <option value="followers">Followers</option>
                        <option value="likes">Likes</option>
                        <option value="views">Views</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">Quantity</label>
                      <input
                        type="number"
                        value={newPack.quantity}
                        onChange={(e) => setNewPack({ ...newPack, quantity: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">Price (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newPack.price}
                        onChange={(e) => setNewPack({ ...newPack, price: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl font-bold hover:shadow-xl transition-all"
                  >
                    Add Pack
                  </button>
                </form>
              )}

              {isLoading ? (
                <p className="text-gray-300">Loading...</p>
              ) : allPacks.length === 0 ? (
                <p className="text-gray-300">No packs yet</p>
              ) : (
                <>
                  <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-xl">
                    <p className="text-sm text-blue-200 font-semibold">
                      📦 Affichage de {allStaticPacks.length} packs statiques (codés en dur) + {packs.length} packs dynamiques
                    </p>
                  </div>
                  
                  {/* Group packs by product */}
                  {Object.entries(
                    sortedPacks.reduce((groups: Record<string, any[]>, pack: any) => {
                      const productKey = `${pack.platform}-${pack.type}`;
                      if (!groups[productKey]) {
                        groups[productKey] = [];
                      }
                      groups[productKey].push(pack);
                      return groups;
                    }, {})
                  )
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([productKey, productPacks]: [string, any[]]) => {
                      const [platform, type] = productKey.split('-');
                      const [platformName, typeName] = [platform, type];
                      
                      return (
                        <div key={productKey} className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-black text-white">
                                {platformName} {typeName === 'followers' ? 'Abonnés' : typeName === 'likes' ? 'Likes' : 'Vues'}
                              </h3>
                              <span className="text-sm bg-white/10 px-3 py-1 rounded-full text-white font-bold">
                                {productPacks.length} packs
                              </span>
                            </div>
                            <div className="text-sm text-gray-400">
                              {productPacks.reduce((sum: number, pack: any) => sum + pack.price, 0).toFixed(2)}€ total
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {productPacks.map((pack: any) => (
                                <div
                                  key={pack.id}
                                  className={`rounded-xl p-4 border ${
                                    pack.isStatic
                                      ? 'bg-blue-500/10 border-blue-500/30'
                                      : 'bg-white/5 border-white/10'
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className="font-bold text-white">{pack.platform}</p>
                                        {pack.isStatic && (
                                          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">
                                            Static
                                          </span>
                                        )}
                                        {pack.popular && (
                                          <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full font-bold">
                                            Popular
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-300">{pack.type}</p>
                                    </div>
                                    {!pack.isStatic && (
                                      <button
                                        onClick={() => handleDeletePack(pack.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-2xl font-black text-white mb-1">
                                    {pack.quantity?.toLocaleString()}
                                  </p>
                                  <p className="text-lg font-bold text-green-400">{pack.price?.toFixed(2)}€</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
