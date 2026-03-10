interface PromotionBannerProps {
  title: string
  description: string
  ctaLabel?: string
}

const PromotionBanner = ({ title, description, ctaLabel }: PromotionBannerProps) => {
  return (
    <section className="bg-red-600 text-white">
      <div className="container mx-auto px-4 py-6 md:flex md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] opacity-80">
            Khuyến mãi
          </p>
          <h2 className="mt-1 text-lg font-semibold uppercase tracking-[0.22em] md:text-xl">
            {title}
          </h2>
          <p className="mt-2 max-w-md text-xs md:text-sm text-red-50">
            {description}
          </p>
        </div>
        {ctaLabel && (
          <button className="mt-4 inline-flex rounded-full border border-white px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-white hover:text-red-600 md:mt-0">
            {ctaLabel}
          </button>
        )}
      </div>
    </section>
  )
}

export default PromotionBanner

import Image from "next/image";

export function PromotionBanner() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
        <div className="relative h-32 w-full overflow-hidden rounded-md bg-red-700 text-white md:h-40">
          <Image
            src="/images/promo-main.jpg"
            alt="Khuyến mãi mùa yêu"
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] md:text-xs">
              THỬ THÁCH
            </p>
            <p className="text-2xl font-bold md:text-3xl">MÙA &quot;YÊU&quot;</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative h-28 w-full overflow-hidden rounded-md md:h-32"
            >
              <Image
                src={`/images/lookbook-${i}.jpg`}
                alt={`Lookbook ${i}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

