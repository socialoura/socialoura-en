import { PricingPack, Order, PromoCode, StripeSettings, PromoSettings } from "@/types/admin";

// In-memory storage (fallback if DB unavailable)
class AdminStorage {
  private adminCredentials = {
    username: "admin",
    password: "admin123", // In production, use hashed passwords
  };

  private pricingPacks: PricingPack[] = [
    {
      id: "ig-followers-100",
      platform: "instagram",
      type: "followers",
      quantity: 100,
      price: 2.75,
      pricePerUnit: 0.0275,
    },
    {
      id: "ig-followers-1000",
      platform: "instagram",
      type: "followers",
      quantity: 1000,
      price: 17.99,
      pricePerUnit: 0.018,
      popular: true,
    },
    {
      id: "tt-followers-500",
      platform: "tiktok",
      type: "followers",
      quantity: 500,
      price: 9.99,
      pricePerUnit: 0.02,
    },
  ];

  private orders: Order[] = [
    {
      id: "ord-001",
      username: "john_doe",
      email: "john@example.com",
      platform: "instagram",
      type: "followers",
      quantity: 1000,
      price: 17.99,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      order_status: "completed",
      notes: "Delivered successfully",
      country: "US",
    },
    {
      id: "ord-002",
      username: "jane_smith",
      email: "jane@example.com",
      platform: "tiktok",
      type: "followers",
      quantity: 500,
      price: 9.99,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      order_status: "processing",
      country: "US",
    },
    {
      id: "ord-003",
      username: "mike_wilson",
      email: "mike@example.com",
      platform: "instagram",
      type: "likes",
      quantity: 500,
      price: 9.99,
      created_at: new Date().toISOString(),
      order_status: "pending",
      country: "CA",
    },
  ];

  private promoCodes: PromoCode[] = [
    {
      id: "promo-001",
      code: "WELCOME10",
      discount_percent: 10,
      is_active: true,
      max_uses: 100,
      current_uses: 23,
      created_at: new Date().toISOString(),
    },
    {
      id: "promo-002",
      code: "SUMMER20",
      discount_percent: 20,
      is_active: false,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      max_uses: 50,
      current_uses: 5,
      created_at: new Date().toISOString(),
    },
  ];

  private stripeSettings: StripeSettings = {
    publishable_key: "pk_test_...",
    secret_key: "sk_test_...",
  };

  private promoSettings: PromoSettings = {
    enabled: true,
  };

  // Auth methods
  validateCredentials(username: string, password: string): boolean {
    return (
      username === this.adminCredentials.username &&
      password === this.adminCredentials.password
    );
  }

  updatePassword(newPassword: string): void {
    this.adminCredentials.password = newPassword;
  }

  // Pricing methods
  getPricingPacks(): PricingPack[] {
    return [...this.pricingPacks];
  }

  addPricingPack(pack: Omit<PricingPack, "id">): PricingPack {
    const newPack: PricingPack = {
      ...pack,
      id: `${pack.platform}-${pack.type}-${pack.quantity}-${Date.now()}`,
    };
    this.pricingPacks.push(newPack);
    return newPack;
  }

  updatePricingPack(id: string, updates: Partial<PricingPack>): PricingPack | null {
    const index = this.pricingPacks.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.pricingPacks[index] = { ...this.pricingPacks[index], ...updates };
    return this.pricingPacks[index];
  }

  deletePricingPack(id: string): boolean {
    const index = this.pricingPacks.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.pricingPacks.splice(index, 1);
    return true;
  }

  // Order methods
  getOrders(): Order[] {
    return [...this.orders];
  }

  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    this.orders[index] = { ...this.orders[index], ...updates };
    return this.orders[index];
  }

  deleteOrder(id: string): boolean {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) return false;
    this.orders.splice(index, 1);
    return true;
  }

  // Promo code methods
  getPromoCodes(): PromoCode[] {
    return [...this.promoCodes];
  }

  addPromoCode(code: Omit<PromoCode, "id" | "current_uses" | "created_at">): PromoCode {
    const newCode: PromoCode = {
      ...code,
      id: `promo-${Date.now()}`,
      current_uses: 0,
      created_at: new Date().toISOString(),
    };
    this.promoCodes.push(newCode);
    return newCode;
  }

  updatePromoCode(id: string, updates: Partial<PromoCode>): PromoCode | null {
    const index = this.promoCodes.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.promoCodes[index] = { ...this.promoCodes[index], ...updates };
    return this.promoCodes[index];
  }

  deletePromoCode(id: string): boolean {
    const index = this.promoCodes.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.promoCodes.splice(index, 1);
    return true;
  }

  // Settings methods
  getStripeSettings(): StripeSettings {
    return { ...this.stripeSettings };
  }

  updateStripeSettings(settings: StripeSettings): StripeSettings {
    this.stripeSettings = settings;
    return { ...this.stripeSettings };
  }

  getPromoSettings(): PromoSettings {
    return { ...this.promoSettings };
  }

  updatePromoSettings(settings: PromoSettings): PromoSettings {
    this.promoSettings = settings;
    return { ...this.promoSettings };
  }
}

export const adminStorage = new AdminStorage();
