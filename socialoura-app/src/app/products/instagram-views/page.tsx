import ProductPage from "@/components/ProductPage";
import { getProductById } from "@/data/products";
import { notFound } from "next/navigation";

export default function InstagramViewsPage() {
  const product = getProductById("instagram-views");
  
  if (!product) {
    notFound();
  }

  return <ProductPage product={product} />;
}
