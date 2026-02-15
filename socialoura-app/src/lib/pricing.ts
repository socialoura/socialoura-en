export type Goal = { followers: string; price: string };

export type PlatformKey = "instagram" | "tiktok" | "youtube" | "facebook";
export type ProductType = "followers" | "likes" | "views";

export type PricingData = Record<PlatformKey, Partial<Record<ProductType, Goal[]>>>;

type LegacyPricingData = { instagram?: Goal[]; tiktok?: Goal[] };

export function getDefaultPricing(): PricingData {
  return {
    instagram: { followers: [], likes: [], views: [] },
    tiktok: { followers: [], likes: [], views: [] },
    youtube: { followers: [], likes: [], views: [] },
    facebook: { followers: [], likes: [] },
  };
}

export function normalizePricing(raw: unknown): PricingData {
  const base = getDefaultPricing();
  if (!raw || typeof raw !== "object") return base;

  const obj = raw as Record<string, unknown>;

  // Legacy shape: { instagram: Goal[], tiktok: Goal[] }
  const legacy = obj as LegacyPricingData;
  const isLegacy = Array.isArray(legacy.instagram) || Array.isArray(legacy.tiktok);
  if (isLegacy) {
    return {
      ...base,
      instagram: { ...base.instagram, followers: Array.isArray(legacy.instagram) ? legacy.instagram : [] },
      tiktok: { ...base.tiktok, followers: Array.isArray(legacy.tiktok) ? legacy.tiktok : [] },
    };
  }

  const platforms: PlatformKey[] = ["instagram", "tiktok", "youtube", "facebook"];
  const types: ProductType[] = ["followers", "likes", "views"];

  for (const platform of platforms) {
    const platformVal = obj[platform];
    if (!platformVal || typeof platformVal !== "object") continue;
    const platformObj = platformVal as Record<string, unknown>;
    for (const type of types) {
      const v = platformObj[type];
      if (Array.isArray(v)) {
        (base[platform] as any)[type] = v.filter(
          (x) => x && typeof x === "object" && "followers" in (x as any) && "price" in (x as any)
        ) as Goal[];
      }
    }
  }

  if ((base.facebook as any).views) {
    delete (base.facebook as any).views;
  }

  return base;
}
