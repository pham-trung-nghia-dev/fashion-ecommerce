import React from "react"
import Link from "next/link"

// Định nghĩa Interface cho dữ liệu category
interface Category {
  id: number;
  name: string;
  image: string;
}

const BrowseRange: React.FC = () => {
  const categories: Category[] = [
    {
      id: 1,
      name: "Tops",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Bottoms",
      image:
        "https://images.unsplash.com/photo-1520975958225-1f5f2f2f4b5a?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Outerwear",
      image:
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
    }
  ];

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 md:px-14 py-14">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Categories
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-slate-900">
              Shop by category
            </h2>
          </div>
          <Link href="/shop" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            View all
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?cat=${encodeURIComponent(category.name.toLowerCase())}`}
              className="group block"
            >
              <div className="overflow-hidden border border-slate-200 bg-slate-50">
                <div className="relative aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
                <span className="text-sm text-slate-500 group-hover:text-slate-900 transition-colors">
                  Shop →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseRange;