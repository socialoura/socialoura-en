"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Les profils que vous recevez sont-ils réels et actifs ?",
    answer:
      "Oui, tous nos profils sont 100% réels et actifs. Nous ne fournissons jamais de bots ou de faux comptes. Chaque profil est vérifié pour garantir la meilleure qualité possible.",
  },
  {
    question: "Pourquoi choisir une qualité française ?",
    answer:
      "Nos services sont optimisés pour le marché français. Nous comprenons les spécificités de l'algorithme et proposons des profils francophones qui interagissent naturellement avec votre contenu.",
  },
  {
    question: "Y a-t-il un risque à passer commande sur votre site ?",
    answer:
      "Absolument aucun risque. Nos méthodes sont 100% sûres et conformes aux conditions d'utilisation des réseaux sociaux. Votre compte ne sera jamais mis en danger.",
  },
  {
    question: "Est-ce qu'il y a un abonnement après la commande ?",
    answer:
      "Non, il n'y a aucun abonnement caché. Vous payez uniquement pour le service commandé. Pas de frais récurrents ni de surprises.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
            Questions fréquentes
          </h2>
          <p className="text-gray-500 mt-3 text-sm sm:text-base">
            Nous avons rassemblé pour vous les réponses aux questions les plus fréquentes.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="faq-item border border-gray-200 rounded-xl overflow-hidden bg-white"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800 text-sm sm:text-base pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180 text-orange-500" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === idx ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
