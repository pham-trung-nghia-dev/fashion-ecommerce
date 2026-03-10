import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  // Hiện tại chỉ là mock UI, dữ liệu thực tế đang hiển thị trong CartPopup
  return (
    <main className="container mx-auto px-4 md:px-14 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold mb-8">Shopping cart</h1>
      <p className="text-muted-foreground mb-8">
        Giỏ hàng chi tiết sẽ được đồng bộ với popup cart. Hiện tại, hãy tiếp tục tới trang thanh toán.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link href="/shop">
          <Button variant="outline">Tiếp tục mua sắm</Button>
        </Link>
        <Link href="/checkout">
          <Button>Tiến hành thanh toán</Button>
        </Link>
      </div>
    </main>
  )
}

