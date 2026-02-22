"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  CheckCircle,
  Shield,
  Target,
  BarChart3,
  Check,
  Star,
  ChevronDown,
} from "lucide-react";
import CheckoutPopup, { type CheckoutPlan } from "@/components/CheckoutPopup";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// ← Configure the plan here (amount in cents)
const plan: CheckoutPlan = {
  name: "YouTube Viewers",
  amount: 5999, // $59.99
  quantity: 5000,
  platform: "youtube",
  type: "views",
};

const stats = [
  { value: "50K+", label: "Campaigns Deployed" },
  { value: "4.9★", label: "Satisfaction Score" },
  { value: "98%", label: "Retention Rate" },
];

const benefits = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Targeted Audience",
    description:
      "Our machine-learning algorithms filter viewers by interest to ensure high retention and meaningful engagement.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "100% Safe Method",
    description:
      "Fully compliant with YouTube Terms of Service. We use legitimate ad networks to promote your content.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Analytics Tracking",
    description:
      "Watch your organic growth in real-time on YouTube Studio. Full transparency, no hidden metrics.",
  },
];

const faqItems = [
  {
    question: "Is this safe for my channel?",
    answer:
      "Yes, we use legitimate advertising networks to promote your content, ensuring full compliance with platform policies. Your channel is never at risk.",
  },
  {
    question: "Are the viewers real people?",
    answer:
      "Absolutely. Our AI-powered audience matching places your video in front of genuinely interested viewers on ad networks. Every view comes from a real human.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Campaign delivery is paced organically to mirror natural growth patterns. Most campaigns complete within 1–7 days depending on the package size.",
  },
  {
    question: "Will this help with monetization?",
    answer:
      "Yes. High-retention views from real viewers send positive signals to the YouTube algorithm, improving your discoverability and watch-time metrics.",
  },
  {
    question: "Do you need my password?",
    answer:
      "Never. We only need your public video URL. Your account credentials are never requested at any stage.",
  },
];

export default function YouTubeViewersLanding() {
  const [mounted, setMounted] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);

  const handleBuyNow = () => {
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
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col overflow-x-hidden">
      {/* ═══════════════════════════════════════════════
          HERO SECTION
         ═══════════════════════════════════════════════ */}
      <section className="relative flex-1 flex flex-col items-center justify-center overflow-hidden py-16 sm:py-24 px-4">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#FF0000]/[0.06] rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] left-1/4 w-[400px] h-[400px] bg-[#FFE4EC]/70 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-[-60px] w-[300px] h-[300px] bg-[#833AB4]/[0.04] rounded-full blur-3xl" />
        </div>

        {/* Floating decorative dots */}
        <div className="absolute top-16 left-16 w-3 h-3 rounded-full bg-[#FF0000]/30 animate-float hidden sm:block" />
        <div className="absolute top-32 right-24 w-2 h-2 rounded-full bg-[#FF0000]/40 animate-float hidden sm:block" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-24 left-32 w-2.5 h-2.5 rounded-full bg-[#FF0000]/25 animate-float hidden sm:block" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-40 right-20 w-2 h-2 rounded-full bg-[#833AB4]/35 animate-float hidden sm:block" style={{ animationDelay: "0.5s" }} />

        {/* Main content */}
        <div
          className={`relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {success ? (
            <div className="flex flex-col items-center gap-5 animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#111827]">Campaign Launched!</h2>
              <p className="text-[#4B5563] text-base sm:text-lg font-medium max-w-md">
                Check your email for confirmation. Your video promotion campaign is being prepared.
              </p>
            </div>
          ) : (
            <>
              
              {/* YouTube logo with glow ring */}
              <div className="relative mb-8 group">
                <div className="absolute inset-0 rounded-[2.8rem] bg-gradient-to-br from-[#FF0000]/30 via-[#FF0000]/15 to-[#833AB4]/15 blur-2xl scale-125 animate-pulse-glow" />
                <div className="absolute -inset-2 rounded-[3rem] border-2 border-[#FF0000]/20 animate-float" />
                <div className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-[2.5rem] bg-white border border-[#F1E4EA] shadow-[0_20px_60px_-10px_rgba(255,0,0,0.2)] flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-500">
                  <Image
                    src="/icon_social/youtube.png"
                    alt="YouTube"
                    width={110}
                    height={110}
                    className="object-contain sm:w-[130px] sm:h-[130px]"
                    priority
                  />
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#111827] leading-[1.08] tracking-tight mb-4 max-w-2xl">
                Promote Your Videos to Real Viewers via{" "}
                <span className="text-[#FF0000]">AI</span>
              </h1>

              {/* Subtitle */}
              <p className="text-[#4B5563] text-base sm:text-lg font-medium leading-relaxed mb-8 max-w-xl">
                Launch compliant video campaigns on advertising networks. Gain real
                engagement and organic growth with our AI-powered audience matching.
              </p>

              {/* CTA — opens popup */}
              <button
                onClick={handleBuyNow}
                className="inline-flex items-center gap-3 bg-[#FF0000] text-white font-bold text-lg sm:text-xl px-10 py-5 rounded-full shadow-[0_8px_30px_-6px_rgba(255,0,0,0.45)] hover:shadow-[0_12px_40px_-6px_rgba(255,0,0,0.6)] hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                Launch My Growth Campaign
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Trust features */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
                {["Google Ads Compliant", "Real Human Viewers", "High Retention", "Safe & Secure"].map((f) => (
                  <span key={f} className="flex items-center gap-1.5 text-xs sm:text-sm text-[#6B7280] font-medium">
                    <Check className="w-3.5 h-3.5 text-[#FF0000]" />
                    {f}
                  </span>
                ))}
              </div>

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
      </section>

      
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
