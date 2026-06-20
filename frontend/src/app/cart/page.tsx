'use client';

import React, { useState } from 'react';
import { useCart } from '@/src/context/cartContext';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Ticket } from 'lucide-react';
import { formatPriceVND } from '@/src/utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const subtotal = cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    
    // Simple mock coupons
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
  const shippingFee = subtotal > 1000000 || subtotal === 0 ? 0 : 30000; // Free shipping over 1M
  const total = subtotal - discountAmount + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-slate-50 flex items-center justify-center py-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 shadow-md text-center space-y-6"
        >
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="h-10 w-10 text-zinc-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-zinc-900">Giỏ hàng của bạn đang trống</h1>
            <p className="text-zinc-500 text-sm">
              Có vẻ như bạn chưa chọn được sản phẩm ưng ý. Hãy ghé cửa hàng để lựa chọn nhé!
            </p>
          </div>
          <Link 
            href="/products"
            className="inline-flex w-full py-3.5 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-all items-center justify-center space-x-2 shadow-lg shadow-zinc-900/10"
          >
            <span>Quay lại cửa hàng</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-14">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-zinc-500">
          <Link href="/home" className="hover:text-zinc-950 transition-colors">Trang chủ</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-zinc-950 font-medium">Giỏ hàng</span>
        </nav>

        <h1 className="text-3xl font-bold text-zinc-950 mb-10 tracking-tight">Giỏ Hàng Của Bạn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List items */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 pb-4 border-b border-zinc-100">
              Sản phẩm ({cart.length})
            </h2>

            <div className="divide-y divide-zinc-100">
              <AnimatePresence initial={false}>
                {cart.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0 group"
                  >
                    {/* Img + Title */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-20 h-20 bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden relative flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <Link href={`/shop/${item.id}`} className="font-semibold text-zinc-900 hover:text-zinc-600 transition-colors text-sm md:text-base block truncate">
                          {item.name}
                        </Link>
                        {item.subTitle && (
                          <p className="text-xs text-zinc-400 truncate">{item.subTitle}</p>
                        )}
                        <p className="text-sm font-semibold text-zinc-800 sm:hidden">
                          ₫ {formatPriceVND(item.price)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity controls & Price info */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="flex items-center rounded-xl border border-zinc-200 px-3 py-1.5">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-zinc-500 hover:text-zinc-950 p-1 cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm text-zinc-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-zinc-500 hover:text-zinc-950 p-1 cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right hidden sm:block min-w-[100px]">
                        <p className="text-sm font-semibold text-zinc-900">
                          ₫ {formatPriceVND(item.price)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Tổng: ₫ {formatPriceVND(Number(item.price) * item.quantity)}
                          </p>
                        )}
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-red-600 transition-colors p-2 rounded-xl hover:bg-zinc-50 cursor-pointer"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Cart totals summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* Coupon widget */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 mb-4 flex items-center gap-2">
                <Ticket className="h-4 w-4 text-zinc-600" />
                <span>Mã giảm giá</span>
              </h3>
              
              {appliedCoupon ? (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl flex items-center justify-between text-xs font-semibold">
                  <div>
                    <span className="font-bold">{appliedCoupon}</span>
                    <span className="ml-2 font-normal text-emerald-600">(-{discountPercent}%)</span>
                  </div>
                  <button 
                    onClick={removeCoupon} 
                    className="text-emerald-800 hover:underline uppercase tracking-wider font-bold cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Mã: FASHIONNEW, SUMMERSALE"
                    className="flex-1 px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all placeholder-zinc-400 text-zinc-900"
                  />
                  <button 
                    type="submit"
                    className="bg-zinc-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </form>
              )}
            </div>

            {/* Price details card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-zinc-950">Tóm tắt đơn hàng</h3>

              <div className="space-y-4 text-sm border-b border-zinc-100 pb-6">
                <div className="flex justify-between text-zinc-600">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-zinc-900">₫ {formatPriceVND(subtotal)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Giảm giá ({discountPercent}%)</span>
                    <span className="font-semibold">-₫ {formatPriceVND(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-zinc-900">
                    {shippingFee === 0 ? 'Miễn phí' : `₫ ${formatPriceVND(shippingFee)}`}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-[10px] text-zinc-400">Miễn phí vận chuyển cho đơn hàng từ 1.000.000 ₫</p>
                )}
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-base font-bold text-zinc-950">Tổng cộng</span>
                <span className="text-2xl font-bold text-zinc-950">
                  ₫ {formatPriceVND(total)}
                </span>
              </div>

              {/* Pass the discount & shipping state via URL query to the checkout page */}
              <Link 
                href={`/checkout?coupon=${appliedCoupon}&discount=${discountPercent}`}
                className="flex w-full py-4 bg-zinc-950 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-zinc-800 transition-all items-center justify-center space-x-2 shadow-md shadow-zinc-900/10 cursor-pointer"
              >
                <span>Tiến hành thanh toán</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="text-center">
                <Link href="/products" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-medium">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
