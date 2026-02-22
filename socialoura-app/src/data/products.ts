import { Product } from "@/types/product";

// Product definitions - pricingTiers are managed dynamically via admin dashboard
export const products: Product[] = [
  {
    id: "instagram-followers",
    name: "Instagram Followers",
    platform: "instagram",
    type: "followers",
    icon: "instagram",
    color: "#E1306C",
    description: "Expand your Instagram profile authority with AI-Driven Audience Targeting. Our SocialNovaly™ Engine identifies high-affinity audience clusters and delivers engagement with organic-style pacing.",
    deliveryTime: "Smart-Paced Delivery",
    guarantee: "High-Retention Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Audience Filtering — verified, active profiles only",
      "Smart-Paced Delivery — natural growth curve",
      "High-Retention Guarantee — lifetime stability",
      "Risk-Free Compliance Protocol",
      "Dedicated Growth Specialists — 24/7",
      "Secure payment",
    ],
  },
  {
    id: "instagram-likes",
    name: "Instagram Likes",
    platform: "instagram",
    type: "likes",
    icon: "heart",
    color: "#E1306C",
    description: "Amplify your Instagram post signals with Data-Backed Engagement. Our AI targets relevant audience clusters to deliver authentic interactions that strengthen your content's algorithmic reach.",
    deliveryTime: "Smart-Paced Delivery",
    guarantee: "High-Retention Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Audience Filtering — quality-controlled profiles",
      "Smart-Paced Delivery — organic behavior pattern",
      "High-Retention Guarantee — stable results",
      "Algorithmic Reach Optimization",
      "Dedicated Growth Specialists — 24/7",
      "Secure payment",
    ],
  },
  {
    id: "instagram-views",
    name: "Instagram Views",
    platform: "instagram",
    type: "views",
    icon: "eye",
    color: "#E1306C",
    description: "Maximize your Instagram Reels and Stories visibility with Algorithmic Reach Optimization. Our AI-driven view delivery boosts content discoverability across the platform's recommendation engine.",
    deliveryTime: "Smart-Paced Delivery",
    guarantee: "High-Retention Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Audience Filtering — verified account network",
      "Smart-Paced Delivery — no anomalous spikes",
      "High-Retention Guarantee — lifetime stability",
      "Profile Authority Boost",
      "Dedicated Growth Specialists — 24/7",
      "Secure payment",
    ],
  },
  {
    id: "tiktok-followers",
    name: "TikTok Followers",
    platform: "tiktok",
    type: "followers",
    icon: "tiktok",
    color: "#000000",
    description: "Scale your TikTok profile authority with AI-Driven Audience Targeting. Our Smart Growth Algorithms identify niche-aligned audience clusters and deploy engagement with organic-style pacing.",
    deliveryTime: "Smart-Paced Delivery",
    guarantee: "High-Retention Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Audience Filtering — verified, active profiles only",
      "Smart-Paced Delivery — natural growth curve",
      "High-Retention Guarantee — lifetime stability",
      "Algorithmic Reach Optimization for TikTok FYP",
      "Dedicated Growth Specialists — 24/7",
      "Secure payment",
    ],
  },
  {
    id: "tiktok-likes",
    name: "TikTok Likes",
    platform: "tiktok",
    type: "likes",
    icon: "heart",
    color: "#000000",
    description: "Strengthen your TikTok video signals with Data-Backed Engagement. Authentic interactions from quality-filtered profiles that reinforce your content's position in the For You Page algorithm.",
    deliveryTime: "Smart-Paced Delivery",
    guarantee: "High-Retention Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Audience Filtering — quality-controlled profiles",
      "Smart-Paced Delivery — organic behavior pattern",
      "High-Retention Guarantee — stable results",
      "Profile Authority Boost",
      "Dedicated Growth Specialists — 24/7",
      "Secure payment",
    ],
  },
  {
    id: "tiktok-views",
    name: "TikTok Views",
    platform: "tiktok",
    type: "views",
    icon: "eye",
    color: "#000000",
    description: "Expand your TikTok video reach with Algorithmic Reach Optimization. Our AI-powered view delivery is engineered to trigger the platform's recommendation engine and maximize content discoverability.",
    deliveryTime: "Smart-Paced Delivery",
    guarantee: "High-Retention Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Audience Filtering — verified account network",
      "Smart-Paced Delivery — no anomalous spikes",
      "High-Retention Guarantee — lifetime stability",
      "TikTok FYP Discoverability Boost",
      "Dedicated Growth Specialists — 24/7",
      "Secure payment",
    ],
  },
  {
    id: "youtube-subscribers",
    name: "YouTube Subscribers",
    platform: "youtube",
    type: "followers",
    icon: "youtube",
    color: "#FF0000",
    description: "Build your YouTube channel authority with AI-Driven Audience Targeting. Our Smart Growth Algorithms deliver subscriber growth with organic-style pacing, fully aligned with monetization thresholds.",
    deliveryTime: "Smart-Paced Delivery",
    guarantee: "High-Retention Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Audience Filtering — verified, active subscribers",
      "Smart-Paced Delivery — natural growth curve",
      "High-Retention Guarantee — lifetime stability",
      "Monetization-Compatible Growth",
      "Dedicated Growth Specialists — 24/7",
      "Secure payment",
    ],
  },
  {
    id: "youtube-views",
    name: "YouTube Views",
    platform: "youtube",
    type: "views",
    icon: "eye",
    color: "#FF0000",
    description: "Promote your videos to real viewers through compliant advertising campaigns. Gain organic growth, high retention engagement, and improved discoverability on the Google Ads Network.",
    deliveryTime: "Campaign Delivery",
    guarantee: "High-Retention Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Google Ads Compliant — legitimate promotion",
      "Real Human Viewers — targeted by interest",
      "High Retention — organic watch-time signals",
      "Algorithm-Friendly Campaign Pacing",
      "Dedicated Campaign Specialists — 24/7",
      "Secure payment",
    ],
  },
  {
    id: "youtube-likes",
    name: "YouTube Likes",
    platform: "youtube",
    type: "likes",
    icon: "heart",
    color: "#FF0000",
    description: "Reinforce your YouTube video engagement signals with Data-Backed Engagement. Authentic interactions from quality-filtered profiles that strengthen your content's algorithmic authority.",
    deliveryTime: "Smart-Paced Delivery",
    guarantee: "High-Retention Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Audience Filtering — quality-controlled profiles",
      "Smart-Paced Delivery — organic behavior pattern",
      "High-Retention Guarantee — stable results",
      "Algorithmic Reach Optimization",
      "Dedicated Growth Specialists — 24/7",
      "Secure payment",
    ],
  },
  {
    id: "facebook-followers",
    name: "Facebook Followers",
    platform: "facebook",
    type: "followers",
    icon: "facebook",
    color: "#1877F2",
    description: "Grow your Facebook page authority with AI-Driven Audience Targeting. Our Smart Growth Algorithms identify relevant audience clusters and deploy engagement with organic-style pacing.",
    deliveryTime: "Smart-Paced Delivery",
    guarantee: "High-Retention Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Audience Filtering — verified, active profiles only",
      "Smart-Paced Delivery — natural growth curve",
      "High-Retention Guarantee — lifetime stability",
      "Organic Reach Amplification",
      "Dedicated Growth Specialists — 24/7",
      "Secure payment",
    ],
  },
  {
    id: "facebook-likes",
    name: "Facebook Likes",
    platform: "facebook",
    type: "likes",
    icon: "heart",
    color: "#1877F2",
    description: "Amplify your Facebook post engagement signals with Data-Backed Engagement. Quality-filtered interactions that strengthen your content's reach within the platform's distribution algorithm.",
    deliveryTime: "Smart-Paced Delivery",
    guarantee: "High-Retention Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Audience Filtering — quality-controlled profiles",
      "Smart-Paced Delivery — organic behavior pattern",
      "High-Retention Guarantee — stable results",
      "Profile Authority Boost",
      "Dedicated Growth Specialists — 24/7",
      "Secure payment",
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByPlatform(platform: string): Product[] {
  return products.filter((p) => p.platform === platform);
}
