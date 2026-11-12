'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/src/store/useCartStore';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Ticket, ArrowLeft, ShieldCheck } from 'lucide-react';
import { formatPriceVND } from '@/src/utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items: cart, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const subtotal = getSubtotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    const code = couponCode.trim().toUpperCase();
    if (code === 'FASHIONNEW') {
      setDiscountPercent(10);
      setAppliedCoupon(code);
      toast.success('Áp dụng mã giảm giá 10% thành công!');
    } else if (code === 'SUMMERSALE') {
      setDiscountPercent(20);
      setAppliedCoupon(code);
      toast.success('Áp dụng mã giảm giá 20% thành công!');
    } else {
      toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
    setCouponCode('');
  };

  const removeCoupon = () => {
    setDiscountPercent(0);
    setAppliedCoupon('');
    toast.success('Đã hủy áp dụng mã giảm giá.');
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal > 500000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal - discountAmount + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-slate-50 flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm text-center space-y-6"
        >
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800">Giỏ hàng của bạn đang trống</h2>
            <p className="text-xs text-slate-500">
              Có vẻ bạn chưa thêm sản phẩm nào. Hãy khám phá ngay các thiết kế mới nhất của chúng tôi nhé!
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-slate-800 transition"
          >
            Mua sắm ngay
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Tiếp tục chọn đồ
          </Link>
          <span className="text-xs text-slate-500 font-medium">
            Có <strong>{cart.length}</strong> sản phẩm trong giỏ
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột danh sách món hàng */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <h1 className="text-base font-bold uppercase tracking-wider text-slate-900 mb-4 pb-3 border-b border-slate-100">
                Chi tiết giỏ hàng
              </h1>

              <div className="divide-y divide-slate-100">
                <AnimatePresence initial={false}>
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="py-4 flex gap-4 items-center"
                    >
                      <div className="relative h-24 w-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border">
                        <Image
                          src={item.image || '/shop-banner.png'}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs md:text-sm font-semibold text-slate-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Size: <span className="font-medium text-slate-700">{item.size}</span> | Màu: <span className="font-medium text-slate-700">{item.color}</span>
                        </p>
                        <p className="text-xs md:text-sm font-bold text-rose-600 mt-2">
                          {formatPriceVND(item.price)}₫
                        </p>
                      </div>

                      {/* Bộ điều khiển số lượng */}
                      <div className="flex items-center rounded-full border border-slate-200 bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex h-7 w-7 items-center justify-center text-slate-600 hover:text-black transition"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex h-7 w-7 items-center justify-center text-slate-600 hover:text-black transition"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Nút Xoá */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition"
                        title="Xoá khỏi giỏ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Cột tóm tắt & Coupon */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
                Tổng thanh toán
              </h2>

              {/* Nhập mã giảm giá */}
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Mã: FASHIONNEW (-10%)"
                      className="w-full text-xs rounded-xl border border-slate-200 p-2.5 pl-8 outline-none uppercase font-semibold focus:border-slate-800"
                    />
                    <Ticket className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-slate-800 transition"
                  >
                    Áp dụng
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="mt-2 flex items-center justify-between bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                    <span>Đã dùng mã: <strong>{appliedCoupon}</strong> (-{discountPercent}%)</span>
                    <button onClick={removeCoupon} className="text-slate-400 hover:text-slate-600 text-xs">
                      Bỏ mã
                    </button>
                  </div>
                )}
              </div>

              {/* Chi tiết tính tiền */}
              <div className="border-t border-slate-100 pt-3 space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-slate-800">{formatPriceVND(subtotal)}₫</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Giảm giá</span>
                    <span>-{formatPriceVND(discountAmount)}₫</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí giao hàng</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-600">Miễn phí</strong> : `${formatPriceVND(shippingFee)}₫`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-3 border-t border-slate-200">
                  <span>Tổng tiền</span>
                  <span className="text-rose-600 text-base">{formatPriceVND(total)}₫</span>
                </div>
              </div>

              {/* Nút chuyển trang thanh toán */}
              <Link
                href={`/checkout?coupon=${appliedCoupon}&discount=${discountPercent}`}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-slate-900/10 transition flex items-center justify-center gap-2"
              >
                Tiến hành thanh toán
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
