import productsData from "@/src/data/data.json"
import ProductCard from "@/src/components/productCard"

export default function MenPage() {
  const products = (productsData as any).products

  return (
    <main>
      <section className="bg-black text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-400">Category</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight">Menswear</h1>
          <p className="mt-4 text-sm md:text-base text-gray-300 max-w-2xl">
            Oversized hoodies, relaxed tees, denim and outerwear styled for every day.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-14 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}

