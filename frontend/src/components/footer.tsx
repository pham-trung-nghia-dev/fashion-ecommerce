import Image from "next/image"

const Footer = () => {
  return (
    <footer className="w-full bg-slate-50 text-[12px] text-slate-700">
      <div className="mx-auto max-w-6xl px-4 py-8 border-t border-slate-200">
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Hệ thống cửa hàng */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-900">
              Hệ thống cửa hàng
            </h3>
            <div className="mt-3 space-y-1">
              <p>CS1: 242 Thái Hà, Đống Đa, Hà Nội</p>
              <p>CS2: 63 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</p>
              <p>CS3: 242 Nguyễn Trãi, Thanh Xuân, Hà Nội</p>
              <p>...</p>
            </div>
          </div>

          {/* Chính sách & quy định */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-900">
              Chính sách &amp; quy định chung
            </h3>
            <div className="mt-3 space-y-1">
              <p>Chính sách mua hàng</p>
              <p>Chính sách đổi hàng</p>
              <p>Chính sách bảo hành</p>
              <p>Chính sách bảo mật thông tin</p>
            </div>
          </div>

          {/* Địa chỉ / liên hệ */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-900">
              Địa chỉ
            </h3>
            <div className="mt-3 space-y-1">
              <p>Công ty TNHH Thời trang XYZ</p>
              <p>Địa chỉ: Số 123 Đường ABC, Quận XYZ, Hà Nội</p>
              <p>Hotline: 0973 285 886</p>
              <p>Email: cskh@360boutique.vn</p>
            </div>
          </div>

          {/* Fanpage */}
          <div className="md:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-900">
              Fanpage
            </h3>
            <div className="mt-3 h-28 w-full overflow-hidden rounded-md bg-white shadow-sm">
              <Image
                src="/fanpage.png"
                alt="Fanpage 360 Boutique"
                width={320}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} 360 Boutique. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer