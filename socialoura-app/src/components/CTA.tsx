import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl bg-orange-gradient p-10 sm:p-14">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 right-10 w-32 h-32 bg-white/5 rounded-full" />

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text content */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Obtenez des followers réels et actifs garantis en quelques secondes !
            </h2>
            <p className="text-white/80 text-sm sm:text-base mb-6 leading-relaxed">
              La meilleure qualité, rien de plus. 100% sans risque et parfaitement
              anonyme. Livraison immédiate.
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Créer mon pack
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Decorative image placeholder */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-64 h-64 bg-white/15 rounded-3xl flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <p className="text-white/80 text-sm font-medium">+10K followers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
