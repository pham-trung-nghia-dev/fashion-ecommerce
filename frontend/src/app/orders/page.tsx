'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/src/context/authContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiGetOrders, ApiOrder } from '@/src/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  Truck, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  Phone, 
  User, 
  FileText,
  Clock
} from 'lucide-react';
import { formatPriceVND } from '@/src/utils/format';
import toast from 'react-hot-toast';

function OrdersContent() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  // Read query params for payments
  const paymentStatus = searchParams.get('payment');
  const orderCode = searchParams.get('orderCode');
  const isMock = searchParams.get('mock');

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Vui lòng đăng nhập để xem lịch sử đơn hàng.');
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Handle payment status feedback from URL redirection
  useEffect(() => {
    if (paymentStatus && orderCode) {
      if (paymentStatus === 'success') {
        if (isMock) {
          toast.success(`[MOCK] Thanh toán giả lập thành công đơn hàng #${orderCode}!`, { duration: 6000 });
        } else {
          toast.success(`Thanh toán thành công đơn hàng #${orderCode}!`, { duration: 5000 });
        }
      } else if (paymentStatus === 'cancel') {
        toast.error(`Giao dịch thanh toán đơn hàng #${orderCode} đã bị hủy.`, { duration: 5000 });
      }
      
      // Clean query params from URL
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [paymentStatus, orderCode, isMock, router]);

  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await apiGetOrders(token);
      if (res.ok) {
        setOrders(res.data.data);
        // Expand the first order by default if it exists
        if (res.data.data.length > 0) {
          setExpandedOrderId(res.data.data[0].id);
        }
      } else {
        toast.error('Không thể tải lịch sử đơn hàng.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi kết nối mạng khi tải đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  if (authLoading || (loading && orders.length === 0)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 border-4 border-zinc-900/10 border-t-zinc-900 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  // Visual status configurations
  const getPaymentStatusConfig = (status: ApiOrder['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return { label: 'Đã thanh toán', className: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle };
      case 'failed':
        return { label: 'Thanh toán lỗi', className: 'bg-rose-50 text-rose-700 border-rose-100', icon: XCircle };
      case 'cancelled':
        return { label: 'Đã hủy', className: 'bg-slate-100 text-slate-700 border-slate-200', icon: XCircle };
      case 'pending':
      default:
        return { label: 'Chờ thanh toán', className: 'bg-amber-50 text-amber-700 border-amber-100', icon: Clock };
    }
  };

  const getShippingStatusConfig = (status: ApiOrder['shippingStatus']) => {
    switch (status) {
      case 'shipping':
        return { label: 'Đang giao hàng', className: 'bg-blue-50 text-blue-700 border-blue-100' };
      case 'delivered':
        return { label: 'Đã nhận hàng', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
      case 'cancelled':
        return { label: 'Đã hủy', className: 'bg-rose-50 text-rose-700 border-rose-100' };
      case 'pending':
      default:
        return { label: 'Đang chuẩn bị', className: 'bg-zinc-100 text-zinc-700 border-zinc-200' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-14 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-zinc-950 tracking-tight">Đơn Hàng Của Tôi</h1>
            <p className="text-zinc-500 text-sm mt-1">Theo dõi trạng thái và lịch sử mua sắm của bạn.</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="self-start md:self-auto px-5 py-2.5 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 rounded-xl text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            Làm mới
          </button>
        </div>

        {/* Banners for payment outcomes */}
        {paymentStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-3xl flex gap-4 items-start text-emerald-900"
          >
            <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-base">Thanh toán thành công!</h4>
              <p className="text-sm mt-1 opacity-90">
                Đơn hàng #{orderCode} đã được thanh toán trực tuyến thành công. Cửa hàng đang chuẩn bị sản phẩm và sẽ sớm giao đến địa chỉ của bạn.
              </p>
            </div>
          </motion.div>
        )}

        {paymentStatus === 'cancel' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-3xl flex gap-4 items-start text-amber-900"
          >
            <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-base">Thanh toán bị hủy</h4>
              <p className="text-sm mt-1 opacity-90">
                Giao dịch thanh toán cho đơn hàng #{orderCode} đã bị hủy hoặc chưa hoàn tất. Đơn hàng vẫn được tạo ở trạng thái **Chờ thanh toán**.
              </p>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 text-center border border-zinc-100 shadow-sm space-y-6 flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-400">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900">Bạn chưa có đơn hàng nào</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                Bắt đầu lựa chọn những món đồ thời trang tuyệt đẹp của chúng tôi để tạo đơn hàng đầu tiên của bạn!
              </p>
            </div>
            <Link 
              href="/products"
              className="inline-flex px-6 py-3 bg-zinc-950 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all shadow-md"
            >
              Mua sắm ngay
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const payStatus = getPaymentStatusConfig(order.paymentStatus);
              const shipStatus = getShippingStatusConfig(order.shippingStatus);
              const PayIcon = payStatus.icon;

              return (
                <div 
                  key={order.id}
                  className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  {/* Card Header (Summary) */}
                  <div 
                    onClick={() => toggleExpand(order.id)}
                    className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50/40 select-none"
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="font-extrabold text-base text-zinc-950">
                        #{order.orderCode}
                      </span>
                      <span className="flex items-center text-xs text-zinc-500 gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Payment Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-semibold ${payStatus.className}`}>
                        <PayIcon className="h-3 w-3" />
                        {payStatus.label}
                      </span>

                      {/* Shipping Badge */}
                      <span className={`inline-flex items-center px-3 py-1 border rounded-full text-xs font-semibold ${shipStatus.className}`}>
                        {shipStatus.label}
                      </span>

                      <span className="font-extrabold text-lg text-zinc-950 md:ml-4">
                        ₫ {formatPriceVND(Number(order.total))}
                      </span>

                      <button className="text-zinc-400 hover:text-zinc-900 transition-colors p-1 md:ml-2">
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Card Body (Detailed list & info) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="border-t border-zinc-100 overflow-hidden"
                      >
                        <div className="p-6 md:p-8 space-y-8 bg-zinc-50/20">
                          {/* Items Section */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                              <ShoppingBag className="h-4 w-4" />
                              <span>Danh sách sản phẩm</span>
                            </h4>
                            <div className="divide-y divide-zinc-100 bg-white rounded-2xl border border-zinc-200/60 overflow-hidden">
                              {order.items.map((item) => (
                                <div key={item.id} className="p-4 flex gap-4 items-center">
                                  <div className="w-16 h-16 border border-zinc-100 bg-zinc-50 rounded-xl overflow-hidden relative shrink-0">
                                    <Image src={item.image} alt={item.productName} fill unoptimized className="object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-zinc-900 truncate">{item.productName}</p>
                                    <p className="text-xs text-zinc-400 mt-1">
                                      Số lượng: <span className="font-semibold text-zinc-700">{item.quantity}</span>
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-sm text-zinc-800">₫ {formatPriceVND(Number(item.price))}</p>
                                    <p className="text-xs text-zinc-400 mt-0.5">
                                      Tổng: ₫ {formatPriceVND(Number(item.price) * item.quantity)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Billing & Shipping split */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-zinc-100">
                            {/* Shipping info */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Truck className="h-4 w-4" />
                                <span>Thông tin giao hàng</span>
                              </h4>
                              <div className="bg-white p-5 rounded-2xl border border-zinc-200/60 text-sm space-y-3 text-zinc-700">
                                <p className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-zinc-400 shrink-0" />
                                  <span className="font-semibold text-zinc-900">{order.customerName}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                                  <span>{order.customerPhone}</span>
                                </p>
                                <p className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                                  <span>{order.shippingAddress}, {order.district}, {order.city}</span>
                                </p>
                                {order.notes && (
                                  <p className="flex items-start gap-2 border-t border-zinc-100 pt-2 mt-2 italic text-zinc-500">
                                    <FileText className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                                    <span>Ghi chú: {order.notes}</span>
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Summary Price Card */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                <span>Thanh toán & Hóa đơn</span>
                              </h4>
                              <div className="bg-white p-5 rounded-2xl border border-zinc-200/60 text-sm space-y-3">
                                <div className="flex justify-between text-zinc-600">
                                  <span>Phương thức:</span>
                                  <span className="font-bold text-zinc-800">
                                    {order.paymentMethod === 'cod' 
                                      ? 'Thanh toán khi nhận hàng (COD)' 
                                      : 'Chuyển khoản trực tuyến (PayOS)'}
                                  </span>
                                </div>
                                <div className="flex justify-between text-zinc-600 border-t border-zinc-100/60 pt-2">
                                  <span>Tạm tính:</span>
                                  <span className="font-semibold text-zinc-800">₫ {formatPriceVND(Number(order.subtotal))}</span>
                                </div>
                                {Number(order.discountAmount) > 0 && (
                                  <div className="flex justify-between text-emerald-600">
                                    <span>Khuyến mãi:</span>
                                    <span className="font-semibold">-₫ {formatPriceVND(Number(order.discountAmount))}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-zinc-600">
                                  <span>Phí vận chuyển:</span>
                                  <span className="font-semibold text-zinc-800">
                                    {Number(order.shippingFee) === 0 ? 'Miễn phí' : `₫ ${formatPriceVND(Number(order.shippingFee))}`}
                                  </span>
                                </div>
                                <div className="flex justify-between text-zinc-950 font-extrabold text-base border-t border-zinc-200 pt-2.5">
                                  <span>Tổng cộng:</span>
                                  <span>₫ {formatPriceVND(Number(order.total))}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16">
        <div className="h-8 w-8 border-4 border-zinc-900/10 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
