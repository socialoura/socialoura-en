import ProductPage from "@/components/ProductPage";
import { getProductById } from "@/data/products";
import { notFound } from "next/navigation";

export default function InstagramFollowersPage() {
  const product = getProductById("instagram-followers");
  
  if (!product) {
    notFound();
  }

  return <ProductPage product={product} />;
}
