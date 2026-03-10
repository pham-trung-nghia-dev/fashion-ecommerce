"use client"

import { useMemo, useState } from "react"
import type { Product } from "@/src/types/product.type"
import ProductCard from "@/src/components/productCard"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type TabKey = "all" | "new" | "sale"

export default function OurProductsSection({ products }: { products: Product[] }) {
  const [tab, setTab] = useState<TabKey>("all")

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (tab === "new") return Boolean((p as any).isNew)
      if (tab === "sale") return Boolean((p as any).discount)
      return true
    })
    return list.slice(0, 8)
  }, [products, tab])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-600">
              Our picks
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">
              Sản phẩm nổi bật
            </h2>
            <p className="mt-3 text-slate-600 max-w-xl">
              Layout mới theo kiểu thương mại điện tử: chọn tab theo loại, xem nhanh sản phẩm nổi bật.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
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

            <Link href="/shop">
              <Button variant="outline" className="rounded-full border-slate-200">
                Xem tất cả
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

