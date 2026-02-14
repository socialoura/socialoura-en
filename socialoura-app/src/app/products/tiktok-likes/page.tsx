import ProductPage from "@/components/ProductPage";
import { getProductById } from "@/data/products";
import { notFound } from "next/navigation";

export default function TikTokLikesPage() {
  const product = getProductById("tiktok-likes");
  
  if (!product) {
    notFound();
  }

  return <ProductPage product={product} />;
}
