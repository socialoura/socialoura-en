"use client";

import { Star, Quote, TrendingUp, Users, Shield, Award } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    name: "Sophie M.",
    platform: "Instagram",
    rating: 5,
    comment: "Service incroyable ! J'ai reçu mes abonnés en quelques minutes et ils sont tous réels et actifs. Mon compte a vraiment décollé depuis.",
    followers: "+2.5K",
    date: "Il y a 2 jours",
  },
  {
    name: "Thomas L.",
    platform: "TikTok",
    rating: 5,
    comment: "La meilleure qualité que j'ai trouvée en France. Pas de bots, que des vrais profils qui interagissent avec mon contenu. Je recommande à 100%.",
    followers: "+5K",
    date: "Il y a 5 jours",
  },
  {
    name: "Emma D.",
    platform: "YouTube",
    rating: 5,
    comment: "Livraison instantanée et service client au top. J'ai eu un petit souci et ils ont répondu en moins de 10 minutes. Très professionnel !",
    followers: "+1K",
    date: "Il y a 1 semaine",
  },
  {
    name: "Lucas B.",
    platform: "Instagram",
    rating: 5,
    comment: "J'étais sceptique au début mais après avoir testé, je suis bluffé. Les abonnés restent et interagissent vraiment. Aucun risque pour mon compte.",
    followers: "+3K",
    date: "Il y a 1 semaine",
  },
  {
    name: "Chloé R.",
    platform: "TikTok",
    rating: 5,
    comment: "Site sérieux et fiable. J'ai commandé plusieurs fois et c'est toujours parfait. Les prix sont corrects et la qualité est au rendez-vous.",
    followers: "+4.2K",
    date: "Il y a 2 semaines",
  },
  {
    name: "Alexandre P.",
    platform: "YouTube",
    rating: 5,
    comment: "Excellent service ! Mon nombre d'abonnés a explosé et ma chaîne gagne en visibilité. Merci pour votre professionnalisme.",
    followers: "+800",
    date: "Il y a 3 semaines",
  },
];

const stats = [
  { icon: <Users className="w-6 h-6" />, value: "500K+", label: "Clients satisfaits" },
  { icon: <TrendingUp className="w-6 h-6" />, value: "5M+", label: "Commandes traitées" },
  { icon: <Star className="w-6 h-6" />, value: "4.9/5", label: "Note moyenne" },
  { icon: <Shield className="w-6 h-6" />, value: "100%", label: "Sécurisé" },
];

const platformColors: Record<string, string> = {
  Instagram: "from-purple-500 to-pink-500",
  TikTok: "from-black to-cyan-500",
  YouTube: "from-red-500 to-red-600",
  Facebook: "from-blue-500 to-blue-600",
};

export default function AvisPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-purple-50/20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMTAgNjAgTSAwIDEwIEwgNjAgMTAgTSAyMCAwIEwgMjAgNjAgTSAwIDIwIEwgNjAgMjAgTSAzMCAwIEwgMzAgNjAgTSAwIDMwIEwgNjAgMzAgTSA0MCAwIEwgNDAgNjAgTSAwIDQwIEwgNjAgNDAgTSA1MCAwIEwgNTAgNjAgTSAwIDUwIEwgNjAgNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-full mb-6">
            <Award className="w-4 h-4" />
            Avis clients
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Ce que nos clients <span className="gradient-text">disent de nous</span>
          </h1>
          
          <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-12">
            Plus de 500 000 clients nous font confiance pour booster leur présence sur les réseaux sociaux.
            Découvrez leurs témoignages authentiques.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-[0_14px_40px_-22px_rgba(15,23,42,0.35)]"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                  {stat.icon}
                </div>
                <div className="text-2xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-[0_14px_40px_-22px_rgba(15,23,42,0.35)] md:hover:shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)] transition-all duration-300 md:hover:-translate-y-1 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
                    <div className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${platformColors[testimonial.platform]} text-white`}>
                      {testimonial.platform}
                    </div>
                  </div>
                  <Quote className="w-8 h-8 text-orange-500/20" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                  {testimonial.comment}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">{testimonial.date}</span>
                  <span className="text-sm font-bold text-orange-600">{testimonial.followers}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-500 p-10 sm:p-14 shadow-[0_20px_60px_-20px_rgba(249,115,22,0.5)]">
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full" />
            
            <div className="relative text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                Rejoignez nos 500 000+ clients satisfaits
              </h2>
              <p className="text-white/80 text-base mb-8 max-w-2xl mx-auto">
                Commencez dès maintenant à booster votre présence sur les réseaux sociaux avec des followers réels et actifs.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-full md:hover:bg-gray-50 transition-all duration-300 shadow-lg md:hover:shadow-xl md:hover:scale-105 active:scale-95"
              >
                Commencer maintenant
                <TrendingUp className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
