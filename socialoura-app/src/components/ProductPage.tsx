"use client";

import { useMemo, useState, useEffect } from "react";
import { Product } from "@/types/product";
import { Star, Check, Shield, Zap, Clock, Lock, Sparkles, ArrowRight, Instagram, Youtube, Facebook, Music } from "lucide-react";
import { getRandomReviews, getAverageRating } from "@/data/reviews";
import Navbar from "./Navbar";
import Features from "./Features";
import FAQ from "./FAQ";
import CTA from "./CTA";
import Footer from "./Footer";
import BuyPopup, { type BuyPlan } from "./BuyPopup";

interface ProductPageProps {
  product: Product;
}

const platformIconMap: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-5 h-5" />,
  tiktok: <Music className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
};

const typeLabel: Record<string, string> = {
  followers: "Followers",
  likes: "Likes",
  views: "Views",
  comments: "Comments",
  subscribers: "Subscribers",
};

const inputConfig: Record<string, { label: string; placeholder: string; example: string; inputMode: "text" | "url" }> = {
  followers: { label: "Enter your username", placeholder: "Your {platform} username", example: "Example: @yourusername", inputMode: "text" },
  subscribers: { label: "Enter your channel URL", placeholder: "https://youtube.com/@yourchannel", example: "Paste your YouTube channel link", inputMode: "url" },
  likes: { label: "Enter the post URL", placeholder: "https://{platform}.com/p/...", example: "Paste the link to the post or reel", inputMode: "url" },
  views: { label: "Enter the video URL", placeholder: "https://{platform}.com/...", example: "Paste the link to the video", inputMode: "url" },
  comments: { label: "Enter the post URL", placeholder: "https://{platform}.com/p/...", example: "Paste the link to the post", inputMode: "url" },
};

