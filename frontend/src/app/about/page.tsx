export default function AboutPage() {
  return (
    <main className="w-full bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-center text-2xl font-semibold uppercase tracking-[0.25em] text-slate-900">
          Giới thiệu
        </h1>
        <p className="mt-4 text-center text-sm text-slate-600">
          Thương hiệu thời trang được yêu thích với phong cách trẻ trung, năng động, phù hợp đi
          làm, đi học và dạo phố mỗi ngày.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="space-y-4 text-sm leading-relaxed text-slate-700">
            <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-slate-900">
              Câu chuyện thương hiệu
            </h2>
            <p>
              Bắt đầu từ niềm đam mê thời trang đường phố, chúng tôi mong muốn mang đến cho khách
              hàng những thiết kế dễ mặc, dễ phối nhưng vẫn thể hiện cá tính riêng.
            </p>
            <p>
              Mỗi sản phẩm đều được chăm chút từ chất liệu, phom dáng đến đường may để mang lại
              trải nghiệm thoải mái nhất.
            </p>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-slate-700">
            <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-slate-900">
              Giá trị cốt lõi
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Chất lượng ổn định, bền đẹp theo thời gian.</li>
              <li>Thiết kế cập nhật xu hướng nhưng vẫn ứng dụng cao.</li>
              <li>Dịch vụ chăm sóc khách hàng tận tâm, nhanh chóng.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}

