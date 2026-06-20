import Image from "next/image"
import Link from "next/link"
import { getPost, getPosts } from "@/src/lib/api"
import { notFound } from "next/navigation"
import { Calendar, ChevronLeft, User, Share2, Sparkles, BookOpen } from "lucide-react"

interface NewsDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params
  const article = await getPost(Number(id))

  if (!article) notFound()

  // Fetch related articles
  let relatedArticles: any[] = []
  try {
    const list = await getPosts()
    relatedArticles = list.filter((a) => a.id !== Number(id)).slice(0, 3)
  } catch {}

  return (
    <main className="w-full bg-slate-50 min-h-screen py-10">
      <section className="mx-auto max-w-4xl px-4">
        {/* Navigation Breadcrumb & Back button */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/news" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Quay lại tin tức</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/home" className="hover:text-zinc-950">Trang chủ</Link>
            <span>&gt;</span>
            <Link href="/news" className="hover:text-zinc-950">Tin tức</Link>
            <span>&gt;</span>
            <span className="max-w-[200px] truncate text-zinc-900 font-medium">{article.title}</span>
          </nav>
        </div>

        {/* Article Card Wrapper */}
        <article className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-zinc-100/50 space-y-8">
          {/* Metadata Header */}
          <header className="space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-red-600 font-bold uppercase tracking-widest">
              <Calendar className="h-3.5 w-3.5" />
              {article.date}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-b border-zinc-100 py-3 text-xs text-zinc-500 font-medium">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-zinc-400" />
                <span>Ban biên tập FASHION</span>
              </span>
              <span className="text-zinc-300">|</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
                <span>3 phút đọc</span>
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative h-[250px] md:h-[450px] w-full overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-100">
            <Image
              src={article.image || "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200"}
              alt={article.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Article Description Summary */}
          {article.description && (
            <p className="text-base md:text-lg font-medium text-zinc-700 italic border-l-4 border-amber-500 pl-4 py-1 leading-relaxed">
              {article.description}
            </p>
          )}

          {/* Article Main Content HTML */}
          <div
            className="prose max-w-none text-zinc-800 text-sm md:text-base leading-relaxed space-y-6 pt-2"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Footer details */}
          <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-xs font-semibold">#FashionTrend</span>
              <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-xs font-semibold">#StylingTips</span>
            </div>
            <button className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-xs font-semibold cursor-pointer">
              <Share2 className="h-4 w-4" />
              <span>Chia sẻ</span>
            </button>
          </div>
        </article>

        {/* Related Articles list */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 space-y-6">
            <h3 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span>Bài viết liên quan</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <Link href={`/news/${item.id}`} key={item.id} className="group">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-100/50 hover:shadow-md transition-all h-full flex flex-col justify-between p-4 space-y-4">
                    <div className="space-y-3">
                      <div className="relative h-[150px] w-full overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-100">
                        <Image src={item.image} alt={item.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block">{item.date}</span>
                      <h4 className="font-bold text-sm text-zinc-900 line-clamp-2 leading-snug group-hover:text-zinc-600 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <span className="text-xs text-zinc-900 font-bold tracking-wider uppercase group-hover:underline flex items-center gap-1 mt-2">
                      Đọc tiếp &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </section>
    </main>
  )
}
