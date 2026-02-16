"use client";

import { useState, FormEvent } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, Lock, CheckCircle, AlertCircle } from "lucide-react";

interface CheckoutFormProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
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
        },
        redirect: "if_required", // Stay on page if possible
      });

      if (error) {
        // Payment failed
        setPaymentStatus("error");
        setErrorMessage(error.message || "An error occurred");
        onError?.(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment succeeded
        setPaymentStatus("success");
        onSuccess?.();
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element Container */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-[#FF4B6A]" />
          <h3 className="text-lg font-bold text-[#111827]">
            Secure Payment
          </h3>
        </div>

        {/* Stripe Payment Element */}
        <div className="stripe-payment-element">
          <PaymentElement
            options={{
              layout: "tabs",
              paymentMethodOrder: ["card", "apple_pay", "google_pay"],
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {paymentStatus === "error" && errorMessage && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 animate-scale-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-900 mb-1">Payment Error</h4>
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {paymentStatus === "success" && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 animate-scale-in">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-green-900 mb-1">Payment Successful!</h4>
              <p className="text-sm text-green-700">
                Your order has been confirmed
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing || paymentStatus === "success"}
        className="w-full bg-[#FF4B6A] hover:bg-[#E8435F] disabled:bg-[#E5E7EB] disabled:text-[#4B5563] disabled:cursor-not-allowed text-white font-bold px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 uppercase tracking-wide"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : paymentStatus === "success" ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Payment Confirmed
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pay ${formattedAmount}
          </>
        )}
      </button>

      {/* Security Badges */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-[#4B5563]">
          <Lock className="w-3.5 h-3.5" />
          <span className="font-semibold">SSL Secure Payment</span>
        </div>
        <div className="w-1 h-1 bg-[#E5E7EB] rounded-full" />
        <div className="flex items-center gap-2 text-xs text-[#4B5563]">
          <CheckCircle className="w-3.5 h-3.5" />
          <span className="font-semibold">Powered by Stripe</span>
        </div>
      </div>
    </form>
  );
}
