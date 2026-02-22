import ProductLayout from "@/components/ProductLayout";
import { getProductById } from "@/data/products";
import { notFound } from "next/navigation";
import { Target, Shield, BarChart3 } from "lucide-react";

export default function YouTubeViewsPage() {
  const product = getProductById("youtube-views");

  if (!product) {
    notFound();
  }

  return (
    <ProductLayout
      product={product}
      heroTitle="Promote Your Videos to Real Viewers"
      heroSubtitle="Launch compliant video campaigns on advertising networks. Gain real engagement, retention, and organic growth."
      pricingTitle="Starter Campaigns"
      pricingBadge="High Retention"
      pricingFeatures={[
        "Google Ads Compliant",
        "Real Human Viewers",
        "High Retention",
        "Safe & Secure",
      ]}
      benefits={[
        {
          icon: <Target className="w-7 h-7" />,
          title: "Targeted Audience",
          description:
            "We filter viewers by interest to ensure high retention and meaningful engagement with your content.",
        },
        {
          icon: <Shield className="w-7 h-7" />,
          title: "100% Safe Method",
          description:
            "Fully compliant with YouTube Terms of Service. We use legitimate advertising networks to promote your content.",
        },
        {
          icon: <BarChart3 className="w-7 h-7" />,
          title: "Analytics Tracking",
          description:
            "Watch your organic growth in real-time on YouTube Studio. Full transparency on campaign performance.",
        },
      ]}
      zigzag={[
        {
          title: "Algorithm-Friendly Video Promotion",
          description:
            "We place your video in front of interested audiences through the Google Ads Network to boost your organic reach naturally. No bots, just real humans engaging with your content.",
        },
        {
          title: "Compliant Campaign Strategy",
          description:
            "Our promotion campaigns run exclusively on legitimate advertising networks. Every view comes from a real person, ensuring your channel stays safe and your analytics remain clean.",
        },
      ]}
      faqItems={[
        {
          question: "Is this safe for my channel?",
          answer:
            "Yes. We use legitimate advertising networks to promote your content, ensuring full compliance with YouTube policies. Your channel is never at risk.",
        },
        {
          question: "Where do the views come from?",
          answer:
            "All views come from real human viewers reached through compliant advertising campaigns on the Google Ads Network and partner platforms.",
        },
        {
          question: "Will this help my video rank higher?",
          answer:
            "Real viewer engagement and high retention signals naturally improve your video's position in YouTube's recommendation algorithm, leading to organic growth over time.",
        },
        {
          question: "How long does a campaign take?",
          answer:
            "Campaign delivery is paced organically to mirror natural viewing patterns. Most campaigns complete within 1-7 days depending on the volume selected.",
        },
        {
          question: "Do you need my YouTube password?",
          answer:
            "Never. We only need the public URL of the video you want to promote. Your account credentials are never required.",
        },
        {
          question: "Can I track the campaign results?",
          answer:
            "Absolutely. You can monitor all engagement metrics directly in YouTube Studio in real-time as the campaign progresses.",
        },
      ]}
    />
  );
}
