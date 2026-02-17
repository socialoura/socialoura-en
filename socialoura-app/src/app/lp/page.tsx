"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Check, Shield, Zap, Users, TrendingUp, ArrowRight } from "lucide-react";

const platforms = [
  { name: "Instagram", image: "/icon_social/instagram.png" },
  { name: "TikTok", image: "/icon_social/tiktok.webp" },
  { name: "YouTube", image: "/icon_social/youtube.png" },
  { name: "Facebook", image: "/icon_social/facebook.png" },
];

const benefits = [
  {
    icon: <Check className="w-5 h-5" />,
    title: "No Password Required",
    description: "We never ask for your login credentials. Your account stays 100% secure at all times.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Real-Time Tracking Dashboard",
    description: "Monitor your campaign progress in real time with our transparent tracking system.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "24/7 Human Support",
    description: "Our dedicated support team is available around the clock to assist you with anything.",
  },
];

const stats = [
  { value: "+100M", label: "Interactions Delivered" },
  { value: "4.9⭐", label: "Average Rating" },
  { value: "78K+", label: "Campaigns Launched" },
];

const testimonials = [
  {
    quote: "I started seeing results on day one. Totally worth it!",
    author: "Sarah K.",
    role: "Influencer",
  },
  {
    quote: "Safe, transparent, and super easy to use. My go-to growth service.",
    author: "James R.",
    role: "Content Creator",
  },
  {
    quote: "Professional service with real results. My visibility improved fast.",
    author: "Emily D.",
    role: "Brand Owner",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* HERO — Full impact, centered */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF7FA] via-white to-[#F9FAFB]">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#FF4B6A]/[0.06] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#FFE4EC]/60 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFE4EC] rounded-full mb-6">
            <Shield className="w-3.5 h-3.5 text-[#FF4B6A]" />
            <span className="text-xs font-bold text-[#FF4B6A] uppercase tracking-wide">Safe & Policy-Compliant</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#111827] leading-[1.08] mb-6 tracking-tight">
            Grow Your Social Presence
            <br />
            With{" "}
            <span className="text-[#FF4B6A]">AI-Powered</span> Growth Tools
          </h1>

          <p className="text-[#4B5563] text-lg sm:text-xl mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            Promote TikTok, Instagram, YouTube, and more with safe, transparent
            engagement services trusted by creators and brands.
          </p>

          {/* Platform icons with halo */}
          <div className="flex items-center justify-center gap-5 sm:gap-8 mb-10">
            {platforms.map((p) => (
              <div key={p.name} className="relative group">
                <div className="absolute inset-0 bg-[#FF4B6A]/15 rounded-2xl blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-[#E5E7EB] shadow-md flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
                  <Image src={p.image} alt={p.name} width={48} height={48} className="object-contain p-1" />
                </div>
              </div>
            ))}
          </div>

          {/* Massive CTA */}
          <Link
            href="/#services"
            className="inline-flex items-center gap-3 bg-[#FF4B6A] text-white font-bold text-lg sm:text-xl px-10 py-5 rounded-full shadow-[0_8px_30px_-6px_rgba(255,75,106,0.5)] hover:shadow-[0_12px_40px_-6px_rgba(255,75,106,0.6)] hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Start Your Campaign Today
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Trust line */}
          <div className="mt-6 inline-flex items-center gap-3 text-sm text-[#4B5563] font-medium">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
              ))}
            </div>
            <span>Trusted by 25K+ creators &middot; 4.9/5 rating</span>
          </div>
        </div>
      </section>

      {/* SECTION 1 — Why Choose SocialNovaly */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#FFE4EC] text-[#FF4B6A] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              Why Choose SocialNovaly
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827]">
              Safe, transparent social growth you can trust
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 border border-[#E5E7EB] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFE4EC] flex items-center justify-center text-[#FF4B6A] mb-5">
                  {b.icon}
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{b.title}</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((s, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-[#111827] mb-1">{s.value}</div>
                <div className="text-xs sm:text-sm text-[#4B5563] font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Testimonials */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
              What Creators Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                  ))}
                </div>
                <p className="text-[#111827] text-sm font-medium leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-[#E5E7EB]">
                  <div className="font-semibold text-[#111827] text-sm">{t.author}</div>
                  <div className="text-xs text-[#4B5563]">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — Final CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-[#FF4B6A] p-10 sm:p-16 shadow-[0_20px_60px_-20px_rgba(255,75,106,0.4)]">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full" />

            <div className="relative text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                Ready to Grow Your Presence?
              </h2>
              <p className="text-white/70 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                Get started with confidence. Safe, transparent, and trusted by thousands.
              </p>
              <Link
                href="/#services"
                className="inline-flex items-center gap-2 bg-white text-[#FF4B6A] font-bold text-lg px-10 py-5 rounded-full hover:bg-gray-50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg w-full sm:w-auto justify-center"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NO FOOTER — intentional for Google Ads landing */}
    </div>
  );
}
