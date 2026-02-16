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
    description: "Grow your Instagram audience with real, active profile promotion services.",
    deliveryTime: "Fast Delivery",
    guarantee: "Lifetime Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "100% real and active profiles",
      "Fast and gradual delivery",
      "Lifetime retention guarantee",
      "Safe for your account",
      "24/7 customer support",
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
    description: "Boost your Instagram post engagement with authentic likes from real users.",
    deliveryTime: "Fast Delivery",
    guarantee: "Lifetime Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Likes from real profiles",
      "Natural gradual delivery",
      "Lifetime retention guarantee",
      "Algorithm-friendly promotion",
      "24/7 customer support",
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
    description: "Increase your Instagram Stories and Reels visibility with real views.",
    deliveryTime: "Fast Delivery",
    guarantee: "Lifetime Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Views from real accounts",
      "Ultra-fast delivery",
      "Lifetime retention guarantee",
      "Improves your content reach",
      "24/7 customer support",
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
    description: "Grow your TikTok community with real, engaged audience promotion.",
    deliveryTime: "Fast Delivery",
    guarantee: "Lifetime Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "100% real followers",
      "Fast and gradual delivery",
      "Lifetime retention guarantee",
      "TikTok algorithm boost",
      "24/7 customer support",
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
    description: "Enhance your TikTok video engagement with authentic likes.",
    deliveryTime: "Fast Delivery",
    guarantee: "Lifetime Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Likes from real profiles",
      "Gradual delivery",
      "Lifetime retention guarantee",
      "Visibility boost",
      "24/7 customer support",
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
    description: "Expand the reach of your TikTok videos with real views.",
    deliveryTime: "Fast Delivery",
    guarantee: "Lifetime Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Views from real accounts",
      "Ultra-fast delivery",
      "Lifetime retention guarantee",
      "Improves discoverability",
      "24/7 customer support",
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
    description: "Grow your YouTube channel with real, engaged subscriber promotion.",
    deliveryTime: "Fast Delivery",
    guarantee: "Lifetime Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "100% real subscribers",
      "Gradual delivery",
      "Lifetime retention guarantee",
      "Monetization-friendly growth",
      "24/7 customer support",
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
    description: "Increase your YouTube video views with real, high-retention traffic.",
    deliveryTime: "Fast Delivery",
    guarantee: "Lifetime Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Views from real accounts",
      "High retention rate",
      "Lifetime retention guarantee",
      "Improves search ranking",
      "24/7 customer support",
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
    description: "Boost your YouTube video engagement with authentic likes.",
    deliveryTime: "Fast Delivery",
    guarantee: "Lifetime Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Likes from real profiles",
      "Gradual delivery",
      "Lifetime retention guarantee",
      "Visibility boost",
      "24/7 customer support",
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
    description: "Grow your Facebook audience with real, active profile promotion.",
    deliveryTime: "Fast Delivery",
    guarantee: "Lifetime Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "100% real followers",
      "Fast delivery",
      "Lifetime retention guarantee",
      "Organic reach boost",
      "24/7 customer support",
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
    description: "Boost your Facebook post engagement with authentic likes.",
    deliveryTime: "Fast Delivery",
    guarantee: "Lifetime Guarantee",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Likes from real profiles",
      "Gradual delivery",
      "Lifetime retention guarantee",
      "Engagement boost",
      "24/7 customer support",
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
