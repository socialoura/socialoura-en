import { Product } from "@/types/product";
import { products as staticProducts } from "@/data/products";

// Cache for products
let cachedProducts: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getProducts(): Promise<Product[]> {
  // Return cached products if still valid
  if (cachedProducts && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedProducts;
  }

  try {
    // Try to fetch dynamic packs from admin API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/packs`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      const dynamicPacks = data.packs || [];

      if (dynamicPacks.length > 0) {
        // Convert admin packs to Product format and merge with static products
        const convertedPacks = dynamicPacks.map((pack: any) => ({
          id: `${pack.platform.toLowerCase()}-${pack.type}`,
          name: `${pack.type.charAt(0).toUpperCase() + pack.type.slice(1)} ${pack.platform}`,
          platform: pack.platform.toLowerCase(),
          type: pack.type,
          icon: pack.platform.toLowerCase(),
          color: getColorForPlatform(pack.platform),
          description: `Grow your ${pack.platform} with authentic ${pack.type} promotion services.`,
          deliveryTime: "Fast Delivery",
          guarantee: "Lifetime Guarantee",
          pricingTiers: [
            {
              quantity: pack.quantity,
              price: pack.price,
              pricePerUnit: pack.price / pack.quantity,
              popular: false,
            },
          ],
          features: [
            "100% real profiles",
            "Fast delivery",
            "Lifetime guarantee",
            "24/7 customer support",
            "Secure payment",
          ],
        }));

        // Merge with static products (static products take precedence for existing IDs)
        const mergedProducts = [...staticProducts];
        
        convertedPacks.forEach((dynamicProduct: Product) => {
          const existingIndex = mergedProducts.findIndex(p => p.id === dynamicProduct.id);
          if (existingIndex === -1) {
            // Add new dynamic product
            mergedProducts.push(dynamicProduct);
          }
        });

        cachedProducts = mergedProducts;
        lastFetchTime = Date.now();
        return mergedProducts;
      }
    }
  } catch (error) {
    console.error("Failed to fetch dynamic packs:", error);
  }

  // Fallback to static products
  cachedProducts = staticProducts;
  lastFetchTime = Date.now();
  return staticProducts;
}

export function getProductById(id: string): Product | undefined {
  return staticProducts.find((p) => p.id === id);
}

export function getProductsByPlatform(platform: string): Product[] {
  return staticProducts.filter((p) => p.platform === platform);
}

function getColorForPlatform(platform: string): string {
  const colors: Record<string, string> = {
    instagram: "#E1306C",
    tiktok: "#000000",
    youtube: "#FF0000",
    facebook: "#1877F2",
  };
  return colors[platform.toLowerCase()] || "#000000";
}

// Clear cache function (useful for admin updates)
export function clearProductsCache() {
  cachedProducts = null;
  lastFetchTime = 0;
}
