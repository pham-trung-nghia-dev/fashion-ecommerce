import ProductCard, { type Product } from "./ProductCard"

interface ProductGridProps {
  title: string
  products: Product[]
}

const ProductGrid = ({ title, products }: ProductGridProps) => {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.28em] text-slate-900">
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductGrid

import type { Product } from "@/src/types/product.type";
import ProductCard from "@/src/components/productCard";

interface ProductGridProps {
  title: string;
  products: Product[];
  highlightFirst?: boolean;
}

export function ProductGrid({ title, products, highlightFirst }: ProductGridProps) {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.25em]">
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              // @ts-expect-error allow optional highlight prop on card
              highlight={highlightFirst && index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

