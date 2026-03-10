import Image from "next/image"
import Link from "next/link"
import { getPost } from "@/src/lib/api"
import { notFound } from "next/navigation"

interface NewsDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params
  const article = await getPost(Number(id))

  if (!article) notFound()

  return (
    <main className="w-full bg-white">
      <section className="mx-auto max-w-6xl px-4 py-8">
        <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500 md:text-sm">
          <Link href="/home" className="hover:text-slate-900">
            Trang chủ
          </Link>
          <span className="text-slate-400">&gt;</span>
          <Link href="/news" className="hover:text-slate-900">
            Tin tức
          </Link>
          <span className="text-slate-400">&gt;</span>
          <span className="line-clamp-1 font-medium text-slate-900">{article.title}</span>
        </nav>

        <header className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-500">
            {article.date}
          </p>
          <h1 className="mt-2 text-xl font-semibold text-slate-900 md:text-2xl">
            {article.title}
          </h1>
        </header>

        <div className="relative mb-6 h-48 w-full overflow-hidden rounded-md bg-slate-100 md:h-72">
          <Image
            src={article.image || "/shop-banner.png"}
            alt={article.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <article
          className="prose max-w-none text-sm text-slate-700 prose-p:mb-3"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </section>
    </main>
  )
}
