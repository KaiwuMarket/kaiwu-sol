import { ProductDetail } from "@/components/product-detail"
import { ProductActivity } from "@/components/product-activity"
import { RelatedProducts } from "@/components/related-products"

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <div className="px-12 py-8">
        <ProductDetail productId={params.id} />
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
  )
}
