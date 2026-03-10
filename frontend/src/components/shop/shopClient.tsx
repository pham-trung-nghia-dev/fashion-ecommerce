"use client"

import { useMemo, useState } from "react"
import ProductCard from "@/src/components/productCard"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Product } from "@/src/types/product.type"

type SortKey = "featured" | "price-asc" | "price-desc"
type FilterKey = "all" | "new" | "sale"

function parsePrice(value: unknown): number {
  if (typeof value === "number") return value
  if (typeof value !== "string") return 0
  // Supports formats like "2.500.000" or "250000"
  const normalized = value.replace(/[^\d]/g, "")
  const n = Number(normalized)
  return Number.isFinite(n) ? n : 0
}

export default function ShopClient({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<FilterKey>("all")
  const [sort, setSort] = useState<SortKey>("featured")

  const filtered = useMemo(() => {
    const base = products.filter((p) => {
      if (filter === "new") return Boolean((p as any).isNew)
      if (filter === "sale") return Boolean((p as any).discount)
      return true
    })

    const sorted = [...base].sort((a, b) => {
      if (sort === "featured") return 0
      const pa = parsePrice((a as any).price)
      const pb = parsePrice((b as any).price)
      if (sort === "price-asc") return pa - pb
      return pb - pa
    })

    return sorted
  }, [products, filter, sort])

  const metaBadges = useMemo(() => {
    const total = products.length
    const countNew = products.filter((p) => Boolean((p as any).isNew)).length
    const countSale = products.filter((p) => Boolean((p as any).discount)).length
    return { total, countNew, countSale }
  }, [products])

  return (
    <section className="container mx-auto px-4 md:px-14 py-12">
      <div className="rounded-3xl border border-slate-100 bg-white/80 backdrop-blur-sm p-6 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Bộ sưu tập sản phẩm
              </h2>
              <Badge variant="secondary" className="rounded-full">
                {metaBadges.total} items
              </Badge>
              {metaBadges.countNew > 0 && (
                <Badge className="rounded-full bg-rose-600 text-white">
                  New {metaBadges.countNew}
                </Badge>
              )}
              {metaBadges.countSale > 0 && (
                <Badge className="rounded-full bg-amber-500 text-white">
                  Sale {metaBadges.countSale}
                </Badge>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Chọn loại sản phẩm và sắp xếp theo giá. (Demo filter: All / New / Sale)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterKey)}>
              <TabsList className="rounded-full bg-slate-50 border border-slate-100">
                <TabsTrigger value="all" className="rounded-full px-4">
                  All
                </TabsTrigger>
                <TabsTrigger value="new" className="rounded-full px-4">
                  New
                </TabsTrigger>
                <TabsTrigger value="sale" className="rounded-full px-4">
                  Sale
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Separator orientation="vertical" className="hidden sm:block h-8" />

            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-[220px] rounded-full border-slate-200 bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

