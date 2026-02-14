"use client";

import { Zap, Shield, UserCheck, Award } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-7 h-7 text-orange-500" />,
    title: "Livraison instantanée",
    description:
      "Nous traitons et délivrons toutes les commandes immédiatement après la réalisation du paiement, sans aucun délai d'attente.",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-100",
  },
  {
    icon: <Shield className="w-7 h-7 text-orange-500" />,
    title: "Garantie à vie",
    description:
      "Tous nos services sont couverts par une garantie à vie. En cas de problème, nous interviendrons immédiatement et gratuitement.",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-100",
  },
  {
    icon: <UserCheck className="w-7 h-7 text-orange-500" />,
    title: "Profils réels et actifs",
    description:
      "Nous vous garantissons des profils réels et actifs. En cas de doute, n'hésitez pas à nous contacter.",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-100",
  },
  {
    icon: <Award className="w-7 h-7 text-orange-500" />,
    title: "La meilleure qualité en France",
    description:
      "Nous offrons le plus haut niveau de profils sur les réseaux sociaux en France. Avec un service premium, obtenez des résultats à la carte.",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-100",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-light relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Pourquoi nous choisir ?
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Le <span className="gradient-text">meilleur site</span> pour booster
            vos réseaux sociaux en France
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            Plus de 500 000+ clients nous font confiance et nous avons déjà traité plus de
            5 000 000 de commandes. Notre service est noté en moyenne de 4.9/5.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`card-hover ${feature.bgColor} border ${feature.borderColor} rounded-2xl p-7 flex flex-col gap-4`}
            >
              <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
