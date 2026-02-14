import ProductPage from "@/components/ProductPage";
import { getProductById } from "@/data/products";
import { notFound } from "next/navigation";

export default function InstagramLikesPage() {
  const product = getProductById("instagram-likes");
  
  if (!product) {
    notFound();
  }

  return <ProductPage product={product} />;
}
