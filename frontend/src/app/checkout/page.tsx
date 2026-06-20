'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useCart } from '@/src/context/cartContext';
import { useAuth } from '@/src/context/authContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, CreditCard, Landmark, Truck, ShoppingBag } from 'lucide-react';
import { formatPriceVND } from '@/src/utils/format';
import toast from 'react-hot-toast';

function CheckoutContent() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load coupon from URL query parameters
  const couponCode = searchParams.get('coupon') || '';
  const discountPercent = Number(searchParams.get('discount') || '0');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderInfo, setPlacedOrderInfo] = useState<any>(null);

  // Autofill user info if logged in
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Redirect to cart if cart is empty and not checked out successfully yet
  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      router.push('/cart');
    }
  }, [cart, orderSuccess, router]);

  const subtotal = cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal > 1000000 ? 0 : 30000;
  const total = subtotal - discountAmount + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !address || !city || !district) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng bắt buộc.');
      return;
    }

    setIsOrdering(true);

    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlacedOrderInfo({
      orderId,
      name,
      phone,
      email,
      address: `${address}, ${district}, ${city}`,
      paymentMethod,
      total,
      items: [...cart],
    });

    setIsOrdering(false);
    setOrderSuccess(true);
    clearCart();
    toast.success('Đặt hàng thành công!');
  };

  if (orderSuccess && placedOrderInfo) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle className="h-10 w-10" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-zinc-900">Đặt hàng thành công!</h1>
            <p className="text-zinc-500 text-sm">
              Cảm ơn bạn đã mua sắm tại FASHION. Mã đơn hàng của bạn là <span className="font-bold text-zinc-900">{placedOrderInfo.orderId}</span>.
            </p>
          </div>

          <div className="border border-zinc-100 rounded-2xl p-5 text-left text-sm space-y-3 bg-zinc-50/50">
            <h3 className="font-bold text-zinc-900 text-center pb-2 border-b border-zinc-200/60">Tóm tắt đơn hàng</h3>
            <div className="flex justify-between text-zinc-600">
              <span>Người nhận:</span>
              <span className="font-semibold text-zinc-800">{placedOrderInfo.name}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Số điện thoại:</span>
              <span className="font-semibold text-zinc-800">{placedOrderInfo.phone}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Địa chỉ nhận hàng:</span>
              <span className="font-semibold text-zinc-800 text-right max-w-[250px] truncate" title={placedOrderInfo.address}>
                {placedOrderInfo.address}
              </span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Phương thức:</span>
              <span className="font-semibold text-zinc-800">
                {placedOrderInfo.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
              </span>
            </div>
            <div className="flex justify-between text-zinc-950 font-bold border-t border-zinc-200/60 pt-2">
              <span>Tổng cộng:</span>
              <span>₫ {formatPriceVND(placedOrderInfo.total)}</span>
            </div>
          </div>

          {placedOrderInfo.paymentMethod === 'bank' && (
            <div className="bg-amber-50 text-amber-900 rounded-2xl p-5 text-xs text-left leading-relaxed space-y-2">
              <p className="font-bold">Thông tin chuyển khoản ngân hàng:</p>
              <p>Ngân hàng: <strong>MB Bank (Ngân hàng Quân Đội)</strong></p>
              <p>Số tài khoản: <strong>360888999999</strong></p>
              <p>Chủ tài khoản: <strong>CONG TY THOI TRANG FASHION</strong></p>
              <p>Nội dung CK: <strong>FASHION {placedOrderInfo.orderId}</strong></p>
              <p className="text-zinc-500 italic mt-2">
                *Đơn hàng của bạn sẽ được xử lý ngay sau khi hệ thống nhận được thanh toán.
              </p>
            </div>
          )}

          <Link 
            href="/products"
            className="inline-flex w-full py-3.5 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-all items-center justify-center space-x-2"
          >
            <span>Tiếp tục mua sắm</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-14">
        {/* Back Link */}
        <Link href="/cart" className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Quay lại giỏ hàng</span>
        </Link>

        <h1 className="text-3xl font-bold text-zinc-950 mb-10 tracking-tight">Thanh Toán</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Shipping Form & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {/* Info form */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-zinc-900 pb-4 border-b border-zinc-100 flex items-center gap-2">
                <Truck className="h-5 w-5 text-zinc-600" />
                <span>Thông tin giao hàng</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-zinc-900 placeholder-zinc-400 bg-zinc-50/50 text-sm"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-zinc-900 placeholder-zinc-400 bg-zinc-50/50 text-sm"
                    placeholder="0973xxxxxx"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">Địa chỉ Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-zinc-900 placeholder-zinc-400 bg-zinc-50/50 text-sm"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">Địa chỉ cụ thể *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-zinc-900 placeholder-zinc-400 bg-zinc-50/50 text-sm"
                  placeholder="Số 123, đường Láng"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500">Tỉnh / Thành phố *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-zinc-900 placeholder-zinc-400 bg-zinc-50/50 text-sm"
                    placeholder="Hà Nội"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500">Quận / Huyện *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-zinc-900 placeholder-zinc-400 bg-zinc-50/50 text-sm"
                    placeholder="Đống Đa"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">Ghi chú đơn hàng</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-zinc-900 placeholder-zinc-400 bg-zinc-50/50 text-sm"
                  placeholder="Giao giờ hành chính, gọi trước khi giao..."
                />
              </div>
            </div>

            {/* Payment options */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-zinc-900 pb-4 border-b border-zinc-100 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-zinc-600" />
                <span>Phương thức thanh toán</span>
              </h2>

              <div className="space-y-3">
                <label className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-zinc-900 bg-zinc-50/30' : 'border-zinc-200 hover:bg-zinc-50/20'}`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-zinc-900"
                  />
                  <div>
                    <span className="font-semibold text-sm text-zinc-900 flex items-center gap-1.5">
                      <Truck className="h-4 w-4 text-zinc-600" />
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <p className="text-xs text-zinc-500 mt-1">
                      Thanh toán bằng tiền mặt khi shipper giao hàng tận nơi cho bạn.
                    </p>
                  </div>
                </label>

                <label className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-zinc-900 bg-zinc-50/30' : 'border-zinc-200 hover:bg-zinc-50/20'}`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                    className="mt-1 accent-zinc-900"
                  />
                  <div>
                    <span className="font-semibold text-sm text-zinc-900 flex items-center gap-1.5">
                      <Landmark className="h-4 w-4 text-zinc-600" />
                      Chuyển khoản ngân hàng (ATM/Internet Banking)
                    </span>
                    <p className="text-xs text-zinc-500 mt-1">
                      Chuyển khoản qua ứng dụng ngân hàng hoặc quét mã QR sau khi đặt hàng thành công.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Cart Items & Cost Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2 border-b border-zinc-100 pb-4">
                <ShoppingBag className="h-5 w-5 text-zinc-600" />
                <span>Đơn hàng của bạn ({cart.length})</span>
              </h3>

              {/* Items List */}
              <div className="max-h-[250px] overflow-y-auto pr-1 space-y-4 border-b border-zinc-100 pb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-xl border border-zinc-100 bg-zinc-50 overflow-hidden relative flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-zinc-900 truncate">{item.name}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">Số lượng: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-zinc-800 flex-shrink-0">
                      ₫ {formatPriceVND(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary Details */}
              <div className="space-y-4 text-sm border-b border-zinc-100 pb-6 text-zinc-600">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-zinc-900">₫ {formatPriceVND(subtotal)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Mã giảm giá ({couponCode})</span>
                    <span className="font-semibold">-₫ {formatPriceVND(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-zinc-900">
                    {shippingFee === 0 ? 'Miễn phí' : `₫ ${formatPriceVND(shippingFee)}`}
                  </span>
                </div>
              </div>

              {/* Total Price */}
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-base font-bold text-zinc-950">Tổng cộng</span>
                <span className="text-2xl font-bold text-zinc-950">
                  ₫ {formatPriceVND(total)}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isOrdering || cart.length === 0}
                className="w-full py-4 bg-zinc-950 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-zinc-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-zinc-900/10 cursor-pointer"
              >
                {isOrdering ? (
                  <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Đặt hàng ngay</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16">
        <div className="h-8 w-8 border-4 border-zinc-900/10 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
