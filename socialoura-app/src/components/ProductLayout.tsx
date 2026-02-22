"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
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
import BuyPopup, { type BuyPlan } from "./BuyPopup";

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

/* ─── Avatar photo URLs (ui-avatars.com for realistic initials) ─── */
function getAvatarUrl(name: string, idx: number): string {
  const colors = ["E1306C", "833AB4", "FF0000", "1877F2", "10B981", "F59E0B", "6366F1", "EC4899"];
  const bg = colors[idx % colors.length];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=96&bold=true&format=svg`;
}

/* ─── Main Component ─── */
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
  const [product, setProduct] = useState(initialProduct);
  const defaultTier = product.pricingTiers.length > 0
    ? (product.pricingTiers.find((t) => t.popular) || product.pricingTiers[0])
    : { quantity: 100, price: 0, pricePerUnit: 0 };

  const [selectedTier, setSelectedTier] = useState<PricingTier>(defaultTier);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupPlan, setPopupPlan] = useState<BuyPlan | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const reviews = useMemo(() => getRandomReviews(4, product.id), [product.id]);
  const avgRating = useMemo(() => getAverageRating(), []);

  const grad = gradient || platformGradients[product.platform] || platformGradients.instagram;
  const platformName = product.platform.charAt(0).toUpperCase() + product.platform.slice(1);

  const formatUSD = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

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
    <div className="min-h-screen bg-[#FAFAFA] overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════
          1. HERO SECTION — gradient halo + platform tabs
         ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-10 pb-6 sm:pt-16 sm:pb-10">
        {/* Gradient halo */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[500px] opacity-20 blur-3xl pointer-events-none mix-blend-multiply"
          style={{ background: `radial-gradient(ellipse at center, ${grad.from}, ${grad.to}, transparent 70%)` }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Platform pill tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
            {platformTabs.map((tab) => {
              const isActive = tab.key === product.platform;
              return (
                <Link
                  key={tab.key}
                  href={platformProducts[tab.key]?.[0]?.href || "#"}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
                    isActive
                      ? "text-white shadow-md"
                      : "bg-white text-[#4B5563] hover:shadow-md border border-[#E5E7EB]"
                  }`}
                  style={isActive ? { background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` } : {}}
                >
                  {tab.icon}
                  <span className="hidden xs:inline sm:inline">{tab.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Sub-tabs for current platform */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 flex-wrap">
            {(platformProducts[product.platform] || []).map((sub) => {
              const isActive = sub.href === `/products/${product.id}`;
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#111827] text-white shadow-sm"
                      : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
                  }`}
                >
                  {sub.label}
                </Link>
              );
            })}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#111827] leading-tight tracking-tight mb-3 sm:mb-4 max-w-3xl mx-auto">
            {heroTitle || product.name}
          </h1>
          <p className="text-[#6B7280] text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto mb-2">
            {heroSubtitle || product.description}
          </p>
          <p className="text-xs sm:text-sm font-semibold" style={{ color: grad.from }}>
            AI-powered audience matching · Smart campaign delivery · Real users, real growth
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. PRICING GRID — gradient container, compact cards
         ═══════════════════════════════════════════════ */}
      <section className="relative py-8 sm:py-14 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(180deg, ${grad.from}0D 0%, #FAFAFA 35%, ${grad.to}0D 100%)`,
          }}
        />
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[380px] blur-3xl opacity-30 -z-10"
          style={{ background: `radial-gradient(ellipse at center, ${grad.from}, transparent 70%)` }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div
            className="rounded-3xl p-4 sm:p-8 lg:p-10 shadow-xl border border-white/60"
            style={{ background: `linear-gradient(135deg, ${grad.from}0A, ${grad.to}08, #FEFEFE)` }}
          >
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111827] mb-2">{pricingTitle}</h2>
              {pricingBadge && (
                <span
                  className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                >
                  {pricingBadge}
                </span>
              )}
            </div>

            {/* Pricing cards grid — 1 col mobile, 2 tablet, 3-4 desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
              {product.pricingTiers.map((tier) => {
                const isSelected = selectedTier.quantity === tier.quantity;
                const worstUnit = product.pricingTiers.length > 0 ? product.pricingTiers[0].pricePerUnit : 0;
                const savingsPercent = worstUnit > 0 ? Math.round(((worstUnit - tier.pricePerUnit) / worstUnit) * 100) : 0;

                return (
                  <button
                    key={tier.quantity}
                    type="button"
                    onClick={() => setSelectedTier(tier)}
                    className={`relative flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-transparent shadow-lg bg-white"
                        : "border-[#F3F4F6] bg-white hover:border-[#E5E7EB] hover:shadow-sm"
                    }`}
                    style={isSelected ? { borderColor: grad.from, boxShadow: `0 4px 20px -4px ${grad.from}30` } : {}}
                  >
                    {/* Radio circle */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected ? "border-transparent" : "border-[#D1D5DB]"
                      }`}
                      style={isSelected ? { borderColor: grad.from, background: grad.from } : {}}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-[#111827]">
                        {tier.quantity.toLocaleString()} {typeLabel[product.type] || product.type}
                      </div>
                      <span className="text-base sm:text-lg font-extrabold" style={{ color: grad.from }}>
                        {formatUSD(tier.price)}
                      </span>
                    </div>

                    {/* Savings badge */}
                    {savingsPercent > 0 && (
                      <span
                        className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                      >
                        -{savingsPercent}%
                      </span>
                    )}

                    {/* Popular badge — absolute, doesn't affect card height */}
                    {tier.popular && (
                      <span
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold text-white whitespace-nowrap z-10"
                        style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                      >
                        🔥 Most Popular
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Buy button */}
            <div className="text-center">
              <button
                onClick={handleBuy}
                disabled={!selectedTier || selectedTier.price <= 0}
                className="inline-flex items-center gap-2 text-white font-bold text-sm sm:text-base lg:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
              >
                Start Campaign — {selectedTier?.price > 0 ? formatUSD(selectedTier.price) : "Select a plan"}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Feature line */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 mt-5 sm:mt-6 flex-wrap">
              {featureDefaults.map((f, i) => (
                <span key={i} className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[#9CA3AF] font-medium">
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" style={{ color: grad.from }} />
                  {typeof f === "string" ? f.split("—")[0].trim() : f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. BENEFITS — 1/2/3 cols, big icons, border-t-4, shadow
         ═══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111827]">
              Advantages When You Choose <span style={{ color: grad.from }}>SocialNovaly</span>
            </h2>
            <p className="text-[#9CA3AF] mt-2 text-xs sm:text-sm font-medium">
              AI-powered audience matching. Smart campaign delivery, never bots.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F3F4F6] border-t-4 shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
                style={{ borderTopColor: grad.from }}
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-5 text-white group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                >
                  {b.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#111827] mb-2">{b.title}</h3>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. ZIG-ZAG — image with blob, stacked on mobile
         ═══════════════════════════════════════════════ */}
      {zigzag && zigzag.length > 0 && (
        <section className="py-12 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111827]">
                Why You Should Choose <span style={{ color: grad.from }}>Our AI-Powered Platform</span>
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
                    {/* Text */}
                    <div className="flex-1 w-full">
                      <h3 className="text-lg sm:text-2xl font-extrabold text-[#111827] mb-3 sm:mb-4">{item.title}</h3>
                      <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed">{item.description}</p>
                    </div>
                    {/* Image with blob */}
                    <div className="flex-1 relative w-full">
                      {/* Blob behind image */}
                      <div
                        className="absolute -inset-4 sm:-inset-6 rounded-3xl opacity-15 blur-2xl pointer-events-none -z-10"
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
                          style={{ background: `linear-gradient(135deg, ${grad.from}12, ${grad.to}08)` }}
                        >
                          <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                          >
                            {zigzagIcons[i % zigzagIcons.length]}
                          </div>
                          <div className="flex gap-2">
                            {[...Array(3)].map((_, j) => (
                              <div
                                key={j}
                                className="w-2 h-2 rounded-full opacity-40"
                                style={{ background: grad.from }}
                              />
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
          5. REVIEWS — avatar photos, quote watermark, 1/2 cols
         ═══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111827]">
              Real Customers, <span style={{ color: grad.from }}>Real Results</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FBBF24] text-[#FBBF24]" />
                ))}
              </div>
              <span className="text-base sm:text-lg font-bold text-[#111827]">{avgRating}/5</span>
              <span className="text-xs sm:text-sm text-[#9CA3AF]">({reviews.length * 250}+ reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {reviews.map((review, idx) => (
              <div
                key={review.id}
                className="relative bg-white rounded-2xl pt-14 sm:pt-16 px-5 sm:px-7 pb-5 sm:pb-7 border border-[#F3F4F6] shadow-md hover:shadow-lg transition-all duration-200"
              >
                {/* Giant quote watermark */}
                <div className="absolute bottom-3 right-4 text-8xl sm:text-9xl font-serif leading-none opacity-[0.04] pointer-events-none select-none" style={{ color: grad.from }}>
                  &ldquo;
                </div>

                {/* Avatar — overflows top of card */}
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
                    <p className="font-bold text-[#111827] text-sm">{review.author}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? "fill-[#FBBF24] text-[#FBBF24]" : "text-[#E5E7EB]"}`}
                          />
                        ))}
                      </div>
                      {review.verified && (
                        <span className="text-[9px] sm:text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-[#D1D5DB]">{review.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. FAQ — gradient border on active, chevron in circle
         ═══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111827]">
              Frequently Asked Questions
            </h2>
            <p className="text-[#9CA3AF] mt-2 sm:mt-3 text-xs sm:text-sm font-medium">
              Everything you need to know about our AI-powered platform.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx}>
                  {/* Gradient border wrapper for active state */}
                  <div
                    className={`rounded-2xl transition-all duration-300 ${
                      isOpen ? "p-[2px] shadow-lg" : "p-0"
                    }`}
                    style={isOpen ? { background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` } : {}}
                  >
                    <div
                      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                        isOpen ? "bg-white" : "bg-[#FAFAFA] border border-[#F3F4F6]"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left"
                      >
                        <span className="font-semibold text-[#111827] text-sm sm:text-base pr-3">{faq.question}</span>
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                            isOpen ? "text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"
                          }`}
                          style={isOpen ? { background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` } : {}}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        </div>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                        <div className="px-4 sm:px-6 pb-5 text-[#6B7280] text-xs sm:text-sm leading-relaxed">
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
          7. FOOTER CTA — gradient, glassmorphism buttons
         ═══════════════════════════════════════════════ */}
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <div
          className="max-w-5xl mx-auto rounded-3xl p-6 sm:p-10 lg:p-14 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-40 sm:w-48 h-40 sm:h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-32 sm:w-36 h-32 sm:h-36 bg-white/10 rounded-full" />

          <div className="relative">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3 sm:mb-4">
              Ready to Grow Your {platformName} Presence?
            </h2>
            <p className="text-white/70 text-xs sm:text-sm lg:text-base mb-6 sm:mb-8 max-w-xl mx-auto">
              Join thousands of creators using our AI-powered platform for safe, data-backed social growth.
            </p>

            {/* Glassmorphism platform links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
              {platformTabs.map((tab) => (
                <Link
                  key={tab.key}
                  href={platformProducts[tab.key]?.[0]?.href || "#"}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200 w-full sm:w-auto justify-center"
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

      {/* Buy Popup */}
      {popupPlan && (
        <BuyPopup
          isOpen={popupOpen}
          onClose={() => setPopupOpen(false)}
          plan={popupPlan}
        />
      )}
    </div>
  );
}
