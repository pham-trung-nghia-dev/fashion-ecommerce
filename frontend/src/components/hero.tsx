import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const Hero = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 md:px-14 pt-10 md:pt-14 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.1fr] gap-10 items-end">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              New season
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.05]">
              Minimal fits,
              <span className="block">editorial feel.</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-slate-600">
              Clean essentials, modern silhouettes. Built for daily wear—easy to style, easy to love.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop">
                <Button className="rounded-none px-8 h-11">Shop all</Button>
              </Link>
              <Link href="/collections">
                <Button variant="outline" className="rounded-none px-8 h-11">
                  View lookbook
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm text-slate-600">
              <div>
                <div className="text-slate-900 font-semibold">Free shipping</div>
                <div>Orders over ₫799k</div>
              </div>
              <div>
                <div className="text-slate-900 font-semibold">Easy returns</div>
                <div>14 days</div>
              </div>
              <div>
                <div className="text-slate-900 font-semibold">New in weekly</div>
                <div>Limited drops</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[16/11] overflow-hidden rounded-none border border-slate-200 bg-slate-50">
              <Image src="/hero-bg.jpg" alt="Lookbook hero" fill className="object-cover" priority />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span className="uppercase tracking-[0.25em] text-xs">Lookbook</span>
              <span>Spring capsule 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
