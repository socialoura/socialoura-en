import ProductPage from "@/components/ProductPage";
import { getProductById } from "@/data/products";
import { notFound } from "next/navigation";

export default function YouTubeSubscribersPage() {
  const product = getProductById("youtube-subscribers");
  
  if (!product) {
    notFound();
  }

  return <ProductPage product={product} />;
}
