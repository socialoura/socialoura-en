"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import CheckoutPopup, { type CheckoutPlan } from "@/components/CheckoutPopup";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// ← Configure the plan here (amount in cents)
const plan: CheckoutPlan = {
  name: "Instagram Followers",
  amount: 4499, // $44.99
  quantity: 1000,
  platform: "instagram",
  type: "followers",
};

const stats = [
  { value: "50K+", label: "Campaigns Deployed" },
  { value: "4.9★", label: "Satisfaction Score" },
  { value: "98%", label: "Retention Rate" },
];

export default function InstagramFollowersLanding() {
  const [mounted, setMounted] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleBuyNow = () => {
    // Fire CTA click conversion
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-17893452047/Nv9FCLrkvPobEI_SodRC",
        value: plan.amount / 100,
        currency: "USD",
      });
    }
    setCheckoutOpen(true);
  };

  const handleSuccess = () => {
    setCheckoutOpen(false);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF7FA] flex flex-col items-center justify-center relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#FF4B6A]/[0.07] rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] left-1/4 w-[400px] h-[400px] bg-[#FFE4EC]/70 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-[-60px] w-[300px] h-[300px] bg-[#E1306C]/[0.05] rounded-full blur-3xl" />
      </div>

      {/* Floating decorative dots */}
      <div className="absolute top-16 left-16 w-3 h-3 rounded-full bg-[#FF4B6A]/30 animate-float hidden sm:block" />
      <div className="absolute top-32 right-24 w-2 h-2 rounded-full bg-[#E1306C]/40 animate-float hidden sm:block" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-24 left-32 w-2.5 h-2.5 rounded-full bg-[#FF4B6A]/25 animate-float hidden sm:block" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-40 right-20 w-2 h-2 rounded-full bg-[#E1306C]/35 animate-float hidden sm:block" style={{ animationDelay: "0.5s" }} />

      {/* Main content */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-4 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {success ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-5 animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827]">Order Confirmed!</h2>
            <p className="text-[#4B5563] text-base sm:text-lg font-medium max-w-md">
              Check your email for confirmation. Your growth campaign is being prepared.
            </p>
          </div>
        ) : (
          /* ── Normal landing ── */
          <>
            {/* AI badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFE4EC] rounded-full mb-8">
              <Sparkles className="w-3.5 h-3.5 text-[#FF4B6A]" />
              <span className="text-xs font-bold text-[#FF4B6A] uppercase tracking-widest">
                AI-Driven Audience Targeting
              </span>
            </div>

            {/* Instagram logo with glow ring */}
            <div className="relative mb-8 group">
              <div className="absolute inset-0 rounded-[2.8rem] bg-gradient-to-br from-[#FF4B6A]/30 via-[#E1306C]/20 to-[#833AB4]/20 blur-2xl scale-125 animate-pulse-glow" />
              <div className="absolute -inset-2 rounded-[3rem] border-2 border-[#FF4B6A]/20 animate-float" />
              <div className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-[2.5rem] bg-white border border-[#F1E4EA] shadow-[0_20px_60px_-10px_rgba(255,75,106,0.25)] flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-500">
                <Image
                  src="/icon_social/instagram.png"
                  alt="Instagram"
                  width={110}
                  height={110}
                  className="object-contain sm:w-[130px] sm:h-[130px]"
                  priority
                />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#111827] leading-[1.08] tracking-tight mb-4 max-w-2xl">
              Grow Your Instagram Presence with{" "}
              <span className="text-[#FF4B6A]">AI-Powered</span> Precision
            </h1>

            {/* Subtitle */}
            <p className="text-[#4B5563] text-base sm:text-lg font-medium leading-relaxed mb-8 max-w-xl">
              Our SocialNovaly™ Engine identifies high-affinity audience clusters and
              delivers engagement with organic-style pacing — safe, data-backed, and
              policy-compliant.
            </p>

            {/* CTA — opens popup */}
            <button
              onClick={handleBuyNow}
              className="inline-flex items-center gap-3 bg-[#FF4B6A] text-white font-bold text-lg sm:text-xl px-10 py-5 rounded-full shadow-[0_8px_30px_-6px_rgba(255,75,106,0.5)] hover:shadow-[0_12px_40px_-6px_rgba(255,75,106,0.65)] hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              Launch My Growth Campaign
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Stats strip */}
            <div className="mt-14 flex items-center justify-center gap-8 sm:gap-16">
              {stats.map((s, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#111827]">{s.value}</div>
                  <div className="text-xs text-[#6B7280] font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Checkout popup */}
      <CheckoutPopup
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        plan={plan}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
