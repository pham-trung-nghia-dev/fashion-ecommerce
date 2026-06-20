'use client';
import { useCart } from '../context/cartContext';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { formatPriceVND } from '../utils/format';

export default function CartPopup() {
  const { cart, isOpen, setIsOpen, removeFromCart } = useCart();

  if (!isOpen) return null;

  const subtotal = cart.reduce((total: number, item: any) => total + (Number(item.price) * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300" 
        onClick={() => setIsOpen(false)}
      />

      {/* Cart Drawer */}
      <div className="relative w-full max-w-[400px] bg-white h-screen shadow-2xl p-6 flex flex-col z-10 transition-transform duration-300 ease-out border-l border-zinc-100">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-100 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-zinc-900" />
            <h2 className="text-xl font-bold text-zinc-950 uppercase tracking-wider">
              Giỏ hàng ({cart.length})
            </h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-zinc-400 hover:text-zinc-900 transition-colors p-1 rounded-full hover:bg-zinc-100 cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-zinc-400" />
              </div>
              <div>
                <p className="text-zinc-800 font-semibold text-base">Giỏ hàng của bạn đang trống</p>
                <p className="text-zinc-500 text-xs mt-1">Hãy thêm những món đồ yêu thích của bạn vào nhé.</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="mt-2 px-5 py-2.5 bg-zinc-950 text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            cart.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 py-3 border-b border-zinc-50 group">
                <div className="bg-zinc-50 rounded-xl w-[80px] h-[80px] relative overflow-hidden flex-shrink-0 border border-zinc-100">
                  <Image src={item.image} alt={item.name} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-zinc-900 truncate hover:text-zinc-600 transition-colors">
                    <Link href={`/shop/${item.id}`} onClick={() => setIsOpen(false)}>
                      {item.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Số lượng: <span className="font-semibold text-zinc-800">{item.quantity}</span>
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-950">
                    ₫ {formatPriceVND(item.price)}
                  </p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-zinc-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-zinc-50 cursor-pointer"
                  title="Xóa sản phẩm"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Action Buttons */}
        {cart.length > 0 && (
          <div className="border-t border-zinc-100 pt-6 mt-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="text-zinc-500 text-sm font-medium">Tổng tiền tạm tính</span>
              <span className="text-zinc-950 font-bold text-lg">
                ₫ {formatPriceVND(subtotal)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/cart" 
                onClick={() => setIsOpen(false)}
                className="border border-zinc-300 text-zinc-800 font-semibold uppercase tracking-wider rounded-xl py-3 text-xs text-center hover:bg-zinc-50 hover:border-zinc-400 transition-all flex items-center justify-center"
              >
                Giỏ hàng
              </Link>
              <Link 
                href="/checkout" 
                onClick={() => setIsOpen(false)}
                className="bg-zinc-950 border border-transparent text-white font-semibold uppercase tracking-wider rounded-xl py-3 text-xs text-center hover:bg-zinc-800 transition-all flex items-center justify-center shadow-md shadow-zinc-900/10"
              >
                Thanh toán
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}