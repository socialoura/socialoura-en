export interface AdminToken {
  username: string;
  role: "admin";
  exp: number;
}

export interface PricingPack {
  id: string;
  platform: "instagram" | "tiktok" | "youtube" | "facebook";
  type: "followers" | "likes" | "views";
  quantity: number;
  price: number;
  pricePerUnit: number;
  popular?: boolean;
}

export interface Order {
  id: string;
  username: string;
  email: string;
  platform: "instagram" | "tiktok" | "youtube" | "facebook";
  type: "followers" | "likes" | "views";
  quantity: number;
  price: number;
  created_at: string;
  order_status: "pending" | "processing" | "completed" | "cancelled";
  notes?: string;
  country?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  is_active: boolean;
  expires_at?: string;
  max_uses?: number;
  current_uses: number;
  created_at: string;
}

export interface StripeSettings {
  publishable_key: string;
  secret_key: string;
}

export interface PromoSettings {
  enabled: boolean;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageCart: number;
  conversionRate: number;
  revenue7Days: { date: string; amount: number }[];
  revenue30Days: { date: string; amount: number }[];
  platformDistribution: { platform: string; count: number; revenue: number }[];
  topPackages: { name: string; count: number; revenue: number }[];
}

export interface HeaderBarSettings {
  enabled: boolean;
  text: string;
  backgroundColor: string;
  textColor: string;
  linkUrl?: string;
  linkText?: string;
}
