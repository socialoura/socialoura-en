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
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { convertAmountCents } from "@/lib/currency";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export interface CheckoutPlan {
  productId: string;
  productName: string;
  platform: string;
  type: string;
  quantity: number;
  price: number; // USD dollars
  inputMode: "text" | "url";
  inputLabel: string;
  inputPlaceholder: string;
}

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plan: CheckoutPlan;
}

const platformIconMap: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-5 h-5" />,
  tiktok: <Music className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
};

const stripeAppearance = {
  theme: "flat" as const,
  variables: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    colorPrimary: "#7C3AED",
    colorBackground: "#F9FAFB",
    colorText: "#1E293B",
    colorTextSecondary: "#64748B",
    colorDanger: "#EF4444",
    fontSizeBase: "15px",
    spacingUnit: "4px",
    borderRadius: "12px",
    fontWeightNormal: "500",
  },
  rules: {
    ".Tab": {
      border: "1px solid #E2E8F0",
      borderRadius: "12px",
      padding: "12px 16px",
      boxShadow: "none",
      backgroundColor: "#FFFFFF",
    },
    ".Tab--selected": {
      border: "2px solid #7C3AED",
      boxShadow: "0 0 0 1px #7C3AED",
      backgroundColor: "#FAFAFE",
    },
    ".Tab:hover": {
      border: "1px solid #CBD5E1",
    },
    ".Input": {
      border: "1px solid #E2E8F0",
      borderRadius: "12px",
      boxShadow: "none",
      padding: "14px 16px",
      fontSize: "15px",
      backgroundColor: "#F9FAFB",
      fontWeight: "500",
    },
    ".Input:focus": {
      border: "1px solid #7C3AED",
      boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.08)",
      backgroundColor: "#FFFFFF",
    },
    ".Label": {
      fontWeight: "600",
      fontSize: "13px",
      marginBottom: "8px",
      color: "#475569",
      letterSpacing: "0.01em",
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
  localPrice,
  currencySymbol,
  currencyCode,
  countryCode,
}: {
  plan: CheckoutPlan;
  email: string;
  username: string;
  onBack: () => void;
  onSuccess: () => void;
  localPrice: number;
  currencySymbol: string;
  currencyCode: string;
  countryCode: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
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
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-17964092485/QdtbCJ2R4vwbEMWY-fVC",
          value: localPrice / 100,
          currency: currencyCode.toUpperCase(),
          transaction_id: paymentIntent.id,
        });
      }

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
            price: localPrice / 100,
            country: countryCode,
          }),
        });
      } catch {
        // Non-blocking
      }

      setStatus("success");
      setTimeout(onSuccess, 2500);
    }

    setIsProcessing(false);
  };

  /* ── Success state ── */
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-5 py-12 px-6">
        <div className="relative">
          <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-black text-slate-800 mb-2">Order Confirmed!</h3>
          <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
            Check your inbox at <span className="font-semibold text-slate-700">{email}</span>. Your campaign starts shortly.
          </p>
        </div>
        <button
          onClick={onSuccess}
          className="mt-2 px-6 py-2.5 rounded-full text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  /* ── Payment form ── */
  return (
    <form onSubmit={handlePay} className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Order recap card */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100/80 rounded-2xl p-4 flex items-center gap-3 border border-slate-200/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
            {platformIconMap[plan.platform] || <ShoppingBag className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{plan.productName}</p>
            <p className="text-xs text-slate-500 truncate">
              {plan.quantity.toLocaleString()} {plan.type} · {username}
            </p>
          </div>
          <span className="text-lg font-extrabold text-slate-800 ml-2 whitespace-nowrap">
            {currencySymbol}{(localPrice / 100).toFixed(2)}
          </span>
        </div>

        {/* Stripe Payment Element */}
        <div>
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
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Sticky pay button */}
      <div className="border-t border-slate-100 px-4 sm:px-6 py-4 bg-white shrink-0">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-2xl shadow-[0_4px_20px_-4px_rgba(124,58,237,0.4)] hover:shadow-[0_6px_24px_-4px_rgba(124,58,237,0.5)] transition-all flex items-center justify-center gap-2.5"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 opacity-80" />
              Pay {currencySymbol}{(localPrice / 100).toFixed(2)}
            </>
          )}
        </button>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </button>
          <span className="text-slate-200">|</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            SSL Encrypted
          </span>
          <span className="text-slate-200">|</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            Stripe
          </span>
        </div>
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════════
   Main Drawer Component
   ═══════════════════════════════════════════════════ */
