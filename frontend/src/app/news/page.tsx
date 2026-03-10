import NewsSection from "@/src/components/home/NewsSection"
import { getPosts } from "@/src/lib/api"

export default async function NewsPage() {
  let posts: { id: number; title: string; date: string; description: string; content: string; image: string }[] = []
  try {
    posts = await getPosts()
  } catch {}

  return (
    <main className="w-full bg-white">
      <NewsSection posts={posts.length > 0 ? posts : undefined} limit={999} />
    </main>
  )
}
