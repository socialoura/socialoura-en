"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { Star, Check, Shield, Zap, Clock, ShoppingCart, Lock } from "lucide-react";
import { getRandomReviews, getAverageRating } from "@/data/reviews";
import Navbar from "./Navbar";
import Features from "./Features";
import FAQ from "./FAQ";
import CTA from "./CTA";
import Footer from "./Footer";

interface ProductPageProps {
  product: Product;
}

export default function ProductPage({ product }: ProductPageProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTier, setSelectedTier] = useState(
    product.pricingTiers.find((t) => t.popular) || product.pricingTiers[0]
  );
  const [username, setUsername] = useState("");
  const reviews = useMemo(() => getRandomReviews(4, product.id), [product.id]);
  const avgRating = useMemo(() => getAverageRating(), []);

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(selectedTier.price);
  }, [selectedTier.price]);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!username.trim()) {
        alert("Veuillez entrer votre nom d'utilisateur");
        return;
      }
      router.push("/checkout");
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
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
              <div className="p-6 sm:p-8 border-b border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900">Choisissez votre pack</h2>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
                    <Zap className="w-3.5 h-3.5 text-orange-500" />
                    {product.deliveryTime}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {product.pricingTiers.map((tier) => {
                    const isSelected = selectedTier.quantity === tier.quantity;
                    return (
                      <button
                        key={tier.quantity}
                        type="button"
                        onClick={() => setSelectedTier(tier)}
                        className={`relative p-4 rounded-2xl border-2 text-center transition-all duration-300 ease-in-out active:scale-[0.98] ${
                          isSelected
                            ? "border-orange-500 bg-orange-50 shadow-md"
                            : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        {tier.popular && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black whitespace-nowrap">
                            Populaire
                          </span>
                        )}
                        <div className="text-lg sm:text-xl font-black text-gray-900">
                          {tier.quantity.toLocaleString()}
                        </div>
                        <div className="text-xs font-semibold text-gray-500 mt-1">
                          {tier.pricePerUnit.toFixed(3)}€/u
                        </div>
                        <div className="text-sm font-bold text-orange-600 mt-2">
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(tier.price)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Username input (appears after clicking Continue) */}
              {step === 2 && (
                <div className="p-6 sm:p-8 border-b border-gray-200 bg-orange-50/30 animate-scale-in">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-gray-900">Saisie des informations</h3>
                      <p className="mt-1 text-sm text-gray-600 font-medium">
                        Nous ne demanderons jamais votre mot de passe.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      Sécurisé
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Votre nom d'utilisateur {product.platform}
                    </label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="@pseudo"
                      className="w-full h-12 px-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 font-medium outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 ease-in-out"
                      inputMode="text"
                      autoComplete="off"
                      autoFocus
                    />
                    <p className="mt-2 text-xs text-gray-500">Ex: @moncompte</p>
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8 bg-gray-50">
                <div className="flex items-end justify-between gap-4 mb-5">
                  <div>
                    <div className="text-sm font-semibold text-gray-600">Total</div>
                    <div className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
                      {formattedPrice}
                    </div>
                    <div className="text-xs font-semibold text-gray-500 mt-1">
                      {selectedTier.quantity.toLocaleString()} {product.type} • {product.guarantee}
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-2xl px-3 py-2">
                    <Shield className="w-4 h-4 text-orange-500" />
                    Paiement sécurisé
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  disabled={step === 2 && !username.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 disabled:from-gray-600 disabled:via-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold px-6 py-4 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {step === 1 ? "Continuer" : "Passer au paiement"}
                </button>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center justify-center gap-1 bg-white rounded-2xl border border-gray-200 p-3">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <span className="text-[11px] font-bold text-gray-700 text-center">{product.deliveryTime}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 bg-white rounded-2xl border border-gray-200 p-3">
                    <Shield className="w-5 h-5 text-orange-500" />
                    <span className="text-[11px] font-bold text-gray-700 text-center">{product.guarantee}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 bg-white rounded-2xl border border-gray-200 p-3">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span className="text-[11px] font-bold text-gray-700 text-center">24/7</span>
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
