import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Centre d&apos;aide
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Questions fréquentes
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions les plus courantes
            sur nos services et notre plateforme.
          </p>
        </div>
      </section>

      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
