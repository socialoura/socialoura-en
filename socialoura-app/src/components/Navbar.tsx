"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const platformMenus = {
  instagram: [
    { label: "Abonnés Instagram", href: "/products/instagram-followers" },
    { label: "Likes Instagram", href: "/products/instagram-likes" },
    { label: "Vues Instagram", href: "/products/instagram-views" },
  ],
  tiktok: [
    { label: "Abonnés TikTok", href: "/products/tiktok-followers" },
    { label: "Likes TikTok", href: "/products/tiktok-likes" },
    { label: "Vues TikTok", href: "/products/tiktok-views" },
  ],
  youtube: [
    { label: "Abonnés YouTube", href: "/products/youtube-subscribers" },
    { label: "Vues YouTube", href: "/products/youtube-views" },
    { label: "Likes YouTube", href: "/products/youtube-likes" },
  ],
  facebook: [
    { label: "Abonnés Facebook", href: "/products/facebook-followers" },
    { label: "Likes Facebook", href: "/products/facebook-likes" },
  ],
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const closeDropdownTimeoutRef = useRef<number | null>(null);
  const { itemCount, toggleCart } = useCart();
  const prevItemCountRef = useRef(itemCount);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Trigger bounce animation when item count changes
  useEffect(() => {
    if (itemCount > prevItemCountRef.current) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(timer);
    }
    prevItemCountRef.current = itemCount;
  }, [itemCount]);

  const clearCloseTimeout = () => {
    if (closeDropdownTimeoutRef.current) {
      window.clearTimeout(closeDropdownTimeoutRef.current);
      closeDropdownTimeoutRef.current = null;
    }
  };

  const openMenu = (menu: string) => {
    clearCloseTimeout();
    setOpenDropdown(menu);
  };

  const scheduleCloseMenu = () => {
    clearCloseTimeout();
    closeDropdownTimeoutRef.current = window.setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  return (
    <>
      {/* Premium promo bar */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white text-center py-2.5 px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative flex items-center justify-center gap-2 text-sm font-semibold">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="hidden sm:inline">OFFRE SPÉCIALE — RÉDUCTION DE 5% AVEC LE CODE</span>
          <span className="sm:hidden">-5% CODE</span>
          <span className="px-2 py-0.5 bg-white/20 rounded-md font-mono font-bold backdrop-blur-sm">TOP5</span>
        </div>
      </div>

      {/* Premium glassmorphism navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-effect shadow-lg border-b border-white/20"
          : "bg-white/80 backdrop-blur-md border-b border-gray-100/50"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Premium Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-gradient rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-10 h-10 bg-orange-gradient rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-300">
                  <span className="text-white font-black text-lg">S</span>
                </div>
              </div>
              <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Social<span className="gradient-text">Oura</span>
              </span>
            </Link>

            {/* Desktop nav - Premium dropdowns */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Instagram Dropdown - Premium */}
              <div
                className="relative"
                onMouseEnter={() => openMenu("instagram")}
                onMouseLeave={scheduleCloseMenu}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === "instagram"}
                  onClick={() =>
                    setOpenDropdown((prev) => (prev === "instagram" ? null : "instagram"))
                  }
                  className="relative text-slate-700 hover:text-orange-600 font-semibold text-sm transition-all duration-300 flex items-center gap-1.5 group py-2"
                >
                  Instagram
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-orange-gradient group-hover:w-full transition-all duration-300 rounded-full" />
                </button>
                {openDropdown === "instagram" && (
                  <div
                    className="absolute top-full left-0 mt-3 w-64 glass-effect rounded-2xl shadow-2xl border border-white/20 py-2 z-50 animate-scale-in"
                    onMouseEnter={clearCloseTimeout}
                    onMouseLeave={scheduleCloseMenu}
                  >
                    {platformMenus.instagram.map((item, idx) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-3 text-sm font-medium text-slate-700 hover:bg-orange-50/80 hover:text-orange-600 transition-all duration-300 hover:translate-x-1 border-l-2 border-transparent hover:border-orange-500"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* TikTok Dropdown - Premium */}
              <div
                className="relative"
                onMouseEnter={() => openMenu("tiktok")}
                onMouseLeave={scheduleCloseMenu}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === "tiktok"}
                  onClick={() => setOpenDropdown((prev) => (prev === "tiktok" ? null : "tiktok"))}
                  className="relative text-slate-700 hover:text-orange-600 font-semibold text-sm transition-all duration-300 flex items-center gap-1.5 group py-2"
                >
                  TikTok
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-orange-gradient group-hover:w-full transition-all duration-300 rounded-full" />
                </button>
                {openDropdown === "tiktok" && (
                  <div
                    className="absolute top-full left-0 mt-3 w-64 glass-effect rounded-2xl shadow-2xl border border-white/20 py-2 z-50 animate-scale-in"
                    onMouseEnter={clearCloseTimeout}
                    onMouseLeave={scheduleCloseMenu}
                  >
                    {platformMenus.tiktok.map((item, idx) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-3 text-sm font-medium text-slate-700 hover:bg-orange-50/80 hover:text-orange-600 transition-all duration-300 hover:translate-x-1 border-l-2 border-transparent hover:border-orange-500"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* YouTube Dropdown - Premium */}
              <div
                className="relative"
                onMouseEnter={() => openMenu("youtube")}
                onMouseLeave={scheduleCloseMenu}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === "youtube"}
                  onClick={() => setOpenDropdown((prev) => (prev === "youtube" ? null : "youtube"))}
                  className="relative text-slate-700 hover:text-orange-600 font-semibold text-sm transition-all duration-300 flex items-center gap-1.5 group py-2"
                >
                  YouTube
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-orange-gradient group-hover:w-full transition-all duration-300 rounded-full" />
                </button>
                {openDropdown === "youtube" && (
                  <div
                    className="absolute top-full left-0 mt-3 w-64 glass-effect rounded-2xl shadow-2xl border border-white/20 py-2 z-50 animate-scale-in"
                    onMouseEnter={clearCloseTimeout}
                    onMouseLeave={scheduleCloseMenu}
                  >
                    {platformMenus.youtube.map((item, idx) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-3 text-sm font-medium text-slate-700 hover:bg-orange-50/80 hover:text-orange-600 transition-all duration-300 hover:translate-x-1 border-l-2 border-transparent hover:border-orange-500"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Facebook Dropdown - Premium */}
              <div
                className="relative"
                onMouseEnter={() => openMenu("facebook")}
                onMouseLeave={scheduleCloseMenu}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === "facebook"}
                  onClick={() => setOpenDropdown((prev) => (prev === "facebook" ? null : "facebook"))}
                  className="relative text-slate-700 hover:text-orange-600 font-semibold text-sm transition-all duration-300 flex items-center gap-1.5 group py-2"
                >
                  Facebook
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-orange-gradient group-hover:w-full transition-all duration-300 rounded-full" />
                </button>
                {openDropdown === "facebook" && (
                  <div
                    className="absolute top-full left-0 mt-3 w-64 glass-effect rounded-2xl shadow-2xl border border-white/20 py-2 z-50 animate-scale-in"
                    onMouseEnter={clearCloseTimeout}
                    onMouseLeave={scheduleCloseMenu}
                  >
                    {platformMenus.facebook.map((item, idx) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-3 text-sm font-medium text-slate-700 hover:bg-orange-50/80 hover:text-orange-600 transition-all duration-300 hover:translate-x-1 border-l-2 border-transparent hover:border-orange-500"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Link - Premium */}
              <Link
                href="/contact"
                className="relative text-slate-700 hover:text-orange-600 font-semibold text-sm transition-all duration-300 group py-2"
              >
                Contact
                <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-orange-gradient group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            </div>

            {/* Premium Cart + mobile toggle */}
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleCart}
                className={`relative group p-2.5 hover:bg-orange-50 rounded-xl transition-all duration-300 btn-interactive ${
                  cartBounce ? 'animate-bounce' : ''
                }`}
              >
                <ShoppingBag className="w-5 h-5 text-slate-700 group-hover:text-orange-600 transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                className="lg:hidden p-2.5 text-slate-700 hover:bg-orange-50 rounded-xl transition-all duration-300 btn-interactive"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Premium Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden glass-effect border-t border-white/20 shadow-2xl animate-slide-in-right">
            <div className="px-4 py-6 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {/* Instagram - Mobile Premium */}
              <div className="bg-white/50 rounded-2xl p-3 backdrop-blur-sm">
                <div className="font-bold text-slate-900 px-3 py-2 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-gradient rounded-full"></div>
                  Instagram
                </div>
                {platformMenus.instagram.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 px-4 text-sm font-medium text-slate-700 hover:bg-orange-50 rounded-xl transition-all duration-300 hover:translate-x-1 active:scale-95"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              {/* TikTok - Mobile Premium */}
              <div className="bg-white/50 rounded-2xl p-3 backdrop-blur-sm">
                <div className="font-bold text-slate-900 px-3 py-2 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-gradient rounded-full"></div>
                  TikTok
                </div>
                {platformMenus.tiktok.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 px-4 text-sm font-medium text-slate-700 hover:bg-orange-50 rounded-xl transition-all duration-300 hover:translate-x-1 active:scale-95"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              {/* YouTube - Mobile Premium */}
              <div className="bg-white/50 rounded-2xl p-3 backdrop-blur-sm">
                <div className="font-bold text-slate-900 px-3 py-2 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-gradient rounded-full"></div>
                  YouTube
                </div>
                {platformMenus.youtube.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 px-4 text-sm font-medium text-slate-700 hover:bg-orange-50 rounded-xl transition-all duration-300 hover:translate-x-1 active:scale-95"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              {/* Facebook - Mobile Premium */}
              <div className="bg-white/50 rounded-2xl p-3 backdrop-blur-sm">
                <div className="font-bold text-slate-900 px-3 py-2 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-gradient rounded-full"></div>
                  Facebook
                </div>
                {platformMenus.facebook.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 px-4 text-sm font-medium text-slate-700 hover:bg-orange-50 rounded-xl transition-all duration-300 hover:translate-x-1 active:scale-95"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Contact & FAQ - Mobile Premium */}
              <div className="pt-3 space-y-2">
                <Link
                  href="/contact"
                  className="block py-3 px-4 text-slate-900 font-semibold hover:bg-orange-50 rounded-xl transition-all duration-300 hover:translate-x-1 active:scale-95 bg-white/50 backdrop-blur-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  💬 Contact
                </Link>
                <Link
                  href="/faq"
                  className="block py-3 px-4 text-slate-900 font-semibold hover:bg-orange-50 rounded-xl transition-all duration-300 hover:translate-x-1 active:scale-95 bg-white/50 backdrop-blur-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  ❓ FAQ
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
