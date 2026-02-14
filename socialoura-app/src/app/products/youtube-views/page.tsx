import ProductPage from "@/components/ProductPage";
import { getProductById } from "@/data/products";
import { notFound } from "next/navigation";

export default function YouTubeViewsPage() {
  const product = getProductById("youtube-views");
  
  if (!product) {
    notFound();
  }

  return <ProductPage product={product} />;
}
