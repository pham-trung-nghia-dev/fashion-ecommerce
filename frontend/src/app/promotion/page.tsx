import { getPromotions } from "@/src/lib/api"

export default async function PromotionPage() {
  let promotions: { id: number; title: string; time: string; description: string }[] = []
  try {
    promotions = await getPromotions()
  } catch {}

  return (
    <main className="w-full bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-center text-2xl font-semibold uppercase tracking-[0.25em] text-slate-900">
          Khuyến mãi
        </h1>

        <div className="mt-8 space-y-4">
          {promotions.length === 0 ? (
            <p className="text-center text-sm text-slate-500">Chưa có chương trình khuyến mãi.</p>
          ) : (
            promotions.map((promo) => (
              <article
                key={promo.id}
                className="rounded-md border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm"
              >
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
                  {promo.title}
                </h2>
                <p className="mt-1 text-[12px] font-medium text-red-600">{promo.time}</p>
                <p className="mt-2 text-sm text-slate-700">{promo.description}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
