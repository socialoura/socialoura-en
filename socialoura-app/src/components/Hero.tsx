"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Zap, Shield, Star, Check, CreditCard, Users, Globe, Sparkles, TrendingUp } from "lucide-react";

const socialIcons = [
  {
    name: "Instagram",
    image: "/icon_social/instagram.png",
  },
  {
    name: "TikTok",
    image: "/icon_social/tiktok.webp",
  },
  {
    name: "YouTube",
    image: "/icon_social/youtube.png",
  },
  {
    name: "Facebook",
    image: "/icon_social/facebook.png",
  },
];

const platformServices = {
  Instagram: [
    { icon: <Users className="w-5 h-5" />, label: "Abonnés Instagram", color: "text-[#E1306C]", href: "/products/instagram-followers" },
    { icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#E1306C]"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>, label: "Likes Instagram", color: "text-[#E1306C]", href: "/products/instagram-likes" },
    { icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FF0000]"><path d="M8 5v14l11-7z"/></svg>, label: "Vues Instagram", color: "text-[#FF0000]", href: "/products/instagram-views" },
  ],
  TikTok: [
    { icon: <Users className="w-5 h-5" />, label: "Abonnés TikTok", color: "text-[#000000]", href: "/products/tiktok-followers" },
    { icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FF0050]"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>, label: "Likes TikTok", color: "text-[#FF0050]", href: "/products/tiktok-likes" },
    { icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#00F2EA]"><path d="M8 5v14l11-7z"/></svg>, label: "Vues TikTok", color: "text-[#00F2EA]", href: "/products/tiktok-views" },
  ],
  YouTube: [
    { icon: <Users className="w-5 h-5" />, label: "Abonnés YouTube", color: "text-[#FF0000]", href: "/products/youtube-subscribers" },
    { icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FF0000]"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>, label: "Likes YouTube", color: "text-[#FF0000]", href: "/products/youtube-likes" },
    { icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FF0000]"><path d="M8 5v14l11-7z"/></svg>, label: "Vues YouTube", color: "text-[#FF0000]", href: "/products/youtube-views" },
  ],
  Facebook: [
    { icon: <Users className="w-5 h-5" />, label: "Abonnés Facebook", color: "text-[#1877F2]", href: "/products/facebook-followers" },
    { icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1877F2]"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>, label: "Likes Facebook", color: "text-[#1877F2]", href: "/products/facebook-likes" },
  ],
};

const features = [
  { icon: <Zap className="w-4 h-4" />, text: "Livraison instantanée" },
  { icon: <Star className="w-4 h-4" />, text: "Qualité n°1" },
  { icon: <Shield className="w-4 h-4" />, text: "Risque 0 algorithme" },
  { icon: <Check className="w-4 h-4" />, text: "Followers 100 % Réels et actifs" },
  { icon: <Globe className="w-4 h-4" />, text: "Site le plus utilisé sur le marché Français" },
  { icon: <CreditCard className="w-4 h-4" />, text: "PayPal, Apple Pay ou carte de crédit" },
  { icon: <Users className="w-4 h-4" />, text: "100 % Sécurisé Français" },
];

export default function Hero() {
  const [selectedPlatform, setSelectedPlatform] = useState<"Instagram" | "TikTok" | "YouTube" | "Facebook">("Instagram");
  const serviceLinks = platformServices[selectedPlatform];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50/50 via-white to-purple-50/30">
      {/* Premium animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMTAgNjAgTSAwIDEwIEwgNjAgMTAgTSAyMCAwIEwgMjAgNjAgTSAwIDIwIEwgNjAgMjAgTSAzMCAwIEwgMzAgNjAgTSAwIDMwIEwgNjAgMzAgTSA0MCAwIEwgNDAgNjAgTSAwIDQwIEwgNjAgNDAgTSA1MCAwIEwgNTAgNjAgTSAwIDUwIEwgNjAgNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-16 md:pb-20 text-center">
        {/* Premium badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-xl rounded-full border-2 border-orange-200 shadow-xl mb-6 animate-scale-in hover:scale-105 transition-transform duration-300">
          <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
          <span className="text-sm font-black bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            #1 Plateforme en France
          </span>
          <TrendingUp className="w-4 h-4 text-green-500" />
        </div>

        {/* Premium heading with gradient */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6 animate-fade-in-up tracking-tight">
          Obtenez des{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-clip-text text-transparent">followers</span>
            <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 rounded-full opacity-30 blur-sm" />
          </span>
          <br />
          en quelques{" "}
          <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">secondes</span>
        </h1>
        
        <p className="text-slate-600 text-lg sm:text-xl mb-10 max-w-3xl mx-auto font-semibold leading-relaxed">
          La meilleure qualité sur le marché français.
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent font-black">Boostez votre algorithme</span> dès maintenant.
        </p>

        {/* Premium social media icons */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-12">
          {socialIcons.map((social, idx) => (
            <button
              key={social.name}
              onClick={() => setSelectedPlatform(social.name as "Instagram" | "TikTok" | "YouTube" | "Facebook")}
              className="group relative"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl blur-lg transition-all duration-300 ${
                selectedPlatform === social.name ? 'opacity-70 scale-110' : 'opacity-0 group-hover:opacity-50'
              }`} />
              <div className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer bg-white flex items-center justify-center transform hover:-translate-y-2 hover:scale-110 ${
                selectedPlatform === social.name ? 'ring-4 ring-orange-500 ring-offset-2 scale-110 -translate-y-2 shadow-3xl' : ''
              }`}>
                <Image
                  src={social.image}
                  alt={social.name}
                  width={80}
                  height={80}
                  className="object-cover p-1.5"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Premium service cards - Mobile optimized */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {serviceLinks.map((service, idx) => (
              <Link
                key={idx}
                href={service.href}
                className="group relative overflow-hidden"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-orange-600/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-gray-200 hover:border-orange-300 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                        <span className="text-white transform group-hover:rotate-12 transition-transform">{service.icon}</span>
                      </div>
                      <div className="text-left">
                        <span className="font-black text-slate-900 text-base sm:text-lg block mb-1">
                          {service.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-orange-500" />
                          <span className="text-xs sm:text-sm text-slate-600 font-bold">Livraison instantanée</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-xl group-hover:bg-orange-100 transition-colors">
                      <span className="text-sm font-black text-orange-600">Voir</span>
                      <ChevronRight className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Premium features grid - Mobile optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto mb-12">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-3 text-sm sm:text-base font-medium text-slate-700 glass-effect px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-white/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-orange-gradient flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-white">{feature.icon}</span>
              </div>
              <span className="text-left leading-tight">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Premium Trustpilot rating */}
        <div className="inline-flex items-center gap-3 glass-effect px-6 py-4 rounded-2xl border border-white/50 shadow-xl">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-green-500 text-green-500 drop-shadow-sm" />
            ))}
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-left">
            <div className="font-black text-slate-900 text-lg">4.9/5</div>
            <div className="text-xs text-slate-500 font-semibold">Trustpilot</div>
          </div>
          <div className="text-xs text-slate-400 font-medium">2,847 avis</div>
        </div>
      </div>
    </section>
  );
}
