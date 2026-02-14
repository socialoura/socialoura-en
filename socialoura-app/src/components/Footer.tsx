import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-white text-gray-700 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/3 via-pink-600/3 to-orange-500/3 pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="group flex items-center gap-2.5 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-base">S</span>
                </div>
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">
                Social<span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">Oura</span>
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-5 font-medium">
              Outil en ligne instantané pour augmenter la popularité sur les réseaux sociaux.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-5">
              <Lock className="w-3.5 h-3.5" />
              <span className="font-semibold">Avis de nos clients indépendants</span>
            </div>
            {/* Payment methods - Horizontal row */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Moyens de paiement</h4>
              <div className="flex items-center gap-2">
                <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm">
                  <Image
                    src="/payment_methods/visa.svg"
                    alt="Visa"
                    width={40}
                    height={25}
                  />
                </div>
                <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm">
                  <Image
                    src="/payment_methods/mastercard.svg"
                    alt="Mastercard"
                    width={40}
                    height={25}
                  />
                </div>
                <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm">
                  <Image
                    src="/payment_methods/apple-pay.svg"
                    alt="Apple Pay"
                    width={40}
                    height={25}
                  />
                </div>
                <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm">
                  <Image
                    src="/payment_methods/google-pay.svg"
                    alt="Google Pay"
                    width={50}
                    height={25}
                  />
                </div>
              </div>
              {/* Trust badges */}
              <div className="flex items-center gap-2 pt-2">
                <Image
                  src="/payment_methods/norton.svg"
                  alt="Norton Secured"
                  width={60}
                  height={30}
                  className="opacity-80 hover:opacity-100 transition-opacity"
                />
                <Image
                  src="/payment_methods/verified.svg"
                  alt="Verified"
                  width={60}
                  height={30}
                  className="opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gray-900 font-black text-sm uppercase tracking-wider mb-4">
              Nos services
            </h3>
            <ul className="space-y-2.5">
              {["Instagram", "TikTok", "YouTube", "Facebook"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 hover:bg-clip-text text-sm transition-all duration-300 font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful links */}
          <div>
            <h3 className="text-gray-900 font-black text-sm uppercase tracking-wider mb-4">
              Liens utiles
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 hover:bg-clip-text text-sm transition-all duration-300 font-medium"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 hover:bg-clip-text text-sm transition-all duration-300 font-medium"
                >
                  Avis
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 hover:bg-clip-text text-sm transition-all duration-300 font-medium"
                >
                  Conditions générales de vente
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 hover:bg-clip-text text-sm transition-all duration-300 font-medium"
                >
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-black text-sm uppercase tracking-wider mb-4">
              Contactez-nous
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 hover:bg-clip-text text-sm transition-all duration-300 font-medium"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs font-semibold">
            &copy; 2025 SocialOura &middot; Tous droits réservés
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="#" className="hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text transition-all duration-300 font-medium">
              Conditions générales de vente
            </Link>
            <span>&middot;</span>
            <Link href="#" className="hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text transition-all duration-300 font-medium">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
