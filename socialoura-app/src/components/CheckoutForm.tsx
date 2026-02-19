"use client";

import { useState, FormEvent } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, Lock, CheckCircle, AlertCircle } from "lucide-react";

interface CheckoutFormProps {
  amount: number;
  onSuccess?: (email: string) => void;
  onError?: (error: string) => void;
}

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function CheckoutForm({
  amount,
  onSuccess,
  onError,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const emailValid = isValidEmail(email);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!emailValid) {
      setEmailTouched(true);
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");
    setErrorMessage("");

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
          payment_method_data: {
            billing_details: {
              email: email,
            },
          },
        },
        redirect: "if_required", // Stay on page if possible
      });

      if (error) {
        // Payment failed
        setPaymentStatus("error");
        setErrorMessage(error.message || "An error occurred");
        onError?.(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment succeeded — fire Google Ads click conversion tag
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
          window.gtag("event", "conversion", {
            send_to: "AW-17893452047/E_73CPm3vPobEI_SodRC",
            value: amount / 100,
            currency: "USD",
            transaction_id: paymentIntent.id,
          });
        }
        setPaymentStatus("success");
        onSuccess?.(email);
      }
    } catch (err: any) {
      setPaymentStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred");
      onError?.(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Format amount for display
  const formattedAmount = (amount / 100).toFixed(2);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ── Billing Info ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide mb-4">
          Billing Information
        </h3>
        <div>
          <label className="block text-xs font-semibold text-[#4B5563] mb-1.5">
            Email address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder="you@email.com"
            className={`w-full h-12 px-4 rounded-xl border text-[#111827] text-[15px] font-medium outline-none transition-all bg-[#F9FAFB] ${
              emailTouched && !emailValid
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-[#E5E7EB] focus:border-[#FF4B6A] focus:ring-2 focus:ring-[#FF4B6A]/10"
            }`}
            autoComplete="email"
            required
          />
          {emailTouched && !emailValid && (
            <p className="text-xs text-red-500 mt-1 font-medium">Please enter a valid email address</p>
          )}
        </div>
      </div>

      {/* ── Payment ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide mb-4">
          Payment
        </h3>
        <div className="stripe-payment-element">
          <PaymentElement
            options={{
              layout: {
                type: "accordion",
                defaultCollapsed: false,
                radios: true,
                spacedAccordionItems: true,
              },
              paymentMethodOrder: ["apple_pay", "google_pay", "card"],
              wallets: {
                applePay: "auto",
                googlePay: "auto",
              },
            }}
          />
        </div>
      </div>

      {/* Error */}
      {paymentStatus === "error" && errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Success */}
      {paymentStatus === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700 font-medium">Payment successful! Redirecting…</p>
        </div>
      )}

      {/* Pay Now CTA */}
      <button
        type="submit"
        disabled={!stripe || isProcessing || paymentStatus === "success" || !emailValid}
        className="w-full bg-[#FF4B6A] hover:bg-[#E8435F] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed text-white font-bold text-base px-6 py-4 rounded-2xl shadow-[0_4px_14px_-3px_rgba(255,75,106,0.4)] hover:shadow-[0_6px_20px_-3px_rgba(255,75,106,0.5)] transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : paymentStatus === "success" ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Confirmed
          </>
        ) : (
          <>
            Pay Now ${formattedAmount}
            <Lock className="w-4 h-4 opacity-70" />
          </>
        )}
      </button>

      {/* Trust line */}
      <p className="text-center text-xs text-[#9CA3AF] font-medium">
        Secure payment · Powered by Stripe
      </p>
    </form>
  );
}
