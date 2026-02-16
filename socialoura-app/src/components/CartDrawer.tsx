"use client";

import { useCart } from "@/contexts/CartContext";
import { X, Trash2, ShoppingBag, ArrowRight, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

const formatUSD = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[440px] bg-white border-l border-[#E5E7EB] shadow-2xl z-50 animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">Your Cart</h2>
            <p className="text-sm text-[#4B5563] font-medium">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-[#4B5563]" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-[#E5E7EB]" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-1">Your cart is empty</h3>
              <p className="text-sm text-[#4B5563] mb-6">
                Browse our services and add a plan to get started.
              </p>
              <button
                onClick={closeCart}
                className="bg-[#FF4B6A] hover:bg-[#E8435F] text-white font-semibold px-6 py-2.5 rounded-lg transition-all text-sm"
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB] hover:border-[#FF4B6A]/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold text-[#FF4B6A] bg-[#FF4B6A]/10 px-2 py-0.5 rounded capitalize">
                          {item.platform}
                        </span>
                      </div>
                      <h3 className="font-semibold text-[#111827] text-[15px] mb-1 truncate">
                        {item.productName} — {item.quantity.toLocaleString("en-US")}
                      </h3>
                      {item.username && (
                        <p className="text-xs text-[#4B5563]">
                          @{item.username}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="text-lg font-bold text-[#111827]">
                        {formatUSD(item.price)}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-[#4B5563]/50 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
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
          <div className="border-t border-[#E5E7EB] p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[15px] font-semibold text-[#4B5563]">Subtotal</span>
              <span className="text-2xl font-extrabold text-[#111827]">
                {formatUSD(totalPrice)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#FF4B6A] hover:bg-[#E8435F] text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 text-[15px]"
            >
              Checkout Securely
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-[#4B5563]">
              <Lock className="w-3 h-3" />
              <span>Secure checkout with SSL encryption</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
