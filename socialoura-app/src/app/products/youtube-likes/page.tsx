import ProductPage from "@/components/ProductPage";
import { getProductById } from "@/data/products";
import { notFound } from "next/navigation";

export default function YouTubeLikesPage() {
  const product = getProductById("youtube-likes");
  
  if (!product) {
    notFound();
  }

  return <ProductPage product={product} />;
}
