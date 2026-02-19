"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { X, Loader2, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useGeoLocation } from "@/hooks/useGeoLocation";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export interface CheckoutPlan {
  name: string;
  amount: number; // cents
  quantity: number;
  platform: string;
  type: string;
}

interface CheckoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  plan: CheckoutPlan;
  onSuccess?: (orderId: string) => void;
}

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
    },
    ".Tab--selected": {
      border: "2px solid #FF4B6A",
      boxShadow: "none",
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
  },
};

/* ─── Inner form (must live inside <Elements>) ─── */
function PopupForm({
  plan,
  onClose,
  onSuccess,
}: {
  plan: CheckoutPlan;
  onClose: () => void;
  onSuccess?: (orderId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const country = useGeoLocation();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formattedAmount = (plan.amount / 100).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!emailValid) {
      setEmailTouched(true);
      return;
    }

    setIsProcessing(true);
    setStatus("processing");
    setErrorMsg("");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/if`,
          payment_method_data: {
            billing_details: { email },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        setStatus("error");
        setErrorMsg(error.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        // Google Ads purchase conversion
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "conversion", {
            send_to: "AW-17893452047/E_73CPm3vPobEI_SodRC",
            value: plan.amount / 100,
            currency: "USD",
            transaction_id: paymentIntent.id,
          });
        }

        // Create order → DB + Discord notification
        try {
          const res = await fetch("/api/orders/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              username,
              platform: plan.platform,
              type: plan.type,
              quantity: plan.quantity,
              price: plan.amount / 100,
              country,
            }),
          });
          const data = await res.json();
          setStatus("success");
          setTimeout(() => onSuccess?.(data.orderId || ""), 2200);
        } catch {
          setStatus("success");
          setTimeout(() => onSuccess?.(""), 2200);
        }
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-popup flex flex-col flex-1 overflow-hidden">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-4 pb-4 space-y-4">
        {/* Product summary */}
        <div className="bg-[#F9FAFB] rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#111827]">{plan.name}</p>
            <p className="text-xs text-[#6B7280]">{plan.quantity.toLocaleString()} {plan.type}</p>
          </div>
          <span className="text-lg font-extrabold text-[#111827]">${formattedAmount}</span>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#4B5563] mb-1.5">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder="you@email.com"
            className={`w-full h-14 px-4 rounded-xl border text-[#111827] text-[15px] font-medium bg-[#F9FAFB] ${
              emailTouched && !emailValid
                ? "border-red-400 focus:border-red-500"
                : "border-[#E5E7EB] focus:border-[#FF4B6A]"
            }`}
            autoComplete="email"
            required
          />
          {emailTouched && !emailValid && (
            <p className="text-xs text-red-500 mt-1 font-medium">Valid email required</p>
          )}
        </div>

        {/* IG Username */}
        <div>
          <label className="block text-xs font-semibold text-[#4B5563] mb-1.5">Instagram Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@yourusername"
            className="w-full h-14 px-4 rounded-xl border border-[#E5E7EB] text-[#111827] text-[15px] font-medium bg-[#F9FAFB] focus:border-[#FF4B6A]"
            autoComplete="off"
          />
        </div>

        {/* Stripe Payment Element */}
        <div>
          <label className="block text-xs font-semibold text-[#4B5563] mb-2">Payment</label>
          <PaymentElement
            options={{
              layout: {
                type: "accordion",
                defaultCollapsed: false,
                radios: true,
                spacedAccordionItems: true,
              },
              paymentMethodOrder: ["apple_pay", "google_pay", "card"],
              wallets: { applePay: "auto", googlePay: "auto" },
            }}
          />
        </div>

        {/* Error */}
        {status === "error" && errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <p className="font-bold text-[#111827]">Payment Successful!</p>
            <p className="text-sm text-[#4B5563]">Your campaign is being prepared.</p>
          </div>
        )}
      </div>

      {/* Sticky footer — Pay button */}
      {status !== "success" && (
        <div className="border-t border-[#E5E7EB] px-4 sm:px-6 py-4 bg-white">
          <button
            type="submit"
            disabled={!stripe || isProcessing || !emailValid}
            className="w-full bg-[#FF4B6A] hover:bg-[#E8435F] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-2xl shadow-[0_4px_14px_-3px_rgba(255,75,106,0.4)] hover:shadow-[0_6px_20px_-3px_rgba(255,75,106,0.5)] transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay ${formattedAmount}
                <Lock className="w-4 h-4 opacity-70" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-[#9CA3AF] font-medium mt-2">
            Secure payment · Powered by Stripe
          </p>
        </div>
      )}
    </form>
  );
}

/* ─── Outer wrapper: manages PaymentIntent + Elements ─── */
export default function CheckoutPopup({
  isOpen,
  onClose,
  plan,
  onSuccess,
}: CheckoutPopupProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Create PaymentIntent when popup opens
  useEffect(() => {
    if (!isOpen) {
      setClientSecret(null);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: plan.amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else setError(data.error || "Failed to initialize payment");
      })
      .catch(() => setError("Connection failed"))
      .finally(() => setLoading(false));
  }, [isOpen, plan.amount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        style={{ animation: "checkoutFadeIn 0.2s ease-out" }}
      />

      {/* Modal positioning wrapper */}
      <div className="absolute inset-0 flex items-end sm:items-center sm:justify-center sm:p-6">
        {/* Modal card */}
        <div
          className="w-full sm:max-w-md h-[95dvh] sm:h-auto sm:max-h-[90dvh] bg-white rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          style={{ animation: "checkoutSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#E5E7EB] shrink-0">
            <h2 className="text-base font-bold text-[#111827]">Checkout</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center"
            >
              <X className="w-4 h-4 text-[#4B5563]" />
            </button>
          </div>

          {/* Body */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#FF4B6A] animate-spin" />
              <p className="text-sm text-[#4B5563] font-medium">Loading payment…</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <p className="text-sm text-red-600 font-medium text-center">{error}</p>
              <button
                onClick={onClose}
                className="text-sm text-[#FF4B6A] font-semibold hover:underline"
              >
                Close
              </button>
            </div>
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance }}
            >
              <PopupForm plan={plan} onClose={onClose} onSuccess={onSuccess} />
            </Elements>
          ) : null}
        </div>
      </div>
    </div>
  );
}
