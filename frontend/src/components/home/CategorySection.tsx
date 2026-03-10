"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

export type Category = {
  id: string | number
  name: string
  slug: string
  href: string
}

interface CategorySectionProps {
  title?: string
  categories: Category[]
}

const CategorySection = ({ title = "Danh mục", categories }: CategorySectionProps) => {
  const searchParams = useSearchParams()
  const activeCategoryId = searchParams.get("category_id")

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.25em] text-slate-900">
          {title}
        </h2>

        {/* Grid: mobile 2 cột, tablet 3, desktop 4 – chỉ text, không hình */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => {
            const isAll = cat.slug === "tat-ca"
            const isActive =
              (!activeCategoryId && isAll) ||
              (activeCategoryId && String(cat.id) === activeCategoryId)
            const href = isAll ? "/products" : `/products?category_id=${cat.id}`

            return (
              <Link
                key={cat.id}
                href={href}
                className={`flex items-center justify-center rounded-md border px-4 py-6 text-xs font-semibold uppercase tracking-[0.18em] transition md:text-sm ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:-translate-y-1 hover:border-slate-400 hover:shadow-md"
                }`}
              >
                <span>{cat.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CategorySection