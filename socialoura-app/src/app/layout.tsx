import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "SocialNovaly — Social Media Growth & Promotion Services",
  description:
    "Grow your audience on Instagram, TikTok, YouTube & Facebook with safe, organic-style promotion services. Fast delivery, 24/7 support.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
