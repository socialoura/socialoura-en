import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import HeaderBar from "@/components/HeaderBar";
import ChatWidget from "@/components/ChatWidget";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "SocialNovaly — AI-Powered Social Media Growth Tools",
  description:
    "Grow your social presence with AI-powered engagement services for Instagram, TikTok, YouTube & Facebook. Trusted by 50K+ creators. Safe, policy-compliant, 24/7 support.",
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17893452047"
          strategy="afterInteractive"
        />
        <Script id="google-ads-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17893452047');
          `}
        </Script>
      </head>
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <HeaderBar />
        <CartProvider>
          {children}
          <CartDrawer />
          <ChatWidget />
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
