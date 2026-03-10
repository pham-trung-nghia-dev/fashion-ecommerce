 "use client"

import { useSearchParams } from "next/navigation"
import ProductGridSection from "@/src/components/home/ProductGridSection"
import type { Product } from "@/src/types/product.type"
import type { ApiCategory } from "@/src/lib/api"

export default function ProductsContent({
  products,
  categories,
}: {
  products: Product[]
  categories: ApiCategory[]
}) {
  const searchParams = useSearchParams()
  const rawId = searchParams.get("category_id")
  const id = rawId ? Number(rawId) : undefined

  const active = id ? categories.find((c) => c.id === id) : undefined
  const title =
    active?.slug === "san-pham-hot"
      ? "Sản phẩm HOT"
      : active?.name ?? "Tất cả sản phẩm"

  return <ProductGridSection title={title} products={products} />
}

