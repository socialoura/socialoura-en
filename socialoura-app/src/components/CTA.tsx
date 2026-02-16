import { ArrowRight, Zap, Shield, Check } from "lucide-react";
import Link from "next/link";

const steps = [
  { icon: <Check className="w-4 h-4" />, text: "Choose your social network" },
  { icon: <Zap className="w-4 h-4" />, text: "Select the quantity you need" },
  { icon: <Shield className="w-4 h-4" />, text: "Fast, secure delivery" },
];

export default function CTA() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-[#FF4B6A] p-10 sm:p-14 shadow-[0_20px_60px_-20px_rgba(255,75,106,0.4)]">
        {/* Decorative */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full" />

        <div className="relative text-center">
          <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-6">
            Build Your Plan
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
            Grow your audience with real, active promotion services
          </h2>

          <p className="text-white/70 text-sm sm:text-base mb-8 max-w-2xl mx-auto leading-relaxed">
            Pick your network, choose a quantity, and watch your profile grow. Premium quality, 100% safe and private.
          </p>

          {/* Steps */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white/80 text-sm font-medium">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  {step.icon}
                </div>
                <span>{step.text}</span>
              </div>
            ))}
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-[#FF4B6A] font-bold text-lg px-8 py-4 rounded-full md:hover:bg-gray-50 md:hover:shadow-xl md:hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
