import ProductPage from "@/components/ProductPage";
import { getProductById } from "@/data/products";
import { notFound } from "next/navigation";

export default function FacebookFollowersPage() {
  const product = getProductById("facebook-followers");
  
  if (!product) {
    notFound();
  }

  return <ProductPage product={product} />;
}
