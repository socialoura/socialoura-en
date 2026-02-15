import { Product } from "@/types/product";

// Product definitions - pricingTiers are managed dynamically via admin dashboard
export const products: Product[] = [
  {
    id: "instagram-followers",
    name: "Abonnés Instagram",
    platform: "instagram",
    type: "followers",
    icon: "instagram",
    color: "#E1306C",
    description: "Augmentez votre nombre d'abonnés Instagram avec des profils 100% réels et actifs",
    deliveryTime: "Instantané",
    guarantee: "Garantie à vie",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Profils 100% réels et actifs",
      "Livraison instantanée",
      "Garantie à vie",
      "Sans risque pour votre compte",
      "Service client 24/7",
      "Paiement sécurisé",
    ],
  },
  {
    id: "instagram-likes",
    name: "Likes Instagram",
    platform: "instagram",
    type: "likes",
    icon: "heart",
    color: "#E1306C",
    description: "Boostez vos publications Instagram avec des likes authentiques",
    deliveryTime: "Instantané",
    guarantee: "Garantie à vie",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Likes de profils réels",
      "Livraison progressive naturelle",
      "Garantie à vie",
      "Boost de l'algorithme",
      "Service client 24/7",
      "Paiement sécurisé",
    ],
  },
  {
    id: "instagram-views",
    name: "Vues Instagram",
    platform: "instagram",
    type: "views",
    icon: "eye",
    color: "#E1306C",
    description: "Augmentez la visibilité de vos stories et reels Instagram",
    deliveryTime: "Instantané",
    guarantee: "Garantie à vie",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Vues de comptes réels",
      "Livraison ultra-rapide",
      "Garantie à vie",
      "Améliore votre visibilité",
      "Service client 24/7",
      "Paiement sécurisé",
    ],
  },
  {
    id: "tiktok-followers",
    name: "Abonnés TikTok",
    platform: "tiktok",
    type: "followers",
    icon: "tiktok",
    color: "#000000",
    description: "Développez votre communauté TikTok avec des abonnés réels et actifs",
    deliveryTime: "Instantané",
    guarantee: "Garantie à vie",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Abonnés 100% réels",
      "Livraison instantanée",
      "Garantie à vie",
      "Boost de l'algorithme TikTok",
      "Service client 24/7",
      "Paiement sécurisé",
    ],
  },
  {
    id: "tiktok-likes",
    name: "Likes TikTok",
    platform: "tiktok",
    type: "likes",
    icon: "heart",
    color: "#000000",
    description: "Augmentez l'engagement de vos vidéos TikTok avec des likes authentiques",
    deliveryTime: "Instantané",
    guarantee: "Garantie à vie",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Likes de profils réels",
      "Livraison progressive",
      "Garantie à vie",
      "Boost de visibilité",
      "Service client 24/7",
      "Paiement sécurisé",
    ],
  },
  {
    id: "tiktok-views",
    name: "Vues TikTok",
    platform: "tiktok",
    type: "views",
    icon: "eye",
    color: "#000000",
    description: "Boostez la portée de vos vidéos TikTok avec des vues réelles",
    deliveryTime: "Instantané",
    guarantee: "Garantie à vie",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Vues de comptes réels",
      "Livraison ultra-rapide",
      "Garantie à vie",
      "Améliore le référencement",
      "Service client 24/7",
      "Paiement sécurisé",
    ],
  },
  {
    id: "youtube-subscribers",
    name: "Abonnés YouTube",
    platform: "youtube",
    type: "followers",
    icon: "youtube",
    color: "#FF0000",
    description: "Développez votre chaîne YouTube avec des abonnés réels et engagés",
    deliveryTime: "Instantané",
    guarantee: "Garantie à vie",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Abonnés 100% réels",
      "Livraison progressive",
      "Garantie à vie",
      "Boost de monétisation",
      "Service client 24/7",
      "Paiement sécurisé",
    ],
  },
  {
    id: "youtube-views",
    name: "Vues YouTube",
    platform: "youtube",
    type: "views",
    icon: "eye",
    color: "#FF0000",
    description: "Augmentez les vues de vos vidéos YouTube avec du trafic réel",
    deliveryTime: "Instantané",
    guarantee: "Garantie à vie",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Vues de comptes réels",
      "Rétention élevée",
      "Garantie à vie",
      "Améliore le référencement",
      "Service client 24/7",
      "Paiement sécurisé",
    ],
  },
  {
    id: "youtube-likes",
    name: "Likes YouTube",
    platform: "youtube",
    type: "likes",
    icon: "heart",
    color: "#FF0000",
    description: "Boostez l'engagement de vos vidéos YouTube avec des likes authentiques",
    deliveryTime: "Instantané",
    guarantee: "Garantie à vie",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Likes de profils réels",
      "Livraison progressive",
      "Garantie à vie",
      "Boost de visibilité",
      "Service client 24/7",
      "Paiement sécurisé",
    ],
  },
  {
    id: "facebook-followers",
    name: "Abonnés Facebook",
    platform: "facebook",
    type: "followers",
    icon: "facebook",
    color: "#1877F2",
    description: "Augmentez votre audience Facebook avec des abonnés réels et actifs",
    deliveryTime: "Instantané",
    guarantee: "Garantie à vie",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Abonnés 100% réels",
      "Livraison instantanée",
      "Garantie à vie",
      "Boost de portée organique",
      "Service client 24/7",
      "Paiement sécurisé",
    ],
  },
  {
    id: "facebook-likes",
    name: "Likes Facebook",
    platform: "facebook",
    type: "likes",
    icon: "heart",
    color: "#1877F2",
    description: "Boostez vos publications Facebook avec des likes authentiques",
    deliveryTime: "Instantané",
    guarantee: "Garantie à vie",
    pricingTiers: [], // Loaded dynamically from database
    features: [
      "Likes de profils réels",
      "Livraison progressive",
      "Garantie à vie",
      "Boost d'engagement",
      "Service client 24/7",
      "Paiement sécurisé",
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByPlatform(platform: string): Product[] {
  return products.filter((p) => p.platform === platform);
}