export default function NewCheckoutDrawer({ isOpen, onClose, plan }: CheckoutDrawerProps) {
  const geo = useGeoLocation();
  const [step, setStep] = useState<"info" | "payment">("info");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [intentError, setIntentError] = useState("");
  const [done, setDone] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const usernameValid = username.trim().length > 0;

  const localPriceCents = convertAmountCents(Math.round(plan.price * 100), geo.currency);

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
      setStep("info");
      setUsername("");
      setEmail("");
      setEmailTouched(false);
      setClientSecret(null);
      setIntentError("");
      setDone(false);
    }
  }, [isOpen]);

  // Create PaymentIntent
  const goToPayment = useCallback(async () => {
    if (!emailValid || !usernameValid) return;
    setLoadingIntent(true);
    setIntentError("");
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: localPriceCents, currency: geo.currency.code }),
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
  }, [emailValid, usernameValid, localPriceCents, geo.currency.code]);

  const handleSuccess = () => {
    setDone(true);
    setTimeout(onClose, 3500);
  };

  if (!isOpen) return null;

  const platformIcon = platformIconMap[plan.platform] || <Instagram className="w-5 h-5" />;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ animation: "checkoutFadeIn 0.2s ease-out" }}
        onClick={onClose}
      />

      {/* Drawer — full bottom on mobile, centered modal on desktop */}
      <div className="absolute inset-0 flex items-end sm:items-center sm:justify-center pointer-events-none">
        <div
          className="pointer-events-auto w-full sm:max-w-[460px] bg-white rounded-t-[28px] sm:rounded-[24px] flex flex-col overflow-hidden shadow-2xl"
          style={{
            height: "min(92dvh, 740px)",
            animation: "checkoutSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Drag handle (mobile) */}
          <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-slate-200" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                {platformIcon}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-tight">Secure Checkout</p>
                <p className="text-xs text-slate-400">
                  {plan.quantity.toLocaleString()} {plan.type} · {geo.currency.symbol}{(localPriceCents / 100).toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Progress bar */}
          {!done && (
            <div className="px-4 sm:px-6 pt-3 pb-1 shrink-0">
              <div className="flex items-center gap-3">
                {/* Step 1 */}
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === "info"
                      ? "bg-gradient-to-br from-rose-500 to-purple-600 text-white shadow-md"
                      : "bg-green-500 text-white"
                  }`}>
                    {step === "payment" ? <CheckCircle className="w-3.5 h-3.5" /> : "1"}
                  </div>
                  <span className={`text-xs font-semibold ${step === "info" ? "text-slate-800" : "text-green-600"}`}>
                    Info
                  </span>
                </div>

                {/* Connector */}
                <div className="flex-1 h-0.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: step === "payment" ? "100%" : "0%" }}
                  />
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === "payment"
                      ? "bg-gradient-to-br from-rose-500 to-purple-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    2
                  </div>
                  <span className={`text-xs font-semibold ${step === "payment" ? "text-slate-800" : "text-slate-400"}`}>
                    Payment
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 1: Info ── */}
          {step === "info" && (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
                {/* Product recap */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100/80 rounded-2xl p-4 flex items-center gap-3 border border-slate-200/60">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                    {platformIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{plan.productName}</p>
                    <p className="text-xs text-slate-500">{plan.quantity.toLocaleString()} {plan.type}</p>
                  </div>
                  <span className="text-lg font-extrabold text-slate-800 whitespace-nowrap">
                    {geo.currency.symbol}{(localPriceCents / 100).toFixed(2)}
                  </span>
                </div>

                {/* Username / URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">
                    {plan.inputLabel} *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      {platformIcon}
                    </div>
                    <input
                      type={plan.inputMode === "url" ? "url" : "text"}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={plan.inputPlaceholder}
                      autoFocus
                      autoComplete="off"
                      className="w-full h-[52px] pl-11 pr-4 rounded-xl border border-slate-200 text-slate-800 text-[15px] font-medium bg-slate-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    {plan.inputMode === "url" ? "Public link only — no password needed" : "Public username only — no password needed"}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="you@email.com"
                    autoComplete="email"
                    className={`w-full h-[52px] px-4 rounded-xl border text-slate-800 text-[15px] font-medium bg-slate-50 outline-none transition-all placeholder:text-slate-300 ${
                      emailTouched && !emailValid
                        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 focus:bg-white"
                    }`}
                  />
                  {emailTouched && !emailValid && (
                    <p className="text-xs text-red-500 mt-1 font-medium">Please enter a valid email</p>
                  )}
                </div>

                {/* Intent error */}
                {intentError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 font-medium">{intentError}</p>
                  </div>
                )}

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 pt-1">
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Shield className="w-3 h-3" />
                    SSL Secure
                  </span>
                  <span className="text-slate-200">·</span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Lock className="w-3 h-3" />
                    No password required
                  </span>
                </div>
              </div>

              {/* Sticky CTA */}
              <div className="border-t border-slate-100 px-4 sm:px-6 py-4 bg-white shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEmailTouched(true);
                    if (emailValid && usernameValid) goToPayment();
                  }}
                  disabled={loadingIntent || !usernameValid || !emailValid}
                  className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-2xl shadow-[0_4px_20px_-4px_rgba(124,58,237,0.4)] hover:shadow-[0_6px_24px_-4px_rgba(124,58,237,0.5)] transition-all flex items-center justify-center gap-2.5"
                >
                  {loadingIntent ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading…
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight className="w-4 h-4" />
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
                onBack={() => setStep("info")}
                onSuccess={handleSuccess}
                localPrice={localPriceCents}
                currencySymbol={geo.currency.symbol}
                currencyCode={geo.currency.code}
                countryCode={geo.country}
              />
            </Elements>
          )}

          {/* Loading payment intent */}
          {step === "payment" && !clientSecret && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <p className="text-sm text-slate-400 font-medium">Preparing payment…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
