import { getJobs } from "@/src/lib/api"

export default async function CareersPage() {
  let jobs: { id: number; title: string; location: string; description: string }[] = []
  try {
    jobs = await getJobs()
  } catch {}

  return (
    <main className="w-full bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-center text-2xl font-semibold uppercase tracking-[0.25em] text-slate-900">
          Tuyển dụng
        </h1>
        <p className="mt-4 text-center text-sm text-slate-600">
          Gia nhập đội ngũ trẻ trung, năng động và cùng xây dựng những bộ sưu tập mới.
        </p>

        <div className="mt-8 space-y-4">
          {jobs.length === 0 ? (
            <p className="text-center text-sm text-slate-500">Chưa có tin tuyển dụng.</p>
          ) : (
            jobs.map((job) => (
              <article
                key={job.id}
                className="rounded-md border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm"
              >
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
                  {job.title}
                </h2>
                <p className="mt-1 text-[12px] font-medium text-slate-500">{job.location}</p>
                <p className="mt-2 text-sm text-slate-700">{job.description}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
