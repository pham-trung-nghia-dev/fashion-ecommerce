'use client';

import { useContext } from 'react';

import { Product } from '../types/product.type';
import { CartContext } from '../context/cartContext';
import toast from 'react-hot-toast';
import { showMessage } from '../utils/notification';

export default function AddToCartButton({ product }: { product: Product }) {
  // Lấy trực tiếp state và hàm update từ Context
  const { cart, setCart } = useContext(CartContext);

  const handleAddToCart = () => {
    // Logic thêm vào giỏ hàng viết trực tiếp:
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      // Nếu đã có thì tăng số lượng
      const newCart = cart.map((item: any) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(newCart);
    } else {
      // Nếu chưa có thì thêm mới vào mảng
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    showMessage.success(`Đã thêm ${product.name} vào giỏ hàng thành công!`);
  };
  

  return (
    <button 
      onClick={handleAddToCart}
      className="bg-white text-[#B88E2F] w-full max-w-[202px] py-3 font-semibold hover:bg-[#B88E2F] hover:text-white transition-colors"
    >
      Add to cart
    </button>
  );
}