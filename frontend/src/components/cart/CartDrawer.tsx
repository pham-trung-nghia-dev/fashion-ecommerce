"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/src/store/useCartStore";
import { useUIStore } from "@/src/store/useUIStore";
import { formatPriceVND } from "@/src/utils/format";

const FREE_SHIPPING_THRESHOLD = 500000;

export default function CartDrawer() {
  const { isCartDrawerOpen, closeCartDrawer } = useUIStore();
  const { items, updateQuantity, removeItem, getSubtotal, getTotalItems } = useCartStore();

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Khóa scroll khi mở drawer
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartDrawerOpen]);

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop mờ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          />

          {/* Slide Drawer từ bên phải */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-slate-900" />
                <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                  Giỏ hàng ({totalItems})
                </h2>
              </div>
              <button
                onClick={closeCartDrawer}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                aria-label="Đóng giỏ hàng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Thanh tiến trình Free Shipping */}
            <div className="border-b bg-slate-50 px-6 py-3">
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                {remainingForFreeShip > 0 ? (
                  <span>
                    Mua thêm{" "}
                    <strong className="text-rose-600">
                      {formatPriceVND(remainingForFreeShip)}₫
                    </strong>{" "}
                    để được <strong className="text-emerald-600">FREESHIP</strong>
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    🎉 Bạn đã đủ điều kiện Miễn phí vận chuyển!
                  </span>
                )}
                <span>{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Danh sách sản phẩm trong giỏ */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <p className="text-base font-medium text-slate-800">
                    Giỏ hàng của bạn đang trống
                  </p>
                  <p className="mt-1 text-xs text-slate-500 max-w-xs">
                    Hãy dạo quanh cửa hàng và chọn những bộ trang phục thời thượng yêu thích nhé!
                  </p>
                  <button
                    onClick={closeCartDrawer}
                    className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-slate-800 transition"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4">
                    {/* Thumbnail */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 border">
                      <Image
                        src={item.image || "/shop-banner.png"}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    {/* Chi tiết */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-xs font-semibold text-slate-900 line-clamp-1">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-rose-600 transition p-0.5"
                            title="Xoá sản phẩm"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Size: <span className="font-medium text-slate-700">{item.size}</span> | Màu: <span className="font-medium text-slate-700">{item.color}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Bộ đếm số lượng */}
                        <div className="flex items-center rounded-full border border-slate-200 bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="flex h-6 w-6 items-center justify-center text-slate-600 hover:text-black transition"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="flex h-6 w-6 items-center justify-center text-slate-600 hover:text-black transition"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Giá */}
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-900">
                            {formatPriceVND(item.price * item.quantity)}₫
                          </p>
                          {item.oldPrice && (
                            <p className="text-[10px] text-slate-400 line-through">
                              {formatPriceVND(item.oldPrice * item.quantity)}₫
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer giỏ hàng */}
            {items.length > 0 && (
              <div className="border-t bg-slate-50 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Tạm tính:</span>
                  <span className="text-lg font-bold text-rose-600">
                    {formatPriceVND(subtotal)}₫
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 text-center">
                  Thuế VAT và phí vận chuyển sẽ được tính tại bước thanh toán.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    onClick={closeCartDrawer}
                    className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-100 transition text-center"
                  >
                    Xem giỏ hàng
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeCartDrawer}
                    className="flex items-center justify-center gap-1 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-600 transition shadow-md shadow-slate-900/10 text-center"
                  >
                    Thanh toán
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

