import { ProductDetail } from "@/components/product-detail";
import { ProductActivity } from "@/components/product-activity";
import { RelatedProducts } from "@/components/related-products";
import { notFound } from "next/navigation";

type ProductPageParams = Promise<{ id: string }> | { id: string };

export default async function ProductPage({
  params,
}: {
  params: ProductPageParams;
}) {
  const resolvedParams = await params;
  const productId = resolvedParams?.id;

  if (!productId) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="px-12 py-8">
        <ProductDetail productId={productId} />
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductActivity />
          </div>
          <div>
            <RelatedProducts />
          </div>
        </div>
      </div>
    </div>
  );
}
