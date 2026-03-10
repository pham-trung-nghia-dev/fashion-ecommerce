import productsData from "@/src/data/data.json"
import ProductCard from "@/src/components/productCard"

export default function SalePage() {
  const products = (productsData as any).products
  const saleProducts = products.filter((p: any) => p.discount)

  return (
    <main>
      <section className="bg-amber-900 text-amber-50 py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-200">Now live</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight">
            Mid‑season sale
          </h1>
          <p className="mt-4 text-sm md:text-base text-amber-100 max-w-2xl">
            Up to {Math.max(...saleProducts.map((p: any) => p.discount || 0))}% off selected pieces.
            Limited sizes & colours.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-14 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {saleProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}

