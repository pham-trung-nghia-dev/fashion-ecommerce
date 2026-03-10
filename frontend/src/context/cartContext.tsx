'use client';

import React, { createContext, useEffect, useState } from 'react';

// 1. Khai báo kiểu dữ liệu
export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  // Load giỏ hàng từ LocalStorage khi mở trang
  useEffect(() => {
    const data = localStorage.getItem('cart');
    if (data) setCart(JSON.parse(data));
  }, []);

  // Lưu giỏ hàng khi có thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
};