import { Product } from "@/types/product";
import ProductLayout from "./ProductLayout";
import { Target, Shield, BarChart3 } from "lucide-react";

interface ProductPageProps {
  product: Product;
}

export default function ProductPage({ product }: ProductPageProps) {
  return (
    <ProductLayout
      product={product}
      benefits={[
        {
          icon: <Target className="w-7 h-7" />,
          title: "AI-Powered Targeting",
          description: "Our machine-learning algorithms identify the most relevant audience for your content to maximize engagement.",
        },
        {
          icon: <Shield className="w-7 h-7" />,
          title: "100% Safe & Compliant",
          description: "Fully compliant with platform Terms of Service. Our AI monitors campaigns in real-time to keep your account safe.",
        },
        {
          icon: <BarChart3 className="w-7 h-7" />,
          title: "Real-Time Analytics",
          description: "Track your AI-driven campaign performance live. Full transparency, no hidden metrics.",
        },
      ]}
      zigzag={[
        {
          title: "Algorithm-Friendly AI Promotion",
          description: "Our AI places your content in front of genuinely interested audiences on ad networks, boosting organic reach and channel authority — naturally, and safely.",
        },
        {
          title: "Audience Filtering & Reputation",
          description: "Machine learning finds your ideal audience. We source engagement exclusively from verified, active profiles filtered through our multi-layer quality-control AI.",
        },
      ]}
    />
  );
}
