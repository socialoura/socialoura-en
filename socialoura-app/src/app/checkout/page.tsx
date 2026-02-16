"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Loader2, ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Load Stripe publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
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

  const handlePaymentSuccess = () => {
    // Clear cart and redirect to success page
    clearCart();
    window.location.href = "/payment-success";
  };

  const handlePaymentError = (errorMsg: string) => {
    console.error("Payment error:", errorMsg);
  };

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#FF4B6A",
      colorBackground: "#ffffff",
      colorText: "#111827", // Gray-900
      colorDanger: "#ef4444",
      fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "12px",
    },
    rules: {
      ".Input": {
        border: "2px solid #e5e7eb",
        boxShadow: "none",
        padding: "12px",
      },
      ".Input:focus": {
        border: "2px solid #FF4B6A",
        boxShadow: "0 0 0 3px rgba(255, 75, 106, 0.1)",
      },
      ".Label": {
        fontWeight: "600",
        fontSize: "14px",
        marginBottom: "8px",
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#4B5563] hover:text-[#FF4B6A] font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF4B6A] rounded-2xl mb-4 shadow-lg">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mb-2 tracking-tight">
            Complete Your Order
          </h1>
          <p className="text-[#4B5563] font-medium">
            Secure payment powered by Stripe
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#111827]">
                  Order Summary
                </h2>
                <span className="text-xs bg-[#FF4B6A]/10 text-[#FF4B6A] px-2 py-1 rounded-full font-bold">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-[#E5E7EB] max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[11px] font-semibold text-[#FF4B6A] bg-[#FF4B6A]/10 px-2 py-0.5 rounded capitalize">
                            {item.platform}
                          </span>
                        </div>
                        <h3 className="font-semibold text-[#111827] text-sm mb-1">
                          {item.productName}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[#4B5563] font-medium">
                          <span>{item.quantity.toLocaleString("en-US")}</span>
                          {item.username && (
                            <span>@{item.username}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#111827]">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-[#111827]">
                  Total
                </span>
                <span className="text-2xl font-extrabold text-[#111827]">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 shadow-sm flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#FF4B6A] animate-spin mb-4" />
                <p className="text-[#4B5563] font-semibold">
                  Initializing payment...
                </p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl border border-red-200 p-8 shadow-sm">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#111827] mb-2">
                    Error
                  </h3>
                  <p className="text-[#4B5563] mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-[#FF4B6A] hover:bg-[#E8435F] text-white font-bold px-6 py-3 rounded-xl transition-all"
                  >
                    Try Again
                  </button>
                </div>
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
