"use client";

import { useCart } from "@/contexts/CartContext";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CartDrawer() {
  const { items, itemCount, totalPrice, isCartOpen, removeItem, closeCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Votre Panier</h2>
              <p className="text-sm text-gray-600 font-semibold">
                {itemCount} {itemCount > 1 ? "articles" : "article"}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Panier vide</h3>
              <p className="text-gray-600 font-medium mb-6">
                Ajoutez des produits pour commencer
              </p>
              <button
                onClick={closeCart}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border-2 border-gray-200 hover:border-purple-300 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full">
                          {item.platform}
                        </span>
                      </div>
                      <h3 className="font-black text-gray-900 text-lg mb-1">
                        {item.productName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold mb-3">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg">
                          {item.quantity.toLocaleString()} unités
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{item.pricePerUnit.toFixed(3)}€/u</span>
                      </div>
                      {item.username && (
                        <div className="text-sm text-gray-600 font-medium">
                          Pour: <span className="font-bold text-gray-900">@{item.username}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                        {item.price.toFixed(2)}€
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-9 h-9 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-gray-700">Total</span>
              <span className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                {totalPrice.toFixed(2)}€
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 text-white font-black px-6 py-4 rounded-xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 text-lg uppercase tracking-wide"
            >
              Passer au paiement
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
