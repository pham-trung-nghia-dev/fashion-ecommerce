"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useContext, useEffect } from "react"
import { useParams } from "next/navigation"
import { Star, StarHalf, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/src/context/cartContext"
import { showMessage } from "@/src/utils/notification"
import { getProduct, getProducts } from "@/src/lib/api"
import type { ApiProduct } from "@/src/lib/api"
import ProductGridSection from "@/src/components/home/ProductGridSection"
import { formatPriceVND } from "@/src/utils/format"
import { Badge } from "@/components/ui/badge"

const ProductDetail = () => {
  const params = useParams()
  const productId = Number(params?.id)

  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<ApiProduct | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([])
  const { addToCart } = useCart()

  useEffect(() => {
    let cancelled = false
    Promise.all([getProduct(productId), getProducts({ limit: 4 })])
      .then(([p, list]) => {
        if (!cancelled) {
          setProduct(p ?? null)
          setRelatedProducts(Array.isArray(list) ? list.filter((x) => x.id !== productId).slice(0, 4) : [])
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProduct(null)
          setRelatedProducts([])
        }
      })
    return () => { cancelled = true }
  }, [productId])

  if (product === null && relatedProducts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-10">
        <p className="text-center text-slate-500">Đang tải...</p>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-10">
        <p className="text-center text-slate-600">Không tìm thấy sản phẩm.</p>
        <p className="mt-4 text-center">
          <Link href="/products" className="text-primary underline">Quay lại danh sách</Link>
        </p>
      </main>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  return (
    <main className="container mx-auto px-4 md:px-14 py-10">
      {/* 1. Breadcrumb */}
      <nav className="mb-10 flex items-center gap-2 text-sm text-slate-500 md:gap-4 md:text-base">
        <Link href="/home" className="hover:text-slate-900">Trang chủ</Link>
        <span className="font-bold text-slate-400">&gt;</span>
        <Link href="/products" className="hover:text-slate-900">Sản phẩm</Link>
        <span className="font-bold text-slate-400">&gt;</span>
        <span className="font-medium text-slate-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* 2. Left Side: Product Gallery */}
        <div className="flex flex-col-reverse gap-6 md:flex-row">
          {/* Thumbnails */}
          <div className="flex gap-4 md:flex-col">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative h-20 w-16 cursor-pointer overflow-hidden rounded border border-slate-200 bg-slate-50"
              >
                <Image src={product.image} alt={product.name} fill unoptimized className="object-cover" />
              </div>
            ))}
          </div>
          {/* Main Image */}
          <div className="relative h-[420px] flex-1 overflow-hidden rounded border border-slate-200 bg-slate-50 md:h-[500px]">
            <Image src={product.image} alt={product.name} fill unoptimized className="object-contain p-6" />
          </div>
        </div>

        {/* 3. Right Side: Product Info */}
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold md:text-[32px]">{product.name}</h1>

          {/* Giá: giá hiện tại, giá gốc (nếu có), badge giảm giá */}
          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-xl font-semibold text-red-600 md:text-2xl">
              ₫ {formatPriceVND(product.price)}
            </p>
            {product.oldPrice && Number(product.oldPrice) > 0 && (
              <p className="text-slate-400 text-lg line-through">
                ₫ {formatPriceVND(product.oldPrice)}
              </p>
            )}
            {product.discount != null && product.discount > 0 && (
              <Badge className="rounded-full bg-amber-500 text-white">
                Giảm {product.discount}%
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex text-[#FFC700]">
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <StarHalf fill="currentColor" size={20} />
            </div>
            <Separator orientation="vertical" className="h-5 bg-[#9F9F9F]" />
            <span className="text-[#9F9F9F] text-sm">5 Customer Review</span>
          </div>

          <p className="max-w-[460px] text-[13px] leading-relaxed text-slate-700">
            {product.subTitle || "Mẫu áo với phom dáng trẻ trung, chất liệu thoáng mát, dễ phối cùng quần jeans hoặc quần kaki cho nhiều dịp khác nhau."}
          </p>

          {/* Size Selection */}
          <div className="space-y-3">
            <span className="text-[#9F9F9F] text-sm">Size</span>
            <RadioGroup defaultValue="L" className="flex gap-4">
              {["L", "XL", "XS"].map((size) => (
                <div key={size}>
                  <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                  <Label
                    htmlFor={`size-${size}`}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F9F1E7] text-sm peer-data-[state=checked]:bg-[#B88E2F] peer-data-[state=checked]:text-white cursor-pointer transition-all"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <span className="text-[#9F9F9F] text-sm">Color</span>
            <div className="flex gap-4">
              <div className="w-[30px] h-[30px] rounded-full bg-[#816DFA] cursor-pointer" />
              <div className="w-[30px] h-[30px] rounded-full bg-[#000000] cursor-pointer" />
              <div className="w-[30px] h-[30px] rounded-full bg-[#B88E2F] cursor-pointer" />
            </div>
          </div>

          {/* Actions: Quantity & Add to Cart */}
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex h-12 items-center rounded-lg border border-[#9F9F9F] px-4 md:h-14">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
            </div>
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="h-12 rounded-full border-black px-10 text-sm font-semibold uppercase tracking-[0.18em] hover:bg-black hover:text-white md:h-14"
            >
              Thêm vào giỏ hàng
            </Button>
          </div>

          <Separator className="my-10" />

          {/* Meta Info */}
          <div className="space-y-3 text-[#9F9F9F]">
            <div className="flex gap-4"><span className="w-20">SKU</span><span>: {product.sku || "SS001"}</span></div>
            <div className="flex gap-4"><span className="w-20">Category</span><span>: Thời trang</span></div>
            <div className="flex gap-4"><span className="w-20">Tags</span><span>: Modern, Stylist, Shop</span></div>
          </div>
        </div>
      </div>

      {/* 4. Tabs Section (Description, Info) */}
      <div className="mt-20 border-t pt-10">
        <Tabs defaultValue="desc" className="w-full">
          <TabsList className="flex justify-center bg-transparent gap-10 h-auto mb-8">
            <TabsTrigger
              value="desc"
              className="p-0 text-lg text-[#9F9F9F] shadow-none data-[state=active]:text-black data-[state=active]:font-semibold md:text-2xl"
            >
              Mô tả sản phẩm
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className="p-0 text-lg text-[#9F9F9F] shadow-none data-[state=active]:text-black data-[state=active]:font-semibold md:text-2xl"
            >
              Thông tin thêm
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="desc"
            className="mx-auto max-w-[1026px] space-y-6 text-center text-sm text-slate-600 animate-fade-in"
          >
            <p className="whitespace-pre-line text-slate-700 leading-relaxed text-left max-w-2xl mx-auto">
              {product.description || "Thiết kế đơn giản, dễ mặc hằng ngày. Chất liệu co giãn nhẹ giúp vận động thoải mái, phù hợp đi làm, đi chơi, gặp gỡ bạn bè."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative h-[260px] overflow-hidden rounded-lg bg-[#F9F1E7]">
                <Image src={product.image} fill unoptimized alt={product.name} className="object-cover" />
              </div>
              <div className="relative h-[260px] overflow-hidden rounded-lg bg-[#F9F1E7]">
                <Image src={product.image} fill unoptimized alt={product.name} className="object-cover" />
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="info"
            className="mx-auto max-w-[800px] space-y-3 text-sm text-slate-600 text-left"
          >
            <p><strong>Chất liệu:</strong> Cotton thoáng mát, co giãn và giữ phom dáng tốt.</p>
            <p><strong>Hướng dẫn bảo quản:</strong> Giặt máy ở nhiệt độ thường, chế độ giặt nhẹ, tránh chất tẩy rửa mạnh, phơi trong bóng râm để giữ màu sản phẩm lâu bền.</p>
            {product.stock != null && <p><strong>Tình trạng hàng hóa:</strong> {product.stock > 0 ? `Còn hàng (Còn lại ${product.stock} sản phẩm)` : 'Tạm hết hàng'}</p>}
          </TabsContent>
        </Tabs>
      </div>

      {/* 5. Sản phẩm bán chạy phía dưới */}
      <ProductGridSection
        title="Sản phẩm bán chạy"
        products={relatedProducts as any}
      />
    </main>
  )
}

export default ProductDetail
