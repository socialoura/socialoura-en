export interface PricingTier {
  quantity: number;
  price: number;
  pricePerUnit: number;
  popular?: boolean;
}

export interface Product {
  id: string;
  name: string;
  platform: "instagram" | "tiktok" | "youtube" | "facebook";
  type: "followers" | "likes" | "views";
  icon: string;
  color: string;
  description: string;
  pricingTiers: PricingTier[];
  features: string[];
  deliveryTime: string;
  guarantee: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}
