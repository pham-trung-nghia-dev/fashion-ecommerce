"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Star, StarHalf, Plus, Minus, ShoppingBag, ShieldCheck, RefreshCw, Truck, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/src/store/useCartStore";
import { useUIStore } from "@/src/store/useUIStore";
import { useProduct, useProducts } from "@/src/hooks/useProducts";
import ProductGridSection from "@/src/components/home/ProductGridSection";
import { formatPriceVND } from "@/src/utils/format";
import type { Product } from "@/src/types/product.type";

const SIZES = ["S", "M", "L", "XL"];
const COLORS = [
  { name: "Đen", hex: "#0f172a" },
  { name: "Trắng", hex: "#f8fafc" },
  { name: "Be", hex: "#d4b896" },
  { name: "Navy", hex: "#1e3a8a" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params?.id);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);

  const { addItem } = useCartStore();
  const { openCartDrawer } = useUIStore();

  const { data: product, isLoading, isError } = useProduct(productId);
  const { data: relatedProducts = [] } = useProducts({ limit: 4 });

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Đang tải thông tin sản phẩm...
        </p>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Không tìm thấy sản phẩm</h2>
        <p className="mt-2 text-sm text-slate-500">
          Sản phẩm có thể đã ngừng kinh doanh hoặc đường dẫn không chính xác.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-slate-800 transition"
        >
          Khám phá sản phẩm khác
        </Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity,
      sku: product.sku,
    });
    openCartDrawer();
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity,
      sku: product.sku,
    });
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b bg-slate-50">
        <div className="container mx-auto px-4 py-3 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition">Trang chủ</Link>
          <span className="mx-2 text-slate-300">/</span>
          <Link href="/products" className="hover:text-slate-900 transition">Sản phẩm</Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="font-semibold text-slate-900 truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Gallery Ảnh */}
          <div className="flex flex-col-reverse gap-4 md:flex-row">
            {/* Thumbnail list */}
            <div className="flex gap-3 md:flex-col shrink-0">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative h-20 w-16 md:h-24 md:w-20 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-800 transition"
                >
                  <Image
                    src={product.image || "/shop-banner.png"}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative aspect-[3/4] w-full flex-1 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
              <Image
                src={product.image || "/shop-banner.png"}
                alt={product.name}
                fill
                unoptimized
                priority
                className="object-cover"
              />
              {product.discount != null && product.discount > 0 && (
                <Badge className="absolute left-4 top-4 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow">
                  GIẢM {product.discount}%
                </Badge>
              )}
            </div>
          </div>

          {/* Chi Tiết Sản Phẩm & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {product.sku && (
                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
                  Mã SKU: {product.sku}
                </p>
              )}
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                {product.name}
              </h1>

              {/* Đánh giá sao */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex text-amber-400">
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <StarHalf fill="currentColor" size={16} />
                </div>
                <span className="text-xs text-slate-500 font-medium">(4.9/5 - 128 đánh giá)</span>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-semibold text-emerald-600">Còn hàng</span>
              </div>

              {/* Giá */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-extrabold text-rose-600">
                  {formatPriceVND(product.price)}₫
                </span>
                {product.oldPrice && (
                  <span className="text-base text-slate-400 line-through">
                    {formatPriceVND(product.oldPrice)}₫
                  </span>
                )}
              </div>

              {/* Mô tả ngắn */}
              <p className="mt-4 text-xs md:text-sm leading-relaxed text-slate-600 border-t border-slate-100 pt-4">
                {product.description ||
                  product.subTitle ||
                  "Sản phẩm thiết kế độc quyền, chất liệu cao cấp thoáng khí, phom dáng tôn nét hiện đại, thanh lịch."}
              </p>

              {/* Chọn Màu Sắc */}
              <div className="mt-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Màu sắc: <span className="font-normal text-slate-500">{selectedColor}</span>
                </label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        selectedColor === c.name
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-black/10"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chọn Kích Cỡ (Size) */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Kích cỡ: <span className="font-normal text-slate-500">{selectedSize}</span>
                  </label>
                  <button className="text-[11px] text-slate-500 underline hover:text-slate-800">
                    Bảng hướng dẫn chọn size
                  </button>
                </div>
                <div className="flex gap-2.5">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-10 w-12 items-center justify-center rounded-xl text-xs font-bold transition ${
                        selectedSize === size
                          ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                          : "border border-slate-200 bg-white text-slate-800 hover:border-slate-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Số lượng & Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Bộ đếm số lượng */}
                <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-2">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="flex h-8 w-8 items-center justify-center text-slate-600 hover:text-black transition"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="flex h-8 w-8 items-center justify-center text-slate-600 hover:text-black transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Nút Thêm vào giỏ */}
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 rounded-xl border-2 border-slate-900 bg-white text-slate-900 hover:bg-slate-50 font-bold uppercase tracking-wider text-xs gap-2 transition"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Thêm vào giỏ hàng
                </Button>

                {/* Nút Mua ngay */}
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold uppercase tracking-wider text-xs gap-2 transition shadow-lg shadow-slate-900/10"
                >
                  Mua ngay
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quyền lợi mua hàng */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-6 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Miễn phí giao hàng từ 500k</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Đổi trả miễn phí 30 ngày</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                <span>100% Chính hãng chuẩn phom</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t pt-12">
            <ProductGridSection
              title="Có thể bạn cũng thích"
              products={relatedProducts.filter((p) => p.id !== productId) as Product[]}
            />
          </div>
        )}
      </div>
    </main>
  );
}
