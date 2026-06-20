'use client';

import { useCart } from '../context/cartContext';
import { Product } from '../types/product.type';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="bg-white text-[#B88E2F] w-full max-w-[202px] py-3 font-semibold hover:bg-[#B88E2F] hover:text-white transition-colors cursor-pointer border border-[#B88E2F]"
    >
      Add to cart
    </button>
  );
}