"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { CheckCircle, Package, ArrowRight, Mail, Clock, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.id as string;

  // Try to get order details from sessionStorage (set during checkout)
  let orderDetails: any = null;
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(`order_${orderId}`);
      if (stored) orderDetails = JSON.parse(stored);
    } catch {}
  }

  // Google Ads — page-load conversion tag (fires once on mount)
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: "AW-17893452047/E_73CPm3vPobEI_SodRC",
        value: orderDetails?.price ? Number(orderDetails.price) : 1.0,
        currency: "EUR",
        transaction_id: orderId,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mb-3">
            Order Confirmed!
          </h1>
          <p className="text-[#4B5563] text-lg mb-2">
            Thank you for your purchase. Your campaign is being processed.
          </p>
          <p className="text-sm text-[#4B5563] mb-8">
            Order ID: <span className="font-mono font-semibold text-[#111827]">{orderId}</span>
          </p>

          {/* Order Summary Card */}
          {orderDetails && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 mb-8 text-left shadow-sm">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#FF4B6A]" />
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                  <span className="text-sm text-[#4B5563]">Service</span>
                  <span className="text-sm font-semibold text-[#111827] capitalize">
                    {orderDetails.platform} {orderDetails.type}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                  <span className="text-sm text-[#4B5563]">Quantity</span>
                  <span className="text-sm font-semibold text-[#111827]">
                    {Number(orderDetails.quantity).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                  <span className="text-sm text-[#4B5563]">Target</span>
                  <span className="text-sm font-semibold text-[#111827]">
                    {orderDetails.username}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-base font-bold text-[#111827]">Total</span>
                  <span className="text-base font-bold text-[#FF4B6A]">
                    ${Number(orderDetails.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center">
              <Mail className="w-5 h-5 text-[#FF4B6A] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#111827]">Email Sent</p>
              <p className="text-xs text-[#4B5563]">Check your inbox</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center">
              <Clock className="w-5 h-5 text-[#FF4B6A] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#111827]">Processing</p>
              <p className="text-xs text-[#4B5563]">Starts within minutes</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center">
              <Shield className="w-5 h-5 text-[#FF4B6A] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#111827]">Guaranteed</p>
              <p className="text-xs text-[#4B5563]">Lifetime retention</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-[#FF4B6A] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#E8435F] transition-all shadow-sm"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
