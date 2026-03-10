import ProductCard from "@/src/components/productCard"
import { Product } from "@/src/types/product.type"
import Image from "next/image"
import Link from "next/link"
import productsData from "../../data/data.json"
import ShopClient from "@/src/components/shop/shopClient"


export default function ShopPage() {
  const products: Product[] = productsData.products

  return (
    <main>
      {/* 1. Shop Header / Breadcrumb */}
      <section className="relative h-[320px] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-white to-sky-50">
        <Image 
          src="/shop-banner.png"
          alt="UrbanWear shop banner"
          fill
          className="object-cover opacity-15 -z-10"
        />
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-semibold mb-3 tracking-tight text-slate-900">Shop all outfits</h1>
          <p className="text-sm md:text-base text-slate-600 mb-4">
            Hoodie, tee, denim, accessory — chọn theo style và filter theo loại.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Link href="/" className="font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span className="font-semibold text-slate-400">/</span>
            <span className="text-slate-500">Shop</span>
          </div>
        </div>
      </section>

      <ShopClient products={products} />

      {/* 5. Features Section */}
      <section className="bg-gradient-to-br from-white via-rose-50/40 to-sky-50/40 py-20 px-4 md:px-14">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <FeatureItem 
            icon="/trophy.svg" 
            title="Premium fabrics" 
            desc="Heavyweight cotton, soft fleece, quality denim." 
          />
          <FeatureItem 
            icon="/guarantee.svg" 
            title="14-day returns" 
            desc="Try at home, return if it’s not you." 
          />
          <FeatureItem 
            icon="/shipping.svg" 
            title="Free shipping" 
            desc="On orders over $80 within city." 
          />
          <FeatureItem 
            icon="/support.svg" 
            title="Style support" 
            desc="Chat with stylists for fit & sizing." 
          />
        </div>
      </section>
    </main>
  )
}

function FeatureItem({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-[60px] h-[60px]">
        <Image src={icon} alt={title} fill />
      </div>
      <div>
        <h4 className="text-xl font-semibold text-slate-900">{title}</h4>
        <p className="text-slate-600 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
