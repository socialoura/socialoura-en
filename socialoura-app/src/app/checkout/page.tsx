"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Loader2, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGeoLocation } from "@/hooks/useGeoLocation";

// Load Stripe publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const country = useGeoLocation();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Calculate total amount in cents from cart
  const totalAmount = Math.round(totalPrice * 100);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items.length, router]);

  useEffect(() => {
    // Create PaymentIntent only if cart has items
    const createPaymentIntent = async () => {
      if (items.length === 0) return;
      
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalAmount,
            currency: "usd",
            metadata: {
              items: JSON.stringify(items),
              itemCount: items.length,
            },
          }),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setClientSecret(data.clientSecret);
        }
      } catch (err: any) {
        setError(err.message || "Failed to initialize payment");
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [items, totalAmount]);

  const handlePaymentSuccess = async (email: string) => {
    // For each cart item, create an order via confirm API
    try {
      for (const item of items) {
        const orderData = {
          email,
          username: item.username || "",
          platform: item.platform,
          type: item.productId?.split("-").pop() || "followers",
          quantity: item.quantity,
          price: item.price,
          country,
        };

        const res = await fetch("/api/orders/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const data = await res.json();

        if (data.success && data.orderId) {
          // Store order details in sessionStorage for the success page
          sessionStorage.setItem(
            `order_${data.orderId}`,
            JSON.stringify(orderData)
          );

          // Redirect to success page with last order ID
          clearCart();
          window.location.href = `/order/success/${data.orderId}`;
          return;
        }
      }
    } catch (err) {
      console.error("Failed to confirm order:", err);
    }

    // Fallback: clear cart and go home
    clearCart();
    window.location.href = "/";
  };

  const handlePaymentError = (errorMsg: string) => {
    console.error("Payment error:", errorMsg);
  };

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#FF4B6A",
      colorBackground: "#ffffff",
      colorText: "#111827",
      colorTextSecondary: "#6B7280",
      colorDanger: "#ef4444",
      fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
      fontSizeBase: "15px",
      spacingUnit: "5px",
      borderRadius: "12px",
    },
    rules: {
      ".Tab": {
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "none",
        backgroundColor: "#ffffff",
      },
      ".Tab:hover": {
        border: "1px solid #D1D5DB",
        boxShadow: "none",
      },
      ".Tab--selected": {
        border: "2px solid #FF4B6A",
        boxShadow: "none",
        backgroundColor: "#ffffff",
      },
      ".TabIcon--selected": {
        fill: "#FF4B6A",
      },
      ".TabLabel": {
        fontWeight: "600",
        fontSize: "15px",
      },
      ".Input": {
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        boxShadow: "none",
        padding: "14px 16px",
        fontSize: "15px",
        backgroundColor: "#F9FAFB",
      },
      ".Input:focus": {
        border: "1px solid #FF4B6A",
        boxShadow: "0 0 0 3px rgba(255, 75, 106, 0.1)",
        backgroundColor: "#ffffff",
      },
      ".Input::placeholder": {
        color: "#9CA3AF",
      },
      ".Label": {
        fontWeight: "600",
        fontSize: "13px",
        marginBottom: "6px",
        color: "#4B5563",
      },
      ".Block": {
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        padding: "4px",
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <div className="max-w-lg mx-auto px-4 py-6 sm:py-10">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#4B5563] hover:text-[#FF4B6A] font-semibold mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Order summary — compact card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wide flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-[#FF4B6A]" />
              Order Summary
            </h2>
            <span className="text-xs bg-[#FF4B6A]/10 text-[#FF4B6A] px-2 py-0.5 rounded-full font-bold">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-[#F1F1F1] last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111827] truncate">{item.productName}</p>
                  <p className="text-xs text-[#6B7280]">
                    {item.quantity.toLocaleString("en-US")}
                    {item.username ? ` · @${item.username}` : ""}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#111827] ml-3">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-[#E5E7EB]">
            <span className="text-sm font-bold text-[#111827]">Total</span>
            <span className="text-xl font-extrabold text-[#111827]">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment form */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 shadow-sm flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#FF4B6A] animate-spin mb-3" />
            <p className="text-[#4B5563] font-semibold text-sm">Initializing payment...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-200 p-8 shadow-sm text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Error</h3>
            <p className="text-sm text-[#4B5563] mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#FF4B6A] hover:bg-[#E8435F] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Try Again
            </button>
          </div>
        ) : clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance,
            }}
          >
            <CheckoutForm
              amount={totalAmount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}
