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
