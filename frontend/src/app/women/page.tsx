import productsData from "@/src/data/data.json"
import ProductCard from "@/src/components/productCard"

export default function WomenPage() {
  const products = (productsData as any).products

  return (
    <main>
      <section className="bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <p className="text-sm uppercase tracking-[0.25em] text-rose-100/80">
            Category
          </p>
          <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight">
            Womenswear
          </h1>
          <p className="mt-4 text-sm md:text-base text-rose-50 max-w-2xl">
            Dresses, tops, skirts and everyday sets built to mix & match.
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

