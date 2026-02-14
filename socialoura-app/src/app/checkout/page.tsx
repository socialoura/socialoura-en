"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Load Stripe publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Mock order data - Replace with real data from cart/session
  const orderData = {
    amount: 2999, // 29.99 EUR in cents
    currency: "eur",
    product: "Instagram Followers - Pack 1000",
    quantity: 1000,
  };

  useEffect(() => {
    // Create PaymentIntent on component mount
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: orderData.amount,
            currency: orderData.currency,
            metadata: {
              product: orderData.product,
              quantity: orderData.quantity,
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
  }, []);

  const handlePaymentSuccess = () => {
    // Redirect to success page or show success message
    console.log("Payment successful!");
    // window.location.href = "/payment-success";
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
              <h2 className="text-lg font-black text-gray-900 mb-4">
                Récapitulatif
              </h2>
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 font-medium">
                    Produit
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {orderData.product}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 font-medium">
                    Quantité
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {orderData.quantity.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base font-black text-gray-900">
                  Total
                </span>
                <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  {(orderData.amount / 100).toFixed(2)} €
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
                  amount={orderData.amount}
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
