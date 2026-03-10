import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function CheckoutPage() {
  return (
    <main className="container mx-auto px-4 md:px-14 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.5fr] gap-12">
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Thông tin giao hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Họ và tên" />
            <Input placeholder="Số điện thoại" />
          </div>
          <Input placeholder="Email" className="mt-2" />
          <Input placeholder="Địa chỉ" className="mt-2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Input placeholder="Thành phố" />
            <Input placeholder="Quận / Huyện" />
          </div>
          <Textarea placeholder="Ghi chú cho đơn hàng (tuỳ chọn)" className="mt-4" />
        </section>

        <section className="space-y-6 border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold">Tóm tắt đơn hàng</h2>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tạm tính</span>
            <span>₫ 0</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Phí vận chuyển</span>
            <span>Tính khi thanh toán</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-semibold text-lg">
            <span>Tổng cộng</span>
            <span>₫ 0</span>
          </div>
          <Button className="w-full mt-4">Đặt hàng</Button>
        </section>
      </div>
    </main>
  )
}

