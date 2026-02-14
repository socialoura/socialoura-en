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
            currency: "eur",
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
      colorPrimary: "#9333ea", // Purple-600
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
        border: "2px solid #9333ea",
        boxShadow: "0 0 0 3px rgba(147, 51, 234, 0.1)",
      },
      ".Label": {
        fontWeight: "600",
        fontSize: "14px",
        marginBottom: "8px",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl mb-4 shadow-lg">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 tracking-tight">
            Finaliser votre commande
          </h1>
          <p className="text-gray-600 font-medium">
            Paiement sécurisé par Stripe
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-gray-900">
                  Récapitulatif
                </h2>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">
                  {items.length} {items.length > 1 ? "articles" : "article"}
                </span>
              </div>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-200">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 px-2 py-0.5 rounded-full">
                            {item.platform}
                          </span>
                        </div>
                        <h3 className="font-black text-gray-900 text-sm mb-1">
                          {item.productName}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold">
                          <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                            {item.quantity.toLocaleString()}
                          </span>
                          {item.username && (
                            <span className="text-gray-500">@{item.username}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                          {item.price.toFixed(2)}€
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-base font-black text-gray-900">
                  Total
                </span>
                <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  {totalPrice.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 shadow-sm flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-gray-600 font-semibold">
                  Initialisation du paiement...
                </p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl border-2 border-red-200 p-8 shadow-sm">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    Erreur
                  </h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                  >
                    Réessayer
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