export default function ProductPage({ product: initialProduct }: ProductPageProps) {
  const [product, setProduct] = useState(initialProduct);
  
  // Default tier with safe fallback
  const defaultTier = product.pricingTiers.length > 0
    ? (product.pricingTiers.find((t) => t.popular) || product.pricingTiers[0])
    : { quantity: 100, price: 0, pricePerUnit: 0 };
  
  const [selectedTier, setSelectedTier] = useState(defaultTier);
  const [customQuantity, setCustomQuantity] = useState<string>("");
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupPlan, setPopupPlan] = useState<BuyPlan | null>(null);
  const reviews = useMemo(() => getRandomReviews(4, product.id), [product.id]);
  const avgRating = useMemo(() => getAverageRating(), []);

  // Fetch dynamic packs from pricing API (JSONB)
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
            return {
              quantity,
              price,
              pricePerUnit: price / quantity,
            };
          })
          .filter(Boolean)
          .sort((a: any, b: any) => a.quantity - b.quantity);

        if (tiers.length > 0) {
          // Mark the middle tier as popular if none is marked
          const midIdx = Math.floor(tiers.length / 2);
          tiers[midIdx].popular = true;
          setProduct((prev) => ({ ...prev, pricingTiers: tiers }));
          setSelectedTier(tiers[midIdx]);
        }
      } catch (error) {
        console.error('Error fetching packs:', error);
      }
    }
    
    fetchPacks();
  }, [product.platform, product.type]);

  const formatUSD = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  // Proportional pricing: rule of three based on first tier
  // e.g. if 1000 followers = $10, then 3500 = (3500/1000) * 10 = $35
  const getCustomPrice = (qty: number): number => {
    if (product.pricingTiers.length === 0) return 0;
    const baseTier = product.pricingTiers[0];
    return (qty / baseTier.quantity) * baseTier.price;
  };

  const currentPrice = useMemo(() => {
    if (isCustomSelected && customQuantity && parseInt(customQuantity) >= 100) {
      return getCustomPrice(parseInt(customQuantity));
    }
    return selectedTier?.price || 0;
  }, [selectedTier?.price, isCustomSelected, customQuantity, product.pricingTiers]);

  const currentQuantity = useMemo(() => {
    if (isCustomSelected && customQuantity && parseInt(customQuantity) >= 100) {
      return parseInt(customQuantity);
    }
    return selectedTier?.quantity || 0;
  }, [selectedTier?.quantity, isCustomSelected, customQuantity]);

  const handleContinue = () => {
    let quantity: number;
    let price: number;
    let pricePerUnit: number;

    if (isCustomSelected && customQuantity && parseInt(customQuantity) >= 100) {
      quantity = parseInt(customQuantity);
      if (product.pricingTiers.length === 0) {
        alert("No plans available at the moment");
        return;
      }
      price = getCustomPrice(quantity);
      pricePerUnit = price / quantity;
    } else {
      if (!selectedTier || !selectedTier.quantity) {
        alert("Please select a plan");
        return;
      }
      quantity = selectedTier.quantity;
      price = selectedTier.price;
      pricePerUnit = selectedTier.pricePerUnit;
    }

    const cfg = inputConfig[product.type] || inputConfig.followers;
    const platformName = product.platform.charAt(0).toUpperCase() + product.platform.slice(1);

    setPopupPlan({
      productId: product.id,
      productName: product.name,
      platform: product.platform,
      type: product.type,
      quantity,
      price,
      inputMode: cfg.inputMode,
      inputLabel: cfg.label,
      inputPlaceholder: cfg.placeholder.replace("{platform}", platformName.toLowerCase()),
    });
    setPopupOpen(true);
  };

  const platformName = product.platform.charAt(0).toUpperCase() + product.platform.slice(1);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      {/* Product Section — 2-column layout */}
      <section className="pt-8 sm:pt-10 pb-20 sm:pb-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-14">
            {/* LEFT COLUMN — Product info */}
            <div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] leading-tight tracking-tight mb-3 sm:mb-4">
                {product.name}
              </h1>
              <p className="text-sm sm:text-[15px] text-[#4B5563] leading-relaxed mb-6 sm:mb-8">
                {product.description}
              </p>

              {/* Bullet points */}
              <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                {["Smart-Paced Delivery — organic growth curve", "Non-Intrusive Integration — no credentials needed", "Dedicated Growth Specialists — 24/7", "Risk-Free Compliance Protocol"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FF4B6A]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF4B6A]" />
                    </div>
                    <span className="text-sm sm:text-[15px] font-medium text-[#111827]">{item}</span>
                  </div>
                ))}
              </div>

              {/* Trust block */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 mb-6 sm:mb-8">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#FBBF24] text-[#FBBF24]" />
                    ))}
                  </div>
                  <span className="text-sm sm:text-[15px] font-bold text-[#111827]">{avgRating}/5</span>
                </div>
                <p className="text-xs sm:text-sm text-[#4B5563]">
                  Trusted by <span className="font-semibold text-[#111827]">3,000+</span> verified campaigns
                </p>
              </div>

              {/* Why choose us - desktop only */}
              <div className="hidden lg:block">
                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-3 sm:mb-4">Platform Technology</h3>
                <div className="space-y-2.5 sm:space-y-3">
                  {product.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 sm:gap-3">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4B6A] mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-[#4B5563] font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — Plan selection */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-3 sm:pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg sm:text-xl font-bold text-[#111827]">Select your growth campaign</h2>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#FF4B6A] bg-[#FF4B6A]/10 px-2.5 sm:px-3 py-1.5 rounded-full">
                      <Zap className="w-3 h-3.5 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden sm:inline">{product.deliveryTime}</span>
                      <span className="sm:hidden">Fast</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4B5563]">Choose the engagement volume that fits your growth objective</p>
                </div>

                {/* Pricing grid */}
                <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    {product.pricingTiers.map((tier) => {
                      const isSelected = !isCustomSelected && selectedTier.quantity === tier.quantity;
                      const bestUnitPrice = product.pricingTiers.length > 0
                        ? product.pricingTiers[product.pricingTiers.length - 1].pricePerUnit
                        : 0;
                      const worstUnitPrice = product.pricingTiers.length > 0
                        ? product.pricingTiers[0].pricePerUnit
                        : 0;
                      const savingsPercent = worstUnitPrice > 0
                        ? Math.round(((worstUnitPrice - tier.pricePerUnit) / worstUnitPrice) * 100)
                        : 0;

                      return (
                        <button
                          key={tier.quantity}
                          type="button"
                          onClick={() => {
                            setSelectedTier(tier);
                            setIsCustomSelected(false);
                          }}
                          className={`relative rounded-xl p-3 sm:p-4 text-left transition-all duration-200 ${
                            isSelected
                              ? "bg-white border-2 border-[#FF4B6A] shadow-[0_0_0_3px_rgba(255,75,106,0.1)]"
                              : "bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#FF4B6A]/40 hover:bg-white"
                          }`}
                        >
                          {/* Most Popular badge */}
                          {tier.popular && (
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                              <span className="bg-[#FF4B6A] text-white text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                                Most Popular
                              </span>
                            </div>
                          )}

                          {/* Save badge */}
                          {savingsPercent > 0 && (
                            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                              <span className="bg-[#FF4B6A] text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md">
                                -{savingsPercent}%
                              </span>
                            </div>
                          )}

                          {/* Selected check */}
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 z-10">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FF4B6A] flex items-center justify-center shadow-sm border-2 border-white">
                                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                              </div>
                            </div>
                          )}

                          <div className={`${tier.popular ? "mt-1.5 sm:mt-2" : ""}`}>
                            <div className="text-xs font-semibold text-[#4B5563] mb-1.5">
                              {tier.quantity.toLocaleString("en-US")} {typeLabel[product.type] || product.type}
                            </div>
                            <div className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                              {formatUSD(tier.price)}
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    {/* Custom Plan Card */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomSelected(true);
                        if (product.pricingTiers.length > 0) setSelectedTier(product.pricingTiers[0]);
                      }}
                      className={`relative rounded-xl p-3 sm:p-4 text-left transition-all duration-200 ${
                        isCustomSelected
                          ? "bg-white border-2 border-[#FF4B6A] shadow-[0_0_0_3px_rgba(255,75,106,0.1)]"
                          : "bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#FF4B6A]/40 hover:bg-white"
                      }`}
                    >
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                        <span className="bg-[#111827] text-white text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap shadow-sm flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">Custom Plan</span>
                          <span className="sm:hidden">Custom</span>
                        </span>
                      </div>

                      {isCustomSelected && (
                        <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 z-10">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FF4B6A] flex items-center justify-center shadow-sm border-2 border-white">
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                          </div>
                        </div>
                      )}

                      <div className="mt-2.5 sm:mt-3 text-center">
                        <input
                          type="number"
                          min="100"
                          max="1000000"
                          value={customQuantity}
                          onChange={(e) => {
                            setCustomQuantity(e.target.value);
                            setIsCustomSelected(true);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Enter quantity"
                          className="w-full text-center text-lg sm:text-xl font-extrabold text-[#111827] bg-white rounded-lg border border-[#E5E7EB] focus:border-[#FF4B6A] focus:ring-2 focus:ring-[#FF4B6A]/20 outline-none py-1.5 sm:py-2 px-2.5 sm:px-3 mb-1.5 sm:mb-2 placeholder:text-[#111827]/25 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <div className="text-xs text-[#4B5563] mb-1.5 sm:mb-2">
                          {typeLabel[product.type] || product.type} &bull; 100 – 1,000,000
                        </div>
                        {customQuantity && parseInt(customQuantity) >= 100 && parseInt(customQuantity) <= 1000000 && product.pricingTiers.length > 0 ? (
                          <div className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                            {formatUSD(getCustomPrice(parseInt(customQuantity)))}
                          </div>
                        ) : customQuantity && parseInt(customQuantity) < 100 ? (
                          <div className="text-xs sm:text-sm text-red-500 font-medium">Minimum 100 units</div>
                        ) : customQuantity && parseInt(customQuantity) > 1000000 ? (
                          <div className="text-xs sm:text-sm text-red-500 font-medium">Maximum 1,000,000 units</div>
                        ) : (
                          <div className="text-xs sm:text-sm text-[#4B5563]">Enter your quantity</div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>


                {/* Summary + CTA */}
                <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
                  <div className="bg-[#F9FAFB] rounded-xl p-4 sm:p-5 border border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm text-[#4B5563] mb-1">Your campaign</div>
                        <div className="text-xs sm:text-sm font-semibold text-[#111827] truncate">
                          {currentQuantity.toLocaleString("en-US")} {typeLabel[product.type] || product.type}
                          {isCustomSelected && customQuantity ? " (Custom)" : ""}
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <div className="text-2xl sm:text-3xl font-extrabold text-[#111827]">{formatUSD(currentPrice)}</div>
                      </div>
                    </div>

                    <button
                      onClick={handleContinue}
                      disabled={currentPrice <= 0}
                      className="w-full bg-[#FF4B6A] hover:bg-[#E8435F] disabled:bg-[#E5E7EB] disabled:text-[#4B5563] disabled:cursor-not-allowed text-white font-bold text-[15px] h-12 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-center justify-center gap-2 sm:gap-4 mt-3 sm:mt-4 text-xs text-[#4B5563] flex-wrap">
                      <span className="flex items-center gap-1"><Shield className="w-3 h-3.5" /> <span className="hidden sm:inline">Compliance Protocol</span><span className="sm:hidden">Compliance</span></span>
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3.5" /> <span className="hidden sm:inline">{product.deliveryTime}</span><span className="sm:hidden">Fast</span></span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3.5" /> <span className="hidden sm:inline">Growth Specialists</span><span className="sm:hidden">Support</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features — mobile only */}
              <div className="lg:hidden mt-4 sm:mt-6 bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6">
                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-3 sm:mb-4">Platform Technology</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 sm:gap-3">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4B6A] mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-[#4B5563] font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] mb-3">
              Customer Reviews
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-bold text-[#111827]">{avgRating}</span>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#FBBF24] fill-[#FBBF24]" />
                  ))}
                </div>
                <p className="text-sm text-[#4B5563]">Based on {reviews.length * 250}+ reviews</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[#F9FAFB] rounded-2xl p-6 border border-[#E5E7EB] transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex gap-0.5 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-[#FBBF24] fill-[#FBBF24]" : "text-[#E5E7EB]"}`}
                        />
                      ))}
                    </div>
                    <p className="font-bold text-[#111827] text-[15px]">{review.author}</p>
                  </div>
                  {review.verified && (
                    <span className="text-[11px] bg-green-50 text-green-700 px-2 py-1 rounded-full font-semibold border border-green-200">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#4B5563] leading-relaxed mb-2">{review.comment}</p>
                <p className="text-xs text-[#4B5563]/60">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Features />
      <FAQ />
      <CTA />
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
