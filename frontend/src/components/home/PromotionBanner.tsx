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
