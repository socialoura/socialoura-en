import ProductPage from "@/components/ProductPage";
import { getProductById } from "@/data/products";
import { notFound } from "next/navigation";

export default function TikTokViewsPage() {
  const product = getProductById("tiktok-views");
  
  if (!product) {
    notFound();
  }

  return <ProductPage product={product} />;
}
