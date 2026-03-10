'use client';
import { useContext } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { CartContext } from '../context/cartContext';

export default function CartPopup() {
  const { cart, isOpen, setIsOpen } = useContext(CartContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Lớp nền mờ khi bấm vào sẽ đóng popup */}
      <div 
        className="absolute inset-0 bg-black/20" 
        onClick={() => setIsOpen(false)}
      />

      {/* Nội dung Popup */}
      <div className="relative w-full max-w-[417px] bg-white h-screen shadow-xl p-7 flex flex-col">
        <div className="flex justify-between items-center mb-9">
          <h2 className="text-2xl font-semibold border-b-2 border-[#D9D9D9] pb-4 w-full">
            Shopping Cart
          </h2>
          <button onClick={() => setIsOpen(false)} className="absolute right-7 top-7">
             <span className="text-xl">×</span>
          </button>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="flex-1 overflow-y-auto space-y-5">
          {cart.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="bg-[#B88E2F]/10 rounded-lg w-[105px] h-[105px] relative overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-base">{item.name}</h3>
                <p className="mt-2 text-sm">
                  {item.quantity} x <span className="text-[#B88E2F] font-medium">Rs. {item.price.toLocaleString()}</span>
                </p>
              </div>
              <button className="text-[#9F9F9F] bg-[#9F9F9F] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
            </div>
          ))}
        </div>

        {/* Tổng tiền & Nút bấm */}
        <div className="mt-auto">
          <div className="flex justify-between py-6 border-b border-[#D9D9D9]">
            <span>Subtotal</span>
            <span className="text-[#B88E2F] font-semibold">
              Rs. {cart.reduce((total: number, item: any) => total + (item.price * item.quantity), 0).toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Link href="/cart" className="border border-black rounded-full py-2 text-xs text-center hover:bg-black hover:text-white transition">Cart</Link>
            <Link href="/checkout" className="border border-black rounded-full py-2 text-xs text-center hover:bg-black hover:text-white transition">Checkout</Link>
            <Link href="/comparison" className="border border-black rounded-full py-2 text-xs text-center hover:bg-black hover:text-white transition">Comparison</Link>
          </div>
        </div>
      </div>
    </div>
  );
}