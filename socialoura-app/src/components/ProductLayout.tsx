"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, PricingTier } from "@/types/product";
import {
  Check,
  ChevronDown,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Target,
  BarChart3,
  Instagram,
  Youtube,
  Facebook,
  Music,
  Quote,
  TrendingUp,
  Lock,
  Users,
} from "lucide-react";
import { getRandomReviews, getAverageRating } from "@/data/reviews";
import Navbar from "./Navbar";
import Footer from "./Footer";
import NewCheckoutDrawer, { type CheckoutPlan } from "./NewCheckoutDrawer";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { convertAmountCents } from "@/lib/currency";

/* ─── Types for extended product data ─── */
export interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface ZigZagItem {
  title: string;
  description: string;
  imageSrc?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProductLayoutProps {
  product: Product;
  heroTitle?: string;
  heroSubtitle?: string;
  pricingTitle?: string;
  pricingBadge?: string;
  pricingFeatures?: string[];
  benefits?: Benefit[];
  zigzag?: ZigZagItem[];
  faqItems?: FAQItem[];
  gradient?: { from: string; to: string };
}

/* ─── Platform pill tabs ─── */
const platformTabs = [
  { key: "instagram", label: "Instagram", icon: <Instagram className="w-4 h-4" />, color: "#E1306C" },
  { key: "tiktok", label: "TikTok", icon: <Music className="w-4 h-4" />, color: "#000000" },
  { key: "youtube", label: "YouTube", icon: <Youtube className="w-4 h-4" />, color: "#FF0000" },
  { key: "facebook", label: "Facebook", icon: <Facebook className="w-4 h-4" />, color: "#1877F2" },
];

const platformGradients: Record<string, { from: string; to: string }> = {
  instagram: { from: "#E1306C", to: "#833AB4" },
  tiktok: { from: "#000000", to: "#69C9D0" },
  youtube: { from: "#FF0000", to: "#833AB4" },
  facebook: { from: "#1877F2", to: "#833AB4" },
};

const platformProducts: Record<string, { label: string; href: string }[]> = {
  instagram: [
    { label: "Followers", href: "/products/instagram-followers" },
    { label: "Likes", href: "/products/instagram-likes" },
    { label: "Views", href: "/products/instagram-views" },
  ],
  tiktok: [
    { label: "Followers", href: "/products/tiktok-followers" },
    { label: "Likes", href: "/products/tiktok-likes" },
    { label: "Views", href: "/products/tiktok-views" },
  ],
  youtube: [
    { label: "Subscribers", href: "/products/youtube-subscribers" },
    { label: "Views", href: "/products/youtube-views" },
    { label: "Likes", href: "/products/youtube-likes" },
  ],
  facebook: [
    { label: "Followers", href: "/products/facebook-followers" },
    { label: "Likes", href: "/products/facebook-likes" },
  ],
};

const typeLabel: Record<string, string> = {
  followers: "Followers",
  likes: "Likes",
  views: "Viewers",
  subscribers: "Subscribers",
};

const inputConfig: Record<string, { label: string; placeholder: string; inputMode: "text" | "url" }> = {
  followers: { label: "Enter your username", placeholder: "Your {platform} username", inputMode: "text" },
  subscribers: { label: "Enter your channel URL", placeholder: "https://youtube.com/@yourchannel", inputMode: "url" },
  likes: { label: "Enter the post URL", placeholder: "https://{platform}.com/p/...", inputMode: "url" },
  views: { label: "Enter the video URL", placeholder: "https://{platform}.com/...", inputMode: "url" },
};

/* ─── Zigzag placeholder icons per index ─── */
const zigzagIcons = [
  <TrendingUp key="t" className="w-10 h-10" />,
  <Users key="u" className="w-10 h-10" />,
  <BarChart3 key="b" className="w-10 h-10" />,
];

const defaultBenefits: Benefit[] = [
  { icon: <Target className="w-7 h-7" />, title: "AI-Powered Targeting", description: "Our machine-learning algorithms identify the most relevant audience for your content to maximize engagement." },
  { icon: <Shield className="w-7 h-7" />, title: "100% Safe & Compliant", description: "Fully compliant with platform Terms of Service. Our AI monitors campaigns in real-time to keep your account safe." },
  { icon: <BarChart3 className="w-7 h-7" />, title: "Real-Time Analytics", description: "Track your AI-driven campaign performance live. Full transparency, no hidden metrics." },
];

const defaultFAQ: FAQItem[] = [
  { question: "Are the profiles real and active?", answer: "We utilize a network of verified, active users filtered by our multi-layer quality-control AI. Every profile passes automated authenticity checks before being included in any campaign." },
  { question: "Is it safe for my account?", answer: "Yes. Our AI-powered delivery engine strictly adheres to platform velocity limits and mimics organic behavior patterns to ensure 100% safety. Your account is never put at risk." },
  { question: "How does Smart Delivery Pacing work?", answer: "Our AI-driven delivery system distributes engagement incrementally over time, replicating the natural growth curve of an organically growing account." },
  { question: "Do you need my password?", answer: "No login credentials are ever required. We only need your public profile URL or username. Your account security is fully preserved." },
  { question: "What is the High-Retention Guarantee?", answer: "Every campaign is backed by a lifetime stability guarantee. Our quality-control AI continuously monitors your results and auto-replenishes any variance at no additional cost." },
  { question: "Is there a subscription or recurring charge?", answer: "No. All plans are one-time campaigns with no hidden subscriptions or recurring charges." },
];

/* ─── Live activity data ─── */
const liveNames = ["Alex", "Sarah", "James", "Emma", "David", "Olivia", "Michael", "Sophia", "Daniel", "Mia"];
const liveCountries = ["USA", "UK", "Canada", "Australia", "Germany", "France", "Spain", "Brazil"];

/* ─── Avatar photo URLs ─── */
function getAvatarUrl(name: string, idx: number): string {
  const colors = ["E1306C", "833AB4", "FF0000", "1877F2", "10B981", "F59E0B", "6366F1", "EC4899"];
  const bg = colors[idx % colors.length];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=96&bold=true&format=svg`;
}

/* ═══════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════ */
export default function ProductLayout({
  product: initialProduct,
  heroTitle,
  heroSubtitle,
  pricingTitle = "Choose Your AI Campaign",
  pricingBadge,
  pricingFeatures,
  benefits = defaultBenefits,
  zigzag,
  faqItems = defaultFAQ,
  gradient,
}: ProductLayoutProps) {
  const geo = useGeoLocation();
  const [product, setProduct] = useState(initialProduct);
  const defaultTier = product.pricingTiers.length > 0
    ? (product.pricingTiers.find((t) => t.popular) || product.pricingTiers[0])
    : { quantity: 100, price: 0, pricePerUnit: 0 };

  const [selectedTier, setSelectedTier] = useState<PricingTier>(defaultTier);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupPlan, setPopupPlan] = useState<CheckoutPlan | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [liveActivity, setLiveActivity] = useState<string | null>(null);
  const [showSticky, setShowSticky] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  const reviews = useMemo(() => getRandomReviews(4, product.id), [product.id]);
  const avgRating = useMemo(() => getAverageRating(), []);

  const grad = gradient || platformGradients[product.platform] || platformGradients.instagram;
  const platformName = product.platform.charAt(0).toUpperCase() + product.platform.slice(1);

  const formatLocal = useCallback((usdAmount: number) => {
    const cents = convertAmountCents(Math.round(usdAmount * 100), geo.currency);
    return `${geo.currency.symbol}${(cents / 100).toFixed(2)}`;
  }, [geo.currency]);

  // Fetch dynamic packs
  useEffect(() => {
    async function fetchPacks() {
      try {
        const response = await fetch("/api/admin/pricing");
        const data = await response.json();
        const goals =
          data && typeof data === "object" && data[product.platform]
            ? Array.isArray(data[product.platform]?.[product.type])
              ? data[product.platform][product.type]
              : []
            : [];
        const tiers = goals
          .map((g: any) => {
            const quantity = Number(String(g.followers).replace(/\s/g, ""));
            const price = Number(String(g.price).replace(",", "."));
            if (!Number.isFinite(quantity) || !Number.isFinite(price) || quantity <= 0) return null;
            return { quantity, price, pricePerUnit: price / quantity };
          })
          .filter(Boolean)
          .sort((a: any, b: any) => a.quantity - b.quantity);
        if (tiers.length > 0) {
          const midIdx = Math.floor(tiers.length / 2);
          tiers[midIdx].popular = true;
          setProduct((prev) => ({ ...prev, pricingTiers: tiers }));
          setSelectedTier(tiers[midIdx]);
        }
      } catch (error) {
        console.error("Error fetching packs:", error);
      }
    }
    fetchPacks();
  }, [product.platform, product.type]);

  // Live activity ticker
  useEffect(() => {
    const show = () => {
      const name = liveNames[Math.floor(Math.random() * liveNames.length)];
      const country = liveCountries[Math.floor(Math.random() * liveCountries.length)];
      const quantities = [500, 1000, 2500, 5000, 10000];
      const qty = quantities[Math.floor(Math.random() * quantities.length)];
      setLiveActivity(`${name} from ${country} just bought ${qty.toLocaleString()} ${typeLabel[product.type] || product.type}`);
      setTimeout(() => setLiveActivity(null), 4000);
    };
    const interval = setInterval(show, 8000);
    const initial = setTimeout(show, 3000);
    return () => { clearInterval(interval); clearTimeout(initial); };
  }, [product.type]);

  // Sticky CTA on mobile — show when pricing section scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (pricingRef.current) observer.observe(pricingRef.current);
    return () => observer.disconnect();
  }, []);

  const handleBuy = useCallback(() => {
    if (!selectedTier || !selectedTier.quantity) return;
    const cfg = inputConfig[product.type] || inputConfig.followers;
    setPopupPlan({
      productId: product.id,
      productName: product.name,
      platform: product.platform,
      type: product.type,
      quantity: selectedTier.quantity,
      price: selectedTier.price,
      inputMode: cfg.inputMode,
      inputLabel: cfg.label,
      inputPlaceholder: cfg.placeholder.replace("{platform}", platformName.toLowerCase()),
    });
    setPopupOpen(true);
  }, [selectedTier, product, platformName]);

  const featureDefaults = pricingFeatures || product.features.slice(0, 4);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════
          1. HERO SECTION
         ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-8 pb-4 sm:pt-14 sm:pb-8">
        {/* Gradient halo */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] sm:h-[500px] opacity-[0.12] blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, ${grad.from}, ${grad.to}, transparent 70%)` }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Platform pill slider — horizontal scroll on mobile */}
          <div className="relative mb-5 sm:mb-7">
            <div
              ref={pillsRef}
              className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 sm:pb-0 sm:justify-center snap-x snap-mandatory px-1"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {platformTabs.map((tab) => {
                const isActive = tab.key === product.platform;
                return (
                  <Link
                    key={tab.key}
                    href={platformProducts[tab.key]?.[0]?.href || "#"}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 snap-start flex-shrink-0 min-h-[44px] ${
                      isActive
                        ? "bg-white text-slate-800 shadow-lg border-2"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent"
                    }`}
                    style={isActive ? { borderColor: grad.from } : {}}
                  >
                    <span style={{ color: isActive ? tab.color : undefined }}>{tab.icon}</span>
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sub-tabs for current platform */}
          <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8 flex-wrap">
            {(platformProducts[product.platform] || []).map((sub) => {
              const isActive = sub.href === `/products/${product.id}`;
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 min-h-[44px] flex items-center ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {sub.label}
                </Link>
              );
            })}
          </div>

          {/* Title with gradient text */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.1] tracking-tight mb-4 max-w-3xl mx-auto">
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}>
              {heroTitle || product.name}
            </span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto mb-3">
            {heroSubtitle || product.description}
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-5 text-xs sm:text-sm font-medium text-slate-400">
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" style={{ color: grad.from }} /> AI-Powered</span>
            <span className="text-slate-200">|</span>
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" style={{ color: grad.from }} /> 100% Safe</span>
            <span className="text-slate-200">|</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" style={{ color: grad.from }} /> Real Growth</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. PRICING GRID — Card-based selection
         ═══════════════════════════════════════════════ */}
      <section className="relative py-8 sm:py-14 overflow-hidden" ref={pricingRef}>
        <div
          className="absolute inset-0 -z-10"
          style={{ background: `linear-gradient(180deg, ${grad.from}08 0%, white 40%, ${grad.to}06 100%)` }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800 mb-2">{pricingTitle}</h2>
            {pricingBadge && (
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
              >
                {pricingBadge}
              </span>
            )}
          </div>

          {/* Pricing cards — 2 cols mobile, 3 tablet, 4 desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {product.pricingTiers.map((tier) => {
              const isSelected = selectedTier.quantity === tier.quantity;
              const worstUnit = product.pricingTiers.length > 0 ? product.pricingTiers[0].pricePerUnit : 0;
              const savingsPercent = worstUnit > 0 ? Math.round(((worstUnit - tier.pricePerUnit) / worstUnit) * 100) : 0;

              return (
                <button
                  key={tier.quantity}
                  type="button"
                  onClick={() => setSelectedTier(tier)}
                  className={`relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 min-h-[120px] ${
                    isSelected
                      ? "bg-white shadow-xl scale-[1.02]"
                      : "bg-white/80 border-slate-100 hover:border-slate-200 hover:shadow-md"
                  }`}
                  style={isSelected ? {
                    borderColor: grad.from,
                    boxShadow: `0 8px 30px -8px ${grad.from}30`,
                    background: `linear-gradient(180deg, white, ${grad.from}06)`,
                  } : {}}
                >
                  {/* Savings badge */}
                  {savingsPercent > 0 && (
                    <span
                      className="absolute -top-2.5 right-2 sm:right-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white z-10"
                      style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                    >
                      Save {savingsPercent}%
                    </span>
                  )}

                  {/* Popular badge */}
                  {tier.popular && (
                    <span
                      className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold text-white whitespace-nowrap z-10"
                      style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                    >
                      Most Popular
                    </span>
                  )}

                  {/* Quantity */}
                  <span className="text-2xl sm:text-3xl font-black text-slate-800 leading-none mt-1">
                    {tier.quantity >= 1000 ? `${(tier.quantity / 1000).toFixed(tier.quantity % 1000 === 0 ? 0 : 1)}K` : tier.quantity}
                  </span>
                  <span className="text-xs text-slate-400 font-medium mt-1 mb-3">
                    {typeLabel[product.type] || product.type}
                  </span>

                  {/* Price */}
                  <span className="text-lg sm:text-xl font-extrabold" style={{ color: isSelected ? grad.from : "#334155" }}>
                    {formatLocal(tier.price)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Buy button */}
          <div className="text-center">
            <button
              onClick={handleBuy}
              disabled={!selectedTier || selectedTier.price <= 0}
              className="inline-flex items-center gap-2.5 text-white font-bold text-base sm:text-lg px-10 sm:px-12 py-4 sm:py-[18px] rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px]"
              style={{
                background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                boxShadow: `0 8px 30px -8px ${grad.from}50`,
              }}
            >
              Start Campaign — {selectedTier?.price > 0 ? formatLocal(selectedTier.price) : "Select a plan"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Feature line */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 mt-5 sm:mt-7 flex-wrap">
            {featureDefaults.map((f, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: grad.from }} />
                {typeof f === "string" ? f.split("—")[0].trim() : f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          LIVE ACTIVITY TOAST
         ═══════════════════════════════════════════════ */}
      {liveActivity && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-50 animate-[fadeInUp_0.4s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 px-4 py-3 flex items-center gap-3 max-w-xs">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            <p className="text-xs text-slate-600 font-medium leading-snug">{liveActivity}</p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          3. BENEFITS
         ═══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800">
              Why Choose <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}>SocialNovaly</span>
            </h2>
            <p className="text-slate-400 mt-2 text-sm font-medium">
              AI-powered audience matching. Smart campaign delivery, never bots.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                >
                  {b.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">{b.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. ZIG-ZAG
         ═══════════════════════════════════════════════ */}
      {zigzag && zigzag.length > 0 && (
        <section className="py-12 sm:py-20 bg-slate-50/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800">
                Why You Should Choose <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}>Our AI-Powered Platform</span>
              </h2>
            </div>
            <div className="space-y-14 sm:space-y-24">
              {zigzag.map((item, i) => {
                const isReversed = i % 2 === 1;
                return (
                  <div
                    key={i}
                    className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 sm:gap-14`}
                  >
                    <div className="flex-1 w-full">
                      <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 mb-3 sm:mb-4">{item.title}</h3>
                      <p className="text-slate-500 text-sm sm:text-base leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex-1 relative w-full">
                      <div
                        className="absolute -inset-4 sm:-inset-6 rounded-3xl opacity-10 blur-2xl pointer-events-none -z-10"
                        style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                      />
                      {item.imageSrc ? (
                        <Image
                          src={item.imageSrc}
                          alt={item.title}
                          width={500}
                          height={350}
                          className="relative rounded-2xl shadow-lg object-cover w-full"
                        />
                      ) : (
                        <div
                          className="relative rounded-2xl w-full aspect-[4/3] flex flex-col items-center justify-center gap-4 shadow-md border border-white/50"
                          style={{ background: `linear-gradient(135deg, ${grad.from}08, ${grad.to}05)` }}
                        >
                          <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                          >
                            {zigzagIcons[i % zigzagIcons.length]}
                          </div>
                          <div className="flex gap-2">
                            {[...Array(3)].map((_, j) => (
                              <div key={j} className="w-2 h-2 rounded-full opacity-30" style={{ background: grad.from }} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          5. REVIEWS
         ═══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800">
              Real Customers, <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}>Real Results</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-base sm:text-lg font-bold text-slate-800">{avgRating}/5</span>
              <span className="text-xs sm:text-sm text-slate-400">({reviews.length * 250}+ reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {reviews.map((review, idx) => (
              <div
                key={review.id}
                className="relative bg-white rounded-2xl pt-14 sm:pt-16 px-5 sm:px-7 pb-5 sm:pb-7 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <div className="absolute bottom-3 right-4 text-8xl sm:text-9xl font-serif leading-none opacity-[0.03] pointer-events-none select-none" style={{ color: grad.from }}>
                  &ldquo;
                </div>
                <div className="absolute -top-7 left-5 sm:left-7">
                  <Image
                    src={getAvatarUrl(review.author, idx)}
                    alt={review.author}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full border-4 border-white shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{review.author}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                        ))}
                      </div>
                      {review.verified && (
                        <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">Verified</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-300">{review.date}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. FAQ
         ═══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-20 bg-slate-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 mt-3 text-sm font-medium">
              Everything you need to know about our AI-powered platform.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx}>
                  <div
                    className={`rounded-2xl transition-all duration-300 ${isOpen ? "p-[2px] shadow-lg" : "p-0"}`}
                    style={isOpen ? { background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` } : {}}
                  >
                    <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-white" : "bg-white border border-slate-100"}`}>
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 text-left min-h-[52px]"
                      >
                        <span className="font-semibold text-slate-800 text-sm sm:text-base pr-3">{faq.question}</span>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                            isOpen ? "text-white" : "bg-slate-100 text-slate-400"
                          }`}
                          style={isOpen ? { background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` } : {}}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        </div>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                        <div className="px-5 sm:px-6 pb-5 text-slate-500 text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. FOOTER CTA
         ═══════════════════════════════════════════════ */}
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <div
          className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
        >
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Ready to Grow Your {platformName} Presence?
            </h2>
            <p className="text-white/70 text-sm lg:text-base mb-8 max-w-xl mx-auto">
              Join thousands of creators using our AI-powered platform for safe, data-backed social growth.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
              {platformTabs.map((tab) => (
                <Link
                  key={tab.key}
                  href={platformProducts[tab.key]?.[0]?.href || "#"}
                  className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200 w-full sm:w-auto justify-center min-h-[44px]"
                >
                  {tab.icon}
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* ═══════════════════════════════════════════════
          STICKY MOBILE CTA
         ═══════════════════════════════════════════════ */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 sm:hidden transition-all duration-300 ${
          showSticky ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-lg border-t border-slate-100 px-4 py-3 safe-area-bottom">
          <button
            onClick={handleBuy}
            disabled={!selectedTier || selectedTier.price <= 0}
            className="w-full flex items-center justify-center gap-2 text-white font-bold text-base py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 min-h-[52px]"
            style={{
              background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
              boxShadow: `0 4px 20px -4px ${grad.from}40`,
            }}
          >
            Start Campaign — {selectedTier?.price > 0 ? formatLocal(selectedTier.price) : "Select"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Checkout Drawer */}
      {popupPlan && (
        <NewCheckoutDrawer
          isOpen={popupOpen}
          onClose={() => setPopupOpen(false)}
          plan={popupPlan}
        />
      )}
    </div>
  );
}
