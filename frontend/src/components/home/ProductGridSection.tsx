import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatPriceVND } from "@/src/utils/format"
import type { Product } from "@/src/types/product.type"

interface ProductGridSectionProps {
  title: string
  products: Product[]
}

const ProductGridSection = ({ title, products }: ProductGridSectionProps) => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.28em] text-slate-900">
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="group relative flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative mb-3 h-56 w-full overflow-hidden rounded-lg bg-slate-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
                {product.isNew && (
                  <Badge className="absolute left-2 top-2 rounded-full bg-rose-600 text-white text-[10px]">
                    New
                  </Badge>
                )}
                {product.discount != null && product.discount > 0 && (
                  <Badge className="absolute right-2 top-2 rounded-full bg-amber-500 text-white text-[10px]">
                    -{product.discount}%
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-800 md:text-sm line-clamp-2">{product.name}</p>
              <div className="mt-1 flex flex-wrap items-baseline justify-center gap-1.5">
                <span className="text-xs font-semibold text-red-600 md:text-sm">
                  ₫ {formatPriceVND(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-slate-400 line-through text-[10px] md:text-xs">
                    ₫ {formatPriceVND(product.oldPrice)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductGridSection

