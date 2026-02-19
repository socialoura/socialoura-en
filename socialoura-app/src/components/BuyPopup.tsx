"use client";

import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  X,
  Loader2,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Instagram,
  Youtube,
  Facebook,
  Music,
  Shield,
} from "lucide-react";
import { useGeoLocation } from "@/hooks/useGeoLocation";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export interface BuyPlan {
  productId: string;
  productName: string;
  platform: string;
  type: string;
  quantity: number;
  price: number; // dollars
  inputMode: "text" | "url";
  inputLabel: string;
  inputPlaceholder: string;
}

interface BuyPopupProps {
  isOpen: boolean;
  onClose: () => void;
  plan: BuyPlan;
}

const platformIconMap: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-5 h-5" />,
  tiktok: <Music className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
};

const stripeAppearance = {
  theme: "stripe" as const,
  variables: {
    colorPrimary: "#FF4B6A",
    colorBackground: "#ffffff",
    colorText: "#111827",
    colorTextSecondary: "#6B7280",
    colorDanger: "#ef4444",
    fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
    fontSizeBase: "15px",
    spacingUnit: "4px",
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
      padding: "13px 16px",
      fontSize: "15px",
      backgroundColor: "#F9FAFB",
    },
    ".Input:focus": {
      border: "1px solid #FF4B6A",
      boxShadow: "0 0 0 3px rgba(255, 75, 106, 0.1)",
      backgroundColor: "#ffffff",
    },
    ".Label": {
      fontWeight: "600",
      fontSize: "13px",
      marginBottom: "6px",
      color: "#4B5563",
    },
  },
};

/* ─── Step 2: Payment form (inside <Elements>) ─── */
function PaymentStep({
  plan,
  email,
  username,
  onBack,
  onSuccess,
}: {
  plan: BuyPlan;
  email: string;
  username: string;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const country = useGeoLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMsg("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${window.location.pathname}`,
        payment_method_data: { billing_details: { email } },
      },
      redirect: "if_required",
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message || "Payment failed");
      setIsProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      // Google Ads purchase conversion
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-17893452047/E_73CPm3vPobEI_SodRC",
          value: plan.price,
          currency: "USD",
          transaction_id: paymentIntent.id,
        });
      }

      // Save order + Discord notification
      try {
        await fetch("/api/orders/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            username,
            platform: plan.platform,
            type: plan.type,
            quantity: plan.quantity,
            price: plan.price,
            country,
          }),
        });
      } catch {
        // Non-blocking
      }

      setStatus("success");
      setTimeout(onSuccess, 2000);
    }

    setIsProcessing(false);
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 py-12 px-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-black text-[#111827]">Order Confirmed!</h3>
        <p className="text-sm text-[#4B5563] text-center max-w-xs">
          Check your inbox at <span className="font-semibold text-[#111827]">{email}</span>. Your campaign starts shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handlePay} className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4">
        {/* Order recap */}
        <div className="bg-[#F9FAFB] rounded-xl p-3 sm:p-3.5 flex items-center justify-between border border-[#E5E7EB]">
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#111827] truncate">{plan.productName}</p>
            <p className="text-xs text-[#6B7280] truncate">
              {plan.quantity.toLocaleString()} {plan.type}
              {username ? ` · ${username}` : ""}
            </p>
          </div>
          <span className="text-base sm:text-lg font-extrabold text-[#111827] ml-2">${plan.price.toFixed(2)}</span>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#4B5563] mb-1">
            Email *
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              readOnly
              className="w-full h-12 px-3 sm:px-4 rounded-xl border border-[#E5E7EB] text-[#111827] text-[15px] font-medium bg-[#F9FAFB] cursor-default"
            />
          </div>
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
      </div>

      {/* Sticky footer */}
      <div className="border-t border-[#E5E7EB] px-3 sm:px-6 py-3 sm:py-4 bg-white shrink-0">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-[#FF4B6A] hover:bg-[#E8435F] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base py-3.5 sm:py-4 rounded-2xl shadow-[0_4px_14px_-3px_rgba(255,75,106,0.4)] hover:shadow-[0_6px_20px_-3px_rgba(255,75,106,0.5)] transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              <span className="hidden sm:inline">Processing…</span>
              <span className="sm:hidden">Processing</span>
            </>
          ) : (
            <>
              Pay ${plan.price.toFixed(2)}
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70" />
            </>
          )}
        </button>
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2">
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-[#6B7280] hover:text-[#111827] font-medium flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Back</span>
            <span className="sm:hidden">←</span>
          </button>
          <span className="text-[#E5E7EB]">·</span>
          <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span className="hidden sm:inline">SSL Secure · Stripe</span>
            <span className="sm:hidden">Secure</span>
          </span>
        </div>
      </div>
    </form>
  );
}

