import HeroSection from "@/src/components/home/HeroSection"
import ProductGridSection from "@/src/components/home/ProductGridSection"
import NewsSection from "@/src/components/home/NewsSection"
import { getProducts, getBanners, getPosts } from "@/src/lib/api"
import type { Product } from "@/src/types/product.type"
import fallbackData from "@/src/data/data.json"

export default async function Home() {
  let products: Product[] = (fallbackData as { products: Product[] }).products
  let banners: { id: number; image: string }[] = []
  let posts: { id: number; title: string; date: string; description: string; content: string; image: string }[] = []

  try {
    const [productsRes, bannersRes, postsRes] = await Promise.all([
      getProducts({ limit: 20 }),
      getBanners(),
      getPosts(),
    ])
    if (productsRes.length > 0) products = productsRes as Product[]
    banners = bannersRes
    if (postsRes.length > 0) posts = postsRes
  } catch {
    // Dùng fallback khi API lỗi hoặc chưa chạy
  }

  const bestSeller = products.slice(0, 12)
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4)

  return (
    <main>
      <HeroSection slides={banners.length > 0 ? banners : undefined} />
      <ProductGridSection title="Sản phẩm bán chạy" products={bestSeller} />
      <ProductGridSection title="Hàng mới về" products={newArrivals} />
      <NewsSection posts={posts.length > 0 ? posts : undefined} />
    </main>
  )
}
