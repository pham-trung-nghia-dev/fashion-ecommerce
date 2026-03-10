import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-rose-50 via-white to-sky-50 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-600">
            Contact
          </p>
          <h1 className="mt-2 text-4xl md:text-5xl font-semibold text-slate-900">
            Liên hệ UrbanWear
          </h1>
          <p className="mt-4 text-slate-600">
            Bạn cần tư vấn size, chất liệu, hoặc tình trạng đơn hàng? Gửi tin nhắn cho tụi mình.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-14 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr,1fr] gap-10">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Gửi message</h2>
            <p className="mt-2 text-sm text-slate-600">
              Form demo UI (chưa connect API). Bạn có thể nối vào backend sau.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Họ và tên" />
              <Input placeholder="Email" />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Số điện thoại" />
              <Input placeholder="Chủ đề (Size/Order/Collab...)" />
            </div>
            <Textarea className="mt-4" placeholder="Nội dung..." rows={6} />
            <Button className="mt-6 rounded-full bg-rose-600 hover:bg-rose-500">
              Gửi liên hệ
            </Button>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">Hotline</h3>
              <p className="mt-2 text-slate-600">0900 000 000</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">Email</h3>
              <p className="mt-2 text-slate-600">support@urbanwear.vn</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">Địa chỉ</h3>
              <p className="mt-2 text-slate-600">
                123 Nguyễn Huệ, Quận 1, TP.HCM
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

