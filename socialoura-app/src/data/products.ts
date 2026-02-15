import { Product } from "@/types/product";

// Static products removed - all packs are now managed via admin dashboard
export const products: Product[] = [];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByPlatform(platform: string): Product[] {
  return products.filter((p) => p.platform === platform);
}
