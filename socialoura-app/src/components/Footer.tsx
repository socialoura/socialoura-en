import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#FFF7FA] border-t border-[#F1E4EA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Payment methods — prominent */}
        <div className="mb-12">
          <h4 className="text-xs font-bold text-[#111827]/40 uppercase tracking-wider mb-4 text-center">Accepted Payment Methods</h4>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { src: "/payment_methods/visa.svg", alt: "Visa", w: 50, h: 32 },
              { src: "/payment_methods/mastercard.svg", alt: "Mastercard", w: 50, h: 32 },
              { src: "/payment_methods/apple-pay.svg", alt: "Apple Pay", w: 50, h: 32 },
              { src: "/payment_methods/google-pay.svg", alt: "Google Pay", w: 60, h: 32 },
            ].map((pm) => (
              <div key={pm.alt} className="bg-white px-4 py-3 rounded-xl border border-[#F1E4EA] shadow-sm">
                <Image src={pm.src} alt={pm.alt} width={pm.w} height={pm.h} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 mt-4">
            <Image src="/payment_methods/norton.svg" alt="Norton Secured" width={70} height={35} className="opacity-70" />
            <Image src="/payment_methods/verified.svg" alt="Verified" width={70} height={35} className="opacity-70" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="group inline-block mb-4">
              <Image
                src="/logo.png"
                alt="SocialNovaly"
                width={130}
                height={52}
                className="object-contain"
                priority
              />
            </Link>
            <p className="text-[#111827]/50 text-sm leading-relaxed mb-4 font-medium max-w-xs">
              AI-powered social media growth platform. Safe, compliant, and data-driven.
            </p>
            <div className="flex items-center gap-2 text-[#111827]/30 text-xs">
              <Lock className="w-3.5 h-3.5" />
              <span className="font-semibold">100% Secure Payment</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[#111827] font-bold text-sm uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-2.5">
              {["Instagram", "TikTok", "YouTube", "Facebook"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[#111827]/50 hover:text-[#FF4B6A] text-sm transition-colors duration-200 font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="text-[#111827] font-bold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "FAQ", href: "/faq" },
                { label: "Reviews", href: "/avis" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[#111827]/50 hover:text-[#FF4B6A] text-sm transition-colors duration-200 font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal — dedicated column */}
          <div>
            <h3 className="text-[#111827] font-bold text-sm uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Terms of Service", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Refund Policy", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[#111827]/50 hover:text-[#FF4B6A] text-sm transition-colors duration-200 font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#F1E4EA] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#111827]/30 text-xs font-medium">
            &copy; 2025 SocialNovaly &middot; All rights reserved
          </p>
          <div className="flex items-center gap-4 text-xs text-[#111827]/30">
            <Link href="#" className="hover:text-[#FF4B6A] transition-colors duration-200 font-medium">
              Terms
            </Link>
            <span>&middot;</span>
            <Link href="#" className="hover:text-[#FF4B6A] transition-colors duration-200 font-medium">
              Privacy
            </Link>
            <span>&middot;</span>
            <Link href="#" className="hover:text-[#FF4B6A] transition-colors duration-200 font-medium">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
