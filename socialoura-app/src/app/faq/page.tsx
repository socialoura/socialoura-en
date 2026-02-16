import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <section className="py-16 bg-gradient-to-b from-[#F9FAFB] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-[#FF4B6A]/10 text-[#FF4B6A] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Help Center
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#4B5563] text-base sm:text-lg max-w-2xl mx-auto">
            Find quick answers to the most common questions about
            our services and platform.
          </p>
        </div>
      </section>

      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
