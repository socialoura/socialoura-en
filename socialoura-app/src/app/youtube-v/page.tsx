"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle,
  Check,
} from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const stats = [
  { value: "50K+", label: "Campaigns Deployed" },
  { value: "4.9★", label: "Satisfaction Score" },
  { value: "98%", label: "Retention Rate" },
];

export default function YouTubeViewersLanding() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleBuyNow = () => {
    router.push("/products/youtube-views");
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

          {/* CTA — redirects to product page */}
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
        </div>
      </section>
    </div>
  );
}
