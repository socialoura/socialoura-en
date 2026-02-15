"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { Star, Check, Shield, Zap, Clock, ShoppingCart, Lock, Sparkles } from "lucide-react";
import { getRandomReviews, getAverageRating } from "@/data/reviews";
import { useCart } from "@/contexts/CartContext";
import Navbar from "./Navbar";
import Features from "./Features";
import FAQ from "./FAQ";
import CTA from "./CTA";
import Footer from "./Footer";

interface ProductPageProps {
  product: Product;
}

export default function ProductPage({ product: initialProduct }: ProductPageProps) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const [product, setProduct] = useState(initialProduct);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTier, setSelectedTier] = useState(
    product.pricingTiers.find((t) => t.popular) || product.pricingTiers[0]
  );
  const [username, setUsername] = useState("");
  const [customQuantity, setCustomQuantity] = useState<string>("");
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const reviews = useMemo(() => getRandomReviews(4, product.id), [product.id]);
  const avgRating = useMemo(() => getAverageRating(), []);

  // Fetch dynamic packs from API
  useEffect(() => {
    async function fetchPacks() {
      try {
        const response = await fetch(
          `/api/packs?platform=${product.platform}&type=${product.type}`
        );
        const data = await response.json();
        
        if (data.pricingTiers && data.pricingTiers.length > 0) {
          setProduct(prev => ({
            ...prev,
            pricingTiers: data.pricingTiers,
          }));
          
          // Update selected tier if needed
          const popularTier = data.pricingTiers.find((t: any) => t.popular);
          setSelectedTier(popularTier || data.pricingTiers[0]);
        }
      } catch (error) {
        console.error('Error fetching packs:', error);
      }
    }
    
    fetchPacks();
  }, [product.platform, product.type]);

  const platformTheme = useMemo(() => {
    const platform = product.platform.toLowerCase();
    if (platform.includes('instagram')) {
      return {
        primary: 'from-pink-500 via-purple-500 to-orange-500',
        secondary: 'from-pink-600 via-purple-600 to-orange-600',
        accent: 'pink-500',
        accentDark: 'pink-600',
        light: 'pink-50',
        border: 'pink-300',
        text: 'pink-700',
        shadow: 'pink-500/30',
        glow: 'pink-500/50',
      };
    } else if (platform.includes('tiktok')) {
      return {
        primary: 'from-cyan-400 via-blue-500 to-purple-600',
        secondary: 'from-cyan-500 via-blue-600 to-purple-700',
        accent: 'cyan-500',
        accentDark: 'cyan-600',
        light: 'cyan-50',
        border: 'cyan-300',
        text: 'cyan-700',
        shadow: 'cyan-500/30',
        glow: 'cyan-500/50',
      };
    } else if (platform.includes('youtube')) {
      return {
        primary: 'from-red-500 via-red-600 to-red-700',
        secondary: 'from-red-600 via-red-700 to-red-800',
        accent: 'red-500',
        accentDark: 'red-600',
        light: 'red-50',
        border: 'red-300',
        text: 'red-700',
        shadow: 'red-500/30',
        glow: 'red-500/50',
      };
    } else if (platform.includes('facebook')) {
      return {
        primary: 'from-blue-500 via-blue-600 to-indigo-600',
        secondary: 'from-blue-600 via-blue-700 to-indigo-700',
        accent: 'blue-500',
        accentDark: 'blue-600',
        light: 'blue-50',
        border: 'blue-300',
        text: 'blue-700',
        shadow: 'blue-500/30',
        glow: 'blue-500/50',
      };
    }
    return {
      primary: 'from-purple-500 via-pink-500 to-orange-500',
      secondary: 'from-purple-600 via-pink-600 to-orange-600',
      accent: 'purple-500',
      accentDark: 'purple-600',
      light: 'purple-50',
      border: 'purple-300',
      text: 'purple-700',
      shadow: 'purple-500/30',
      glow: 'purple-500/50',
    };
  }, [product.platform]);

  const formattedPrice = useMemo(() => {
    let price;
    
    if (isCustomSelected && customQuantity && parseInt(customQuantity) >= 100) {
      // Calculate custom price
      const quantity = parseInt(customQuantity);
      const pricePerUnit = product.pricingTiers[product.pricingTiers.length - 1].pricePerUnit;
      price = quantity * pricePerUnit;
    } else {
      // Use selected tier price
      price = selectedTier.price;
    }
    
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(price);
  }, [selectedTier.price, isCustomSelected, customQuantity, product.pricingTiers]);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!username.trim()) {
        alert("Veuillez entrer votre nom d'utilisateur");
        return;
      }
      
      // Determine quantity and price
      let quantity, price, pricePerUnit;
      
      if (isCustomSelected && customQuantity && parseInt(customQuantity) >= 100) {
        // Custom quantity selected
        quantity = parseInt(customQuantity);
        pricePerUnit = product.pricingTiers[product.pricingTiers.length - 1].pricePerUnit;
        price = quantity * pricePerUnit;
      } else {
        // Standard tier selected
        quantity = selectedTier.quantity;
        price = selectedTier.price;
        pricePerUnit = selectedTier.pricePerUnit;
      }
      
      // Add item to cart
      const cartItem = {
        id: `${product.id}-${quantity}-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        platform: product.platform,
        quantity: quantity,
        price: price,
        pricePerUnit: pricePerUnit,
        username: username,
      };
      
      addItem(cartItem);
      openCart();
      
      // Reset form
      setStep(1);
      setUsername("");
      setCustomQuantity("");
      setIsCustomSelected(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Product Section */}
      <section className="pt-10 pb-28 sm:pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-gray-200 shadow-sm mb-5">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-green-500 fill-green-500" />
                <span className="text-sm font-bold text-gray-900">{avgRating}</span>
              </div>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm font-medium text-gray-600">{reviews.length * 250}+ avis</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm font-semibold text-orange-600">100% réels</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 leading-tight">
              Acheter des {product.name}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Step 1: Pack selection */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 shadow-2xl overflow-hidden">
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Choisissez votre pack</h2>
                    <p className="text-sm text-gray-600 font-medium">Sélectionnez la quantité qui vous convient</p>
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-bold bg-gradient-to-r ${platformTheme.primary} text-white rounded-full px-4 py-2 shadow-lg`}>
                    <Zap className="w-4 h-4" />
                    {product.deliveryTime}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {product.pricingTiers.map((tier, index) => {
                    const isSelected = !isCustomSelected && selectedTier.quantity === tier.quantity;
                    // Calculate savings percentage compared to smallest pack
                    const basePricePerUnit = product.pricingTiers[0].pricePerUnit;
                    const savingsPercent = Math.round(((basePricePerUnit - tier.pricePerUnit) / basePricePerUnit) * 100);
                    
                    return (
                      <button
                        key={tier.quantity}
                        type="button"
                        onClick={() => {
                          setSelectedTier(tier);
                          setIsCustomSelected(false);
                        }}
                        className={`relative p-6 rounded-3xl text-center transition-all duration-300 group ${
                          isSelected
                            ? 'bg-white shadow-2xl scale-105 ring-4 ring-offset-2 ring-offset-gray-50'
                            : 'bg-white shadow-lg hover:shadow-2xl hover:scale-105 border-2 border-gray-100'
                        } ${isSelected ? `ring-${platformTheme.accent}` : ''}`}
                      >
                        {/* Gradient background overlay when selected */}
                        {isSelected && (
                          <div className={`absolute inset-0 bg-gradient-to-br ${platformTheme.primary} opacity-10 pointer-events-none`} />
                        )}
                        
                        {tier.popular && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                            <div className={`bg-gradient-to-r ${platformTheme.secondary} text-white text-xs px-4 py-1.5 rounded-full font-black shadow-xl flex items-center gap-1 border-2 border-white`}>
                              <Star className="w-3 h-3 fill-white" />
                              <span>Populaire</span>
                            </div>
                          </div>
                        )}
                        
                        {savingsPercent > 0 && (
                          <div className="absolute top-3 right-3 z-10">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white text-xs px-3 py-1.5 rounded-xl font-black shadow-xl border-2 border-white animate-pulse">
                              -{savingsPercent}%
                            </div>
                          </div>
                        )}
                        
                        <div className="relative z-10">
                          <div className={`text-3xl sm:text-4xl font-black mb-3 ${
                            isSelected ? `bg-gradient-to-r ${platformTheme.secondary} bg-clip-text text-transparent` : 'text-gray-900'
                          }`}>
                            {tier.quantity.toLocaleString()}
                          </div>
                          
                          {savingsPercent > 0 ? (
                            <div className="mb-4">
                              <div className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl ${
                                isSelected ? `bg-gradient-to-r ${platformTheme.primary} text-white shadow-lg` : 'bg-green-50 text-green-700 border-2 border-green-200'
                              }`}>
                                <Check className="w-3.5 h-3.5" />
                                Économisez {savingsPercent}%
                              </div>
                            </div>
                          ) : (
                            <div className="mb-4">
                              <div className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-xl bg-gray-100 text-gray-500">
                                Pack de base
                              </div>
                            </div>
                          )}
                          
                          <div className={`text-xl sm:text-2xl font-black ${
                            isSelected ? `bg-gradient-to-r ${platformTheme.secondary} bg-clip-text text-transparent` : 'text-gray-900'
                          }`}>
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(tier.price)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  
                  {/* Custom Amount Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSelected(true);
                      setSelectedTier(product.pricingTiers[0]); // Fallback
                    }}
                    className={`relative p-6 rounded-3xl text-center transition-all duration-300 group ${
                      isCustomSelected
                        ? 'bg-white shadow-2xl scale-105 ring-4 ring-offset-2 ring-offset-gray-50'
                        : 'bg-white shadow-lg hover:shadow-2xl hover:scale-105 border-2 border-gray-100'
                    } ${isCustomSelected ? `ring-${platformTheme.accent}` : ''}`}
                  >
                    {isCustomSelected && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${platformTheme.primary} opacity-10 pointer-events-none`} />
                    )}
                    
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-4 py-1.5 rounded-full font-black shadow-xl flex items-center gap-1 border-2 border-white">
                        <Sparkles className="w-3 h-3" />
                        <span>Custom</span>
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="text-lg font-black text-gray-900 mb-3">
                        Quantité personnalisée
                      </div>
                      
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
                        placeholder="0"
                        className={`w-full text-3xl sm:text-4xl font-black text-center border-b-4 bg-transparent outline-none mb-3 ${
                          isCustomSelected ? `border-${platformTheme.accent}` : 'border-gray-300'
                        }`}
                      />
                      
                      {customQuantity && parseInt(customQuantity) >= 100 ? (
                        <>
                          <div className="mb-4">
                            <div className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl ${
                              isCustomSelected ? `bg-gradient-to-r ${platformTheme.primary} text-white shadow-lg` : 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                            }`}>
                              <Check className="w-3.5 h-3.5" />
                              Prix sur mesure
                            </div>
                          </div>
                          <div className={`text-xl sm:text-2xl font-black ${
                            isCustomSelected ? `bg-gradient-to-r ${platformTheme.secondary} bg-clip-text text-transparent` : 'text-gray-900'
                          }`}>
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(
                              // Calculate price based on best unit price from largest tier
                              parseInt(customQuantity) * product.pricingTiers[product.pricingTiers.length - 1].pricePerUnit
                            )}
                          </div>
                        </>
                      ) : customQuantity && parseInt(customQuantity) < 100 ? (
                        <div className="text-xs text-red-600 font-bold">
                          Minimum 100 unités
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 font-semibold">
                          Entrez votre quantité
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Username input (appears after clicking Continue) */}
              {step === 2 && (
                <div className={`mt-6 p-6 sm:p-8 bg-gradient-to-br ${platformTheme.primary} bg-opacity-10 rounded-2xl border-2 border-${platformTheme.border} animate-scale-in`}>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900">Saisie des informations</h3>
                      <p className="mt-2 text-sm text-gray-600 font-semibold flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Nous ne demanderons jamais votre mot de passe
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-3">
                      Votre nom d'utilisateur {product.platform}
                    </label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="@pseudo"
                      className={`w-full h-14 px-5 rounded-2xl border-2 border-${platformTheme.border} bg-white text-gray-900 font-semibold text-lg outline-none focus:border-${platformTheme.accentDark} focus:ring-4 focus:ring-${platformTheme.shadow} transition-all duration-300 shadow-lg`}
                      inputMode="text"
                      autoComplete="off"
                      autoFocus
                    />
                    <p className="mt-3 text-xs text-gray-600 font-semibold">Ex: @moncompte</p>
                  </div>
                </div>
              )}

              <div className="mt-8 p-8 sm:p-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                {/* Urgency badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-orange-50 border-2 border-orange-200 text-orange-700 px-4 py-2 rounded-full text-xs font-black">
                    <Zap className="w-4 h-4" />
                    Livraison instantanée
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 border-2 border-green-200 text-green-700 px-4 py-2 rounded-full text-xs font-black">
                    <Check className="w-4 h-4" />
                    183 commandes aujourd'hui
                  </div>
                  <div className="flex items-center gap-2 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-2 rounded-full text-xs font-black animate-pulse">
                    <Clock className="w-4 h-4" />
                    Stock limité
                  </div>
                </div>
                
                <div className="flex items-center justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-600 mb-2">Total à payer</div>
                    <div className={`text-5xl sm:text-6xl font-black tracking-tight bg-gradient-to-r ${platformTheme.secondary} bg-clip-text text-transparent`}>
                      {formattedPrice}
                    </div>
                    <div className="text-sm font-bold text-gray-600 mt-3 flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {isCustomSelected && customQuantity && parseInt(customQuantity) >= 100
                        ? `${parseInt(customQuantity).toLocaleString()} ${product.type} (Custom)`
                        : `${selectedTier.quantity.toLocaleString()} ${product.type}`
                      }
                    </div>
                  </div>
                  <div className={`hidden sm:flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${platformTheme.primary} text-white rounded-2xl px-5 py-3 shadow-xl`}>
                    <Shield className="w-5 h-5" />
                    Sécurisé
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  disabled={step === 2 && !username.trim()}
                  className={`w-full bg-gradient-to-r ${platformTheme.secondary} hover:opacity-90 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-black px-8 py-5 rounded-2xl shadow-2xl shadow-${platformTheme.shadow} hover:shadow-${platformTheme.glow} hover:scale-[1.02] disabled:hover:scale-100 disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-3 text-lg uppercase tracking-wide`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {step === 1 ? "Continuer" : "Passer au paiement"}
                </button>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border-2 border-gray-200 p-4 hover:shadow-lg transition-all">
                    <Zap className={`w-6 h-6 text-${platformTheme.accent}`} />
                    <span className="text-xs font-black text-gray-700 text-center">{product.deliveryTime}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border-2 border-gray-200 p-4 hover:shadow-lg transition-all">
                    <Shield className={`w-6 h-6 text-${platformTheme.accent}`} />
                    <span className="text-xs font-black text-gray-700 text-center">{product.guarantee}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border-2 border-gray-200 p-4 hover:shadow-lg transition-all">
                    <Clock className={`w-6 h-6 text-${platformTheme.accent}`} />
                    <span className="text-xs font-black text-gray-700 text-center">24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features section */}
            <div className="mt-8 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-5">Pourquoi nous ?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {product.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200 transition-all duration-300 ease-in-out hover:-translate-y-1"
                  >
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-800 font-semibold leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              Avis des clients
            </h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-5xl font-bold text-gray-900">{avgRating}</span>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-orange-500 fill-orange-500"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">Basé sur {reviews.length * 250}+ avis</p>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-orange-500 fill-orange-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="font-bold text-gray-900">{review.author}</p>
                  </div>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      Vérifié
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-2">
                  {review.comment}
                </p>
                <p className="text-xs text-gray-400">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Features />
      <FAQ />
      <CTA />
      <Footer />

      {/* iOS-style sticky bottom action bar (mobile) */}
      <div className="fixed bottom-0 inset-x-0 sm:hidden z-50">
        <div className="backdrop-blur-xl bg-white/80 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-600">{selectedTier.quantity.toLocaleString()} • Total</div>
                <div className="text-lg font-black text-gray-900 truncate">{formattedPrice}</div>
              </div>
              <button
                onClick={handleContinue}
                disabled={step === 2 && !username.trim()}
                className="flex-shrink-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-wide"
              >
                {step === 1 ? "Continuer" : "Payer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
