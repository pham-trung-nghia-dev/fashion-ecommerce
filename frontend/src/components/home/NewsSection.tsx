import Image from "next/image"
import Link from "next/link"

export type NewsItem = {
  id: number
  title: string
  date: string
  description: string
  content: string
  image: string
}

export const mockNews: NewsItem[] = [
  {
    id: 1,
    title: 'Thử thách "MÙA YÊU" – 100% nhận quà',
    date: "15/02/2023",
    description:
      "Lòa loa loa! KẾT QUẢ VÒNG 1 đã có với rất nhiều bài dự thi đầy sáng tạo, cảm xúc...",
    content:
      "Lòa loa loa! KẾT QUẢ VÒNG 1 đã có với rất nhiều bài dự thi đầy sáng tạo, cảm xúc. Chương trình \"Thử thách MÙA YÊU\" nhằm lan tỏa năng lượng tích cực, khuyến khích khách hàng chia sẻ khoảnh khắc cùng trang phục yêu thích. Khi tham gia, bạn chỉ cần chụp hình outfit cùng 360 Boutique, đăng tải lên mạng xã hội kèm hashtag chương trình và tag fanpage để nhận ngay quà tặng.\n\nNgoài ra, khách hàng còn có cơ hội nhận thêm voucher mua sắm và quà tặng đặc biệt khi đến trực tiếp hệ thống cửa hàng trong thời gian diễn ra chương trình.",
    image: "/shop-banner.png",
  },
  {
    id: 2,
    title: "Đón Xuân sang – Lên đồ Tết | Ưu đãi tới 50%",
    date: "14/02/2023",
    description:
      "Ưu đãi tới 50% cho hàng trăm sản phẩm trong BST Xuân – Hè tại toàn bộ hệ thống cửa hàng...",
    content:
      "Chào đón mùa Xuân với chương trình ưu đãi lớn nhất năm: giảm giá lên tới 50% cho hàng trăm sản phẩm thuộc BST Xuân – Hè. Các thiết kế áo thun, sơ mi, quần jeans, kaki đều được cập nhật phom dáng mới, màu sắc tươi sáng, dễ phối đồ.\n\nƯu đãi áp dụng tại toàn bộ hệ thống cửa hàng và kênh online trong thời gian giới hạn. Đừng bỏ lỡ cơ hội làm mới tủ đồ với mức giá cực kỳ hấp dẫn.",
    image: "/hero-bg.jpg",
  },
  {
    id: 3,
    title: "Không khí năm mới, nhận lì xì cực hấp dẫn",
    date: "13/02/2023",
    description:
      "Check-in tại cửa hàng, tham gia minigame nhận lì xì đầu năm với nhiều phần quà bất ngờ...",
    content:
      "Không khí năm mới rộn ràng tại 360 Boutique với chương trình lì xì đầu năm dành cho mọi khách ghé cửa hàng. Chỉ cần check-in tại cửa hàng, tham gia minigame đơn giản, bạn đã có thể nhận ngay phong bao lì xì may mắn cùng nhiều phần quà dễ thương.\n\nBên cạnh đó, các combo mua sắm đầu năm cũng được áp dụng với mức giá ưu đãi, giúp bạn dễ dàng chọn lựa outfit phù hợp cho công việc và những buổi gặp mặt đầu xuân.",
    image: "/shop-banner.png",
  },
]

type NewsSectionProps = { posts?: NewsItem[]; limit?: number }

const NewsSection = ({ posts, limit = 3 }: NewsSectionProps) => {
  const items = posts && posts.length > 0 ? posts : mockNews
  const displayItems = limit > 0 ? items.slice(0, limit) : items
  const showMoreButton = limit > 0 && items.length > limit
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.28em] text-slate-900">
          Tin tức
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {displayItems.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <article>
                <div className="relative h-32 w-full md:h-36">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="space-y-2 px-4 pb-4 pt-3 text-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-500">
                    {item.date}
                  </p>
                  <h3 className="line-clamp-2 text-[13px] font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <div
                    className="line-clamp-3 text-[12px] text-slate-600 [&>*]:inline [&>p]:mb-0"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              </article>
            </Link>
          ))}
        </div>

        {showMoreButton && (
          <div className="mt-6 flex justify-center">
            <Link
              href="/news"
              className="rounded-full border border-slate-300 px-5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-800 hover:border-slate-500"
            >
              Xem thêm tin tức
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default NewsSection

