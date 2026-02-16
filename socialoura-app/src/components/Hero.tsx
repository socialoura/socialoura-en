"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Zap, Shield, Star, Check, CreditCard, Users, Globe, TrendingUp, Heart, Play } from "lucide-react";

const socialIcons = [
  { name: "Instagram", image: "/icon_social/instagram.png" },
  { name: "TikTok", image: "/icon_social/tiktok.webp" },
  { name: "YouTube", image: "/icon_social/youtube.png" },
  { name: "Facebook", image: "/icon_social/facebook.png" },
];

const platformServices = {
  Instagram: [
    { icon: <Users className="w-5 h-5" />, label: "Instagram Followers", href: "/products/instagram-followers" },
    { icon: <Heart className="w-5 h-5" />, label: "Instagram Likes", href: "/products/instagram-likes" },
    { icon: <Play className="w-5 h-5" />, label: "Instagram Views", href: "/products/instagram-views" },
  ],
  TikTok: [
    { icon: <Users className="w-5 h-5" />, label: "TikTok Followers", href: "/products/tiktok-followers" },
    { icon: <Heart className="w-5 h-5" />, label: "TikTok Likes", href: "/products/tiktok-likes" },
    { icon: <Play className="w-5 h-5" />, label: "TikTok Views", href: "/products/tiktok-views" },
  ],
  YouTube: [
    { icon: <Users className="w-5 h-5" />, label: "YouTube Subscribers", href: "/products/youtube-subscribers" },
    { icon: <Heart className="w-5 h-5" />, label: "YouTube Likes", href: "/products/youtube-likes" },
    { icon: <Play className="w-5 h-5" />, label: "YouTube Views", href: "/products/youtube-views" },
  ],
  Facebook: [
    { icon: <Users className="w-5 h-5" />, label: "Facebook Followers", href: "/products/facebook-followers" },
    { icon: <Heart className="w-5 h-5" />, label: "Facebook Likes", href: "/products/facebook-likes" },
  ],
};

const features = [
  { icon: <Zap className="w-4 h-4" />, text: "Fast delivery" },
  { icon: <Star className="w-4 h-4" />, text: "#1 rated service" },
  { icon: <Shield className="w-4 h-4" />, text: "Safe promotion" },
  { icon: <Check className="w-4 h-4" />, text: "100% real & active" },
  { icon: <Globe className="w-4 h-4" />, text: "Trusted worldwide" },
  { icon: <CreditCard className="w-4 h-4" />, text: "PayPal, Apple Pay or Card" },
];

export default function Hero() {
  const [selectedPlatform, setSelectedPlatform] = useState<"Instagram" | "TikTok" | "YouTube" | "Facebook">("Instagram");
  const serviceLinks = platformServices[selectedPlatform];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF7FA] via-white to-[#FFF7FA]">
      {/* Subtle background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#FF4B6A]/[0.06] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#FFE4EC]/60 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-24 pb-16 md:pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFE4EC] rounded-full mb-6">
          <span className="text-xs font-bold text-[#FF4B6A] uppercase tracking-wide">#1 Social Growth Platform</span>
          <TrendingUp className="w-3.5 h-3.5 text-[#FF4B6A]" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#111827] leading-[1.1] mb-6 tracking-tight">
          Grow your{" "}
          <span className="text-[#FF4B6A]">audience</span>
          <br />
          with real{" "}
          <span className="text-[#FF4B6A]">results</span>
        </h1>

        <p className="text-[#111827]/60 text-lg sm:text-xl mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
          Safe, organic-style social media promotion services.
          <br className="hidden sm:block" />
          <span className="text-[#FF4B6A] font-bold">Boost your visibility</span> today.
        </p>

        {/* CTA Button */}
        <Link
          href="#services"
          className="inline-flex items-center gap-2 bg-[#FF4B6A] text-white font-bold text-lg px-8 py-4 rounded-full shadow-[0_8px_30px_-6px_rgba(255,75,106,0.5)] md:hover:shadow-[0_12px_40px_-6px_rgba(255,75,106,0.6)] md:hover:-translate-y-0.5 md:hover:scale-105 active:scale-95 transition-all duration-300 mb-4"
        >
          Get Started
          <ChevronRight className="w-5 h-5" />
        </Link>

        {/* Trust micro-line */}
        <p className="text-[#111827]/40 text-sm font-medium mb-6">5,000+ orders processed this week</p>

        {/* Trustpilot — under CTA */}
        <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-[#F1E4EA] shadow-sm mb-14">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#00b67a] text-[#00b67a]" />
            ))}
          </div>
          <div className="h-4 w-px bg-[#F1E4EA]" />
          <span className="font-bold text-[#111827] text-sm">4.9/5</span>
          <span className="text-[#111827]/40 text-xs font-medium">Trustpilot · 2,847 reviews</span>
        </div>

        {/* Social media icons — 3D style */}
        <div id="services" className="flex items-center justify-center gap-4 sm:gap-6 mb-12">
          {socialIcons.map((social, idx) => (
            <button
              key={social.name}
              onClick={() => setSelectedPlatform(social.name as "Instagram" | "TikTok" | "YouTube" | "Facebook")}
              className="group relative"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Soft glow behind selected */}
              <div className={`absolute inset-0 bg-[#FF4B6A] rounded-2xl blur-xl transition-all duration-300 ${
                selectedPlatform === social.name ? 'opacity-25 scale-125' : 'opacity-0'
              }`} />
              <div className={`relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-white flex items-center justify-center cursor-pointer transition-all duration-300 md:hover:-translate-y-1 ${
                selectedPlatform === social.name
                  ? 'ring-2 ring-[#FF4B6A] ring-offset-2 -translate-y-1 shadow-lg'
                  : 'shadow-md border border-[#F1E4EA] md:hover:shadow-lg'
              }`}>
                <Image
                  src={social.image}
                  alt={social.name}
                  width={80}
                  height={80}
                  className="object-cover p-2"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Service cards — clean white */}
        <div className="max-w-2xl mx-auto mb-14">
          <div className="grid grid-cols-1 gap-3">
            {serviceLinks.map((service, idx) => (
              <Link
                key={idx}
                href={service.href}
                className="group focus:outline-none"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="bg-white rounded-2xl p-5 border border-[#F1E4EA] shadow-sm md:hover:shadow-md md:hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#FFE4EC] flex items-center justify-center md:group-hover:scale-105 transition-transform duration-300">
                        <span className="text-[#FF4B6A]">{service.icon}</span>
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-[#111827] text-base block mb-0.5">
                          {service.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-[#FF4B6A]/60" />
                          <span className="text-xs text-[#111827]/40 font-medium">Fast delivery</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFE4EC] text-[#FF4B6A] md:group-hover:bg-[#FF4B6A] md:group-hover:text-white transition-colors duration-300">
                      <span className="text-sm font-bold">View</span>
                      <ChevronRight className="w-4 h-4 md:group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features strip — monochrome icons */}
        <div className="max-w-4xl mx-auto mb-0">
          <div className="flex flex-wrap justify-center gap-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm font-medium text-[#111827]/70 bg-white px-4 py-2.5 rounded-full border border-[#F1E4EA] shadow-sm"
              >
                <span className="text-[#FF4B6A]/70">{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