/* ─── Main BuyPopup ─── */
export default function BuyPopup({ isOpen, onClose, plan }: BuyPopupProps) {
  // step: "username" | "payment"
  const [step, setStep] = useState<"username" | "payment">("username");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [intentError, setIntentError] = useState("");
  const [done, setDone] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const usernameValid = username.trim().length > 0;

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep("username");
      setUsername("");
      setEmail("");
      setEmailTouched(false);
      setClientSecret(null);
      setIntentError("");
      setDone(false);
    }
  }, [isOpen]);

  // Create PaymentIntent when moving to payment step
  const goToPayment = useCallback(async () => {
    if (!emailValid || !usernameValid) return;
    setLoadingIntent(true);
    setIntentError("");
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(plan.price * 100) }),
      });
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStep("payment");
      } else {
        setIntentError(data.error || "Failed to initialize payment");
      }
    } catch {
      setIntentError("Connection failed. Please try again.");
    } finally {
      setLoadingIntent(false);
    }
  }, [emailValid, usernameValid, plan.price]);

  const handleSuccess = () => {
    setDone(true);
    setTimeout(onClose, 3000);
  };

  if (!isOpen) return null;

  const platformIcon = platformIconMap[plan.platform] || <Instagram className="w-5 h-5" />;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
        style={{ animation: "checkoutFadeIn 0.2s ease-out" }}
        onClick={onClose}
      />

      {/* Sheet — bottom on mobile, centered on desktop */}
      <div className="absolute inset-0 flex items-end sm:items-center sm:justify-center sm:p-6 pointer-events-none">
        <div
          className="pointer-events-auto w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl"
          style={{
            height: "min(90dvh, 720px)",
            animation: "checkoutSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Drag handle (mobile) */}
          <div className="sm:hidden flex justify-center pt-2 pb-1 shrink-0">
            <div className="w-8 h-1 rounded-full bg-[#E5E7EB]" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 border-b border-[#F3F4F6] shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FF4B6A]/10 flex items-center justify-center text-[#FF4B6A]">
                {platformIcon}
              </div>
              <div>
                <p className="text-sm font-bold text-[#111827] leading-tight">{plan.productName}</p>
                <p className="text-xs text-[#6B7280]">
                  {plan.quantity.toLocaleString()} {plan.type} · ${plan.price.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5 text-[#4B5563]" />
            </button>
          </div>

          {/* Step indicator */}
          {!done && (
            <div className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 shrink-0">
              <div className={`flex items-center gap-1 text-xs font-semibold ${step === "username" ? "text-[#FF4B6A]" : "text-[#9CA3AF]"}`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${step === "username" ? "bg-[#FF4B6A] text-white" : "bg-[#E5E7EB] text-[#6B7280]"}`}>
                  {step === "payment" ? <CheckCircle className="w-2.5 h-2.5" /> : "1"}
                </div>
                <span className="hidden sm:inline">Your info</span>
              </div>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <div className={`flex items-center gap-1 text-xs font-semibold ${step === "payment" ? "text-[#FF4B6A]" : "text-[#9CA3AF]"}`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${step === "payment" ? "bg-[#FF4B6A] text-white" : "bg-[#E5E7EB] text-[#6B7280]"}`}>
                  2
                </div>
                <span className="hidden sm:inline">Payment</span>
              </div>
            </div>
          )}

          {/* ── STEP 1: Username + Email ── */}
          {step === "username" && (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-2 space-y-3 sm:space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-[#4B5563] mb-1">
                    {plan.inputLabel} *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                      {platformIcon}
                    </div>
                    <input
                      type={plan.inputMode === "url" ? "url" : "text"}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={plan.inputPlaceholder}
                      autoFocus
                      autoComplete="off"
                      className="w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-3 sm:pr-4 rounded-xl border border-[#E5E7EB] text-[#111827] text-[15px] font-medium bg-[#F9FAFB] focus:border-[#FF4B6A] focus:ring-2 focus:ring-[#FF4B6A]/10 outline-none transition-all"
                    />
                  </div>
                  <p className="text-xs text-[#9CA3AF] mt-1 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span className="hidden sm:inline">
                      {plan.inputMode === "url" ? "Public link only — no password needed" : "Public username only — no password needed"}
                    </span>
                    <span className="sm:hidden">
                      {plan.inputMode === "url" ? "No password needed" : "No password needed"}
                    </span>
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#4B5563] mb-1">
                    Email * <span className="font-normal text-[#9CA3AF] hidden sm:inline">(for order confirmation)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="you@email.com"
                    autoComplete="email"
                    className={`w-full h-12 sm:h-14 px-3 sm:px-4 rounded-xl border text-[#111827] text-[15px] font-medium bg-[#F9FAFB] outline-none transition-all ${
                      emailTouched && !emailValid
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-[#E5E7EB] focus:border-[#FF4B6A] focus:ring-2 focus:ring-[#FF4B6A]/10"
                    }`}
                  />
                  {emailTouched && !emailValid && (
                    <p className="text-xs text-red-500 mt-1 font-medium">Valid email required</p>
                  )}
                </div>

                {/* Intent error */}
                {intentError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-medium">{intentError}</p>
                  </div>
                )}

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 pt-1">
                  <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                    <Shield className="w-3 h-3" />
                    <span className="hidden sm:inline">SSL Secure</span>
                    <span className="sm:hidden">Secure</span>
                  </span>
                  <span className="text-[#E5E7EB]">·</span>
                  <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                    <Lock className="w-3 h-3" />
                    <span className="hidden sm:inline">No password required</span>
                    <span className="sm:hidden">No password</span>
                  </span>
                </div>
              </div>

              {/* Sticky CTA */}
              <div className="border-t border-[#E5E7EB] px-3 sm:px-6 py-3 sm:py-4 bg-white shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEmailTouched(true);
                    if (emailValid && usernameValid) goToPayment();
                  }}
                  disabled={loadingIntent || !usernameValid || !emailValid}
                  className="w-full bg-[#FF4B6A] hover:bg-[#E8435F] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base py-3.5 sm:py-4 rounded-2xl shadow-[0_4px_14px_-3px_rgba(255,75,106,0.4)] hover:shadow-[0_6px_20px_-3px_rgba(255,75,106,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  {loadingIntent ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span className="hidden sm:inline">Loading…</span>
                      <span className="sm:hidden">Loading</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Continue to Payment</span>
                      <span className="sm:hidden">Continue</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === "payment" && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
              <PaymentStep
                plan={plan}
                email={email}
                username={username}
                onBack={() => setStep("username")}
                onSuccess={handleSuccess}
              />
            </Elements>
          )}

          {/* Loading payment intent */}
          {step === "payment" && !clientSecret && (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#FF4B6A] animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
