import CategorySection from "@/src/components/home/CategorySection"
import { getProducts, getCategories, type ApiCategory } from "@/src/lib/api"
import type { Product } from "@/src/types/product.type"
import fallbackData from "@/src/data/data.json"
import ProductsContent from "./ProductsContent"

// Luôn render động để searchParams (category) được áp dụng
export const dynamic = "force-dynamic"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category_id?: string }>
}) {
  const { category_id } = await searchParams
  const categoryId = category_id ? Number(category_id) : undefined

  // Nếu không filter theo danh mục thì dùng dữ liệu fallback,
  // còn khi đã chọn danh mục thì chỉ hiển thị đúng dữ liệu từ backend.
  let products: Product[] = categoryId
    ? []
    : (fallbackData as { products: Product[] }).products
  let categories: ApiCategory[] = []

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      getProducts({ category_id: categoryId }),
      getCategories(),
    ])
    if (productsRes.length > 0) products = productsRes as Product[]
    categories = categoriesRes
  } catch {}

  return (
    <main className="w-full bg-white">
      {categories.length > 0 && <CategorySection title="Danh mục sản phẩm" categories={categories} />}
      <ProductsContent products={products as Product[]} categories={categories} />
    </main>
  )
}
