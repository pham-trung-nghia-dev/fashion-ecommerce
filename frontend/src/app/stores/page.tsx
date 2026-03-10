import { getStores } from "@/src/lib/api"

export default async function StoresPage() {
  let stores: { id: number; name: string; address: string; hotline: string }[] = []
  try {
    stores = await getStores()
  } catch {}

  return (
    <main className="w-full bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-center text-2xl font-semibold uppercase tracking-[0.25em] text-slate-900">
          Hệ thống cửa hàng
        </h1>
        <p className="mt-4 text-center text-sm text-slate-600">
          Danh sách cửa hàng trên toàn quốc, bạn có thể ghé thử đồ trực tiếp và nhận tư vấn.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {stores.length === 0 ? (
            <p className="col-span-2 text-center text-sm text-slate-500">Chưa có thông tin cửa hàng.</p>
          ) : (
            stores.map((store) => (
              <div
                key={store.id}
                className="rounded-md border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm"
              >
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
                  {store.name}
                </h2>
                <p className="mt-2 text-sm text-slate-700">{store.address}</p>
                <p className="mt-1 text-sm text-slate-700">Hotline: {store.hotline}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
