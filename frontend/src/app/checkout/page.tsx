'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '@/src/store/useCartStore';
import { useAuth } from '@/src/context/authContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, CreditCard, Landmark, Truck, ShoppingBag, ShieldCheck } from 'lucide-react';
import { formatPriceVND } from '@/src/utils/format';
import toast from 'react-hot-toast';
import { apiCreateOrder } from '@/src/lib/api';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(/(0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại Việt Nam không hợp lệ (10 chữ số)'),
  email: z.string().email('Địa chỉ email không hợp lệ'),
  address: z.string().min(5, 'Vui lòng nhập địa chỉ nhận hàng chi tiết'),
  city: z.string().min(2, 'Vui lòng nhập Tỉnh / Thành phố'),
  district: z.string().min(2, 'Vui lòng nhập Quận / Huyện'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['cod', 'bank']),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function CheckoutContent() {
  const { items: cartItems, clearCart, getSubtotal } = useCartStore();
  const { user, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const couponCode = searchParams.get('coupon') || '';
  const discountPercent = Number(searchParams.get('discount') || '0');

  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderInfo, setPlacedOrderInfo] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: 'Hà Nội',
      district: '',
      notes: '',
      paymentMethod: 'cod',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  // Autofill user name & email when user is loaded
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      router.push('/cart');
    }
  }, [cartItems, orderSuccess, router]);

  const subtotal = getSubtotal();
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal > 500000 ? 0 : 30000;
  const total = subtotal - discountAmount + shippingFee;

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!token) {
      toast.error('Vui lòng đăng nhập tài khoản để đặt hàng.');
      router.push('/login');
      return;
    }

    setIsOrdering(true);

    const items = cartItems.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    }));

    try {
      const res = await apiCreateOrder(
        {
          customer_name: data.name,
          customer_phone: data.phone,
          customer_email: data.email,
          shipping_address: data.address,
          city: data.city,
          district: data.district,
          notes: data.notes || undefined,
          payment_method: data.paymentMethod === 'bank' ? 'payos' : 'cod',
          items,
          discount_amount: discountAmount,
        },
        token
      );

      if (res.ok) {
        clearCart();
        if (res.data.checkoutUrl) {
          window.location.href = res.data.checkoutUrl;
        } else {
          setPlacedOrderInfo({
            orderId: res.data.order.orderCode,
            name: res.data.order.customerName,
            phone: res.data.order.customerPhone,
            email: res.data.order.customerEmail,
            address: `${res.data.order.shippingAddress}, ${res.data.order.district}, ${res.data.order.city}`,
            paymentMethod: res.data.order.paymentMethod,
            total: Number(res.data.order.total),
            items: [...cartItems],
          });
          setOrderSuccess(true);
          toast.success('Đặt hàng thành công!');
        }
      } else {
        toast.error(res.data.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Đã xảy ra lỗi khi tạo đơn hàng.');
    } finally {
      setIsOrdering(false);
    }
  };

  if (orderSuccess && placedOrderInfo) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-800">Đặt Hàng Thành Công!</h1>
            <p className="text-sm text-slate-500">
              Cảm ơn bạn đã tin tưởng mua sắm. Mã đơn hàng của bạn là{' '}
              <span className="font-semibold text-slate-800">#{placedOrderInfo.orderId}</span>
            </p>
          </div>

          <div className="border border-slate-100 bg-slate-50 rounded-2xl p-4 text-left text-xs text-slate-600 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Khách hàng:</span>
              <span className="font-medium text-slate-800">{placedOrderInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Số điện thoại:</span>
              <span className="font-medium text-slate-800">{placedOrderInfo.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Địa chỉ:</span>
              <span className="font-medium text-slate-800 text-right">{placedOrderInfo.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Thanh toán:</span>
              <span className="font-medium text-slate-800">
                {placedOrderInfo.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản / PayOS'}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-800">Tổng thanh toán:</span>
              <span className="font-bold text-rose-600 text-sm">{formatPriceVND(placedOrderInfo.total)}₫</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/orders"
              className="flex-1 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              Xem đơn hàng
            </Link>
            <Link
              href="/products"
              className="flex-1 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại giỏ hàng
          </Link>
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
            <ShieldCheck className="h-4 w-4" /> Thanh toán an toàn 100%
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột trái: Form thông tin giao hàng validate với React Hook Form & Zod */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
                1. Thông tin giao hàng
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="Nguyễn Văn A"
                    className={`w-full text-xs rounded-xl border p-3 outline-none transition ${
                      errors.name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-[11px] text-rose-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="0912345678"
                    className={`w-full text-xs rounded-xl border p-3 outline-none transition ${
                      errors.phone ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                    }`}
                  />
                  {errors.phone && <p className="mt-1 text-[11px] text-rose-500">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="email@example.com"
                  className={`w-full text-xs rounded-xl border p-3 outline-none transition ${
                    errors.email ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {errors.email && <p className="mt-1 text-[11px] text-rose-500">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tỉnh / Thành phố <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    placeholder="Hà Nội, TP.HCM..."
                    className={`w-full text-xs rounded-xl border p-3 outline-none transition ${
                      errors.city ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                    }`}
                  />
                  {errors.city && <p className="mt-1 text-[11px] text-rose-500">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quận / Huyện <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('district')}
                    placeholder="Quận Cầu Giấy..."
                    className={`w-full text-xs rounded-xl border p-3 outline-none transition ${
                      errors.district ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                    }`}
                  />
                  {errors.district && <p className="mt-1 text-[11px] text-rose-500">{errors.district.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ cụ thể (Số nhà, ngõ, tên đường) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('address')}
                  placeholder="Ví dụ: 123 Đường Cầu Giấy, Phường Dịch Vọng"
                  className={`w-full text-xs rounded-xl border p-3 outline-none transition ${
                    errors.address ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {errors.address && <p className="mt-1 text-[11px] text-rose-500">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú giao hàng (Tùy chọn)</label>
                <textarea
                  {...register('notes')}
                  rows={2}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                  className="w-full text-xs rounded-xl border border-slate-200 p-3 outline-none focus:border-slate-800 transition"
                />
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
                2. Phương thức thanh toán
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    selectedPaymentMethod === 'cod'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input type="radio" value="cod" {...register('paymentMethod')} className="sr-only" />
                  <Truck className="h-5 w-5 text-slate-700" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-[10px] text-slate-500">Kiểm tra hàng rồi thanh toán tiền mặt</p>
                  </div>
                </label>

                <label
                  className={`relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    selectedPaymentMethod === 'bank'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input type="radio" value="bank" {...register('paymentMethod')} className="sr-only" />
                  <Landmark className="h-5 w-5 text-slate-700" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Chuyển khoản QR / PayOS</p>
                    <p className="text-[10px] text-slate-500">Quét mã QR VietQR thanh toán tức thì</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 sticky top-24">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex justify-between items-center">
                <span>Đơn hàng của bạn</span>
                <span className="text-xs text-slate-500 font-normal">({cartItems.length} sản phẩm)</span>
              </h2>

              {/* Danh sách tóm tắt */}
              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-slate-100 pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-3 flex gap-3 items-center">
                    <div className="relative h-14 w-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border">
                      <Image
                        src={item.image || '/shop-banner.png'}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500">
                        Size: {item.size} | Màu: {item.color} | SL: {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {formatPriceVND(item.price * item.quantity)}₫
                    </p>
                  </div>
                ))}
              </div>

              {/* Chi phí */}
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-slate-800">{formatPriceVND(subtotal)}₫</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Giảm giá ({couponCode})</span>
                    <span>-{formatPriceVND(discountAmount)}₫</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Phí giao hàng</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-600">Miễn phí</strong> : `${formatPriceVND(shippingFee)}₫`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Tổng thanh toán</span>
                  <span className="text-rose-600 text-base">{formatPriceVND(total)}₫</span>
                </div>
              </div>

              {/* Nút đặt hàng */}
              <button
                type="submit"
                disabled={isOrdering}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-slate-900/10 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isOrdering ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang xử lý đơn hàng...
                  </>
                ) : (
                  'Hoàn tất đặt hàng'
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
