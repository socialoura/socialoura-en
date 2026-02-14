import ProductPage from "@/components/ProductPage";
import { getProductById } from "@/data/products";
import { notFound } from "next/navigation";

export default function FacebookLikesPage() {
  const product = getProductById("facebook-likes");
  
  if (!product) {
    notFound();
  }

  return <ProductPage product={product} />;
}
