import ProductPage from "@/components/ProductPage";
import { getProductById } from "@/data/products";
import { notFound } from "next/navigation";

export default function TikTokFollowersPage() {
  const product = getProductById("tiktok-followers");
  
  if (!product) {
    notFound();
  }

  return <ProductPage product={product} />;
}
