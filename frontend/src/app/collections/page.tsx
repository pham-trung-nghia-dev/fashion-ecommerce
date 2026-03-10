import productsData from "@/src/data/data.json"
import ProductCard from "@/src/components/productCard"

export default function CollectionsPage() {
  const products = (productsData as any).products

  return (
    <main>
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Drops</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight">
            Featured collections
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-200 max-w-2xl">
            Seasonal capsules and limited runs. Everything you need to build a clean, modern wardrobe.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-14 py-12 space-y-12">
        <div>
          <h2 className="mb-6 text-2xl font-semibold">Everyday Essentials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-semibold">Weekend Fits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

