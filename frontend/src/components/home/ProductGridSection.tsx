"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPriceVND } from "@/src/utils/format";
import type { Product } from "@/src/types/product.type";
import { useCartStore } from "@/src/store/useCartStore";
import { useUIStore } from "@/src/store/useUIStore";

interface ProductGridSectionProps {
  title: string;
  products: Product[];
}

const ProductGridSection = ({ title, products }: ProductGridSectionProps) => {
  const { addItem } = useCartStore();
  const { openCartDrawer } = useUIStore();

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      size: "M",
      color: "Tiêu chuẩn",
      quantity: 1,
    });
    openCartDrawer();
  };

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-[0.2em] text-slate-900">
            {title}
          </h2>
          <div className="mx-auto mt-2 h-0.5 w-12 bg-slate-900" />
        </div>

        {products.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            Chưa có sản phẩm nào trong danh mục này.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 md:gap-x-6 md:gap-y-10">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-100 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image Container with Badges & Hover Actions */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-50">
                  <Link href={`/shop/${product.id}`} className="block h-full w-full">
                    <Image
                      src={product.image || "/shop-banner.png"}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Badges */}
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {product.isNew && (
                      <Badge className="rounded-full bg-slate-900 text-white text-[10px] font-semibold tracking-wider px-2.5 py-0.5">
                        NEW
                      </Badge>
                    )}
                    {product.discount != null && product.discount > 0 && (
                      <Badge className="rounded-full bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5">
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>

                  {/* Hover Quick Action Buttons */}
                  <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-lg hover:bg-rose-600 transition"
                      title="Thêm nhanh vào giỏ"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Thêm giỏ hàng</span>
                    </button>
                    <Link
                      href={`/shop/${product.id}`}
                      className="flex items-center justify-center rounded-lg bg-white p-2.5 text-slate-700 shadow-lg hover:bg-slate-100 transition"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-4 flex flex-col flex-1 justify-between text-center">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                      Thời trang thiết kế
                    </p>
                    <Link
                      href={`/shop/${product.id}`}
                      className="mt-1 block text-sm font-semibold text-slate-800 hover:text-rose-600 transition line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    {product.subTitle && (
                      <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">
                        {product.subTitle}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-baseline justify-center gap-2">
                    <span className="text-sm md:text-base font-bold text-rose-600">
                      {formatPriceVND(product.price)}₫
                    </span>
                    {product.oldPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatPriceVND(product.oldPrice)}₫
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGridSection;
