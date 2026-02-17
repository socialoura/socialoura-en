"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const platformMenus = {
  instagram: [
    { label: "Instagram Followers", href: "/products/instagram-followers" },
    { label: "Instagram Likes", href: "/products/instagram-likes" },
    { label: "Instagram Views", href: "/products/instagram-views" },
  ],
  tiktok: [
    { label: "TikTok Followers", href: "/products/tiktok-followers" },
    { label: "TikTok Likes", href: "/products/tiktok-likes" },
    { label: "TikTok Views", href: "/products/tiktok-views" },
  ],
  youtube: [
    { label: "YouTube Subscribers", href: "/products/youtube-subscribers" },
    { label: "YouTube Views", href: "/products/youtube-views" },
    { label: "YouTube Likes", href: "/products/youtube-likes" },
  ],
  facebook: [
    { label: "Facebook Followers", href: "/products/facebook-followers" },
    { label: "Facebook Likes", href: "/products/facebook-likes" },
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
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-[#F1E4EA]"
          : "bg-white border-b border-[#F1E4EA]/60"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 overflow-visible">
            {/* Premium Logo */}
            <Link href="/" className="group">
              <Image
                src="/logo.png"
                alt="SocialOura"
                width={120}
                height={48}
                className="object-contain md:group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </Link>

            {/* Desktop nav — Platform dropdowns + Reviews + Contact */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Instagram Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => openMenu("instagram")}
                onMouseLeave={scheduleCloseMenu}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === "instagram"}
                  onClick={() => setOpenDropdown((prev) => (prev === "instagram" ? null : "instagram"))}
                  className="relative text-[#111827] hover:text-[#FF4B6A] font-semibold text-sm transition-all duration-300 flex items-center gap-1.5 group py-2"
                >
                  Instagram
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-[#FF4B6A] group-hover:w-full transition-all duration-300 rounded-full" />
                </button>
                {openDropdown === "instagram" && (
                  <div
                    className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-lg border border-[#F1E4EA] py-2 z-50 animate-scale-in"
                    onMouseEnter={clearCloseTimeout}
                    onMouseLeave={scheduleCloseMenu}
                  >
                    {platformMenus.instagram.map((item, idx) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-3 text-sm font-medium text-[#111827] hover:bg-[#FFE4EC] hover:text-[#FF4B6A] transition-all duration-200 hover:translate-x-1 border-l-2 border-transparent hover:border-[#FF4B6A]"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* TikTok Dropdown */}
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
                  className="relative text-[#111827] hover:text-[#FF4B6A] font-semibold text-sm transition-all duration-300 flex items-center gap-1.5 group py-2"
                >
                  TikTok
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-[#FF4B6A] group-hover:w-full transition-all duration-300 rounded-full" />
                </button>
                {openDropdown === "tiktok" && (
                  <div
                    className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-lg border border-[#F1E4EA] py-2 z-50 animate-scale-in"
                    onMouseEnter={clearCloseTimeout}
                    onMouseLeave={scheduleCloseMenu}
                  >
                    {platformMenus.tiktok.map((item, idx) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-3 text-sm font-medium text-[#111827] hover:bg-[#FFE4EC] hover:text-[#FF4B6A] transition-all duration-200 hover:translate-x-1 border-l-2 border-transparent hover:border-[#FF4B6A]"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* YouTube Dropdown */}
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
                  className="relative text-[#111827] hover:text-[#FF4B6A] font-semibold text-sm transition-all duration-300 flex items-center gap-1.5 group py-2"
                >
                  YouTube
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-[#FF4B6A] group-hover:w-full transition-all duration-300 rounded-full" />
                </button>
                {openDropdown === "youtube" && (
                  <div
                    className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-lg border border-[#F1E4EA] py-2 z-50 animate-scale-in"
                    onMouseEnter={clearCloseTimeout}
                    onMouseLeave={scheduleCloseMenu}
                  >
                    {platformMenus.youtube.map((item, idx) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-3 text-sm font-medium text-[#111827] hover:bg-[#FFE4EC] hover:text-[#FF4B6A] transition-all duration-200 hover:translate-x-1 border-l-2 border-transparent hover:border-[#FF4B6A]"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Facebook Dropdown */}
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
                  className="relative text-[#111827] hover:text-[#FF4B6A] font-semibold text-sm transition-all duration-300 flex items-center gap-1.5 group py-2"
                >
                  Facebook
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-[#FF4B6A] group-hover:w-full transition-all duration-300 rounded-full" />
                </button>
                {openDropdown === "facebook" && (
                  <div
                    className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-lg border border-[#F1E4EA] py-2 z-50 animate-scale-in"
                    onMouseEnter={clearCloseTimeout}
                    onMouseLeave={scheduleCloseMenu}
                  >
                    {platformMenus.facebook.map((item, idx) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-3 text-sm font-medium text-[#111827] hover:bg-[#FFE4EC] hover:text-[#FF4B6A] transition-all duration-200 hover:translate-x-1 border-l-2 border-transparent hover:border-[#FF4B6A]"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviews */}
              <Link
                href="/avis"
                className="relative text-[#111827] hover:text-[#FF4B6A] font-semibold text-sm transition-all duration-300 group py-2"
              >
                Reviews
                <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-[#FF4B6A] group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className="relative text-[#111827] hover:text-[#FF4B6A] font-semibold text-sm transition-all duration-300 group py-2"
              >
                Contact
                <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-[#FF4B6A] group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            </div>

            {/* Premium Cart + mobile toggle */}
            <div className="flex items-center gap-3">
              {/* Cart wrapper with badge outside */}
              <div className="relative inline-block">
                <button 
                  onClick={toggleCart}
                  className={`group p-3 md:hover:bg-[#FFE4EC] rounded-xl transition-all duration-300 ${
                    cartBounce ? 'animate-bounce' : ''
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 text-[#111827] group-hover:text-[#FF4B6A] transition-colors" />
                </button>
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 z-50 h-5 min-w-[20px] px-1.5 bg-[#FF4B6A] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </div>
              
              <button
                className="lg:hidden p-2.5 text-[#111827] hover:bg-[#FFE4EC] rounded-xl transition-all duration-300"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Premium Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-[#F1E4EA] shadow-lg animate-slide-in-right">
            <div className="px-4 py-6 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {/* Instagram - Mobile Premium */}
              <div className="bg-[#FFF7FA] rounded-2xl p-3">
                <div className="font-bold text-[#111827] px-3 py-2 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#FF4B6A] rounded-full"></div>
                  Instagram
                </div>
                {platformMenus.instagram.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 px-4 text-sm font-medium text-[#111827]/70 hover:bg-[#FFE4EC] hover:text-[#FF4B6A] rounded-xl transition-all duration-200 active:scale-95"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              {/* TikTok - Mobile Premium */}
              <div className="bg-[#FFF7FA] rounded-2xl p-3">
                <div className="font-bold text-[#111827] px-3 py-2 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#FF4B6A] rounded-full"></div>
                  TikTok
                </div>
                {platformMenus.tiktok.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 px-4 text-sm font-medium text-[#111827]/70 hover:bg-[#FFE4EC] hover:text-[#FF4B6A] rounded-xl transition-all duration-200 active:scale-95"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              {/* YouTube - Mobile Premium */}
              <div className="bg-[#FFF7FA] rounded-2xl p-3">
                <div className="font-bold text-[#111827] px-3 py-2 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#FF4B6A] rounded-full"></div>
                  YouTube
                </div>
                {platformMenus.youtube.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 px-4 text-sm font-medium text-[#111827]/70 hover:bg-[#FFE4EC] hover:text-[#FF4B6A] rounded-xl transition-all duration-200 active:scale-95"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              {/* Facebook - Mobile Premium */}
              <div className="bg-[#FFF7FA] rounded-2xl p-3">
                <div className="font-bold text-[#111827] px-3 py-2 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#FF4B6A] rounded-full"></div>
                  Facebook
                </div>
                {platformMenus.facebook.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 px-4 text-sm font-medium text-[#111827]/70 hover:bg-[#FFE4EC] hover:text-[#FF4B6A] rounded-xl transition-all duration-200 active:scale-95"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Contact, FAQ & Avis - Mobile Premium */}
              <div className="pt-3 space-y-2">
                <Link
                  href="/contact"
                  className="block py-3 px-4 text-[#111827] font-semibold hover:bg-[#FFE4EC] hover:text-[#FF4B6A] rounded-xl transition-all duration-200 active:scale-95 bg-[#FFF7FA]"
                  onClick={() => setMobileOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/faq"
                  className="block py-3 px-4 text-[#111827] font-semibold hover:bg-[#FFE4EC] hover:text-[#FF4B6A] rounded-xl transition-all duration-200 active:scale-95 bg-[#FFF7FA]"
                  onClick={() => setMobileOpen(false)}
                >
                  FAQ
                </Link>
                <Link
                  href="/avis"
                  className="block py-3 px-4 text-[#111827] font-semibold hover:bg-[#FFE4EC] hover:text-[#FF4B6A] rounded-xl transition-all duration-200 active:scale-95 bg-[#FFF7FA]"
                  onClick={() => setMobileOpen(false)}
                >
                  Reviews
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
