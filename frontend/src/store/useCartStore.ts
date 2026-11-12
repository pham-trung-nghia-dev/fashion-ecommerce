import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

export interface CartItem {
  id: string; // Composite key: `${productId}-${size}-${color}`
  productId: number;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  quantity: number;
  size: string;
  color: string;
  sku?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: {
    id: number;
    name: string;
    price: number | string;
    oldPrice?: number | string | null;
    image: string;
    size?: string;
    color?: string;
    quantity?: number;
    sku?: string;
  }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const size = product.size || "M";
        const color = product.color || "Tiêu chuẩn";
        const quantity = product.quantity || 1;
        const compositeId = `${product.id}-${size}-${color}`;

        // Chuẩn hoá giá thành số
        const numericPrice = typeof product.price === "string"
          ? parseFloat(product.price.replace(/[^\d]/g, "")) || 0
          : product.price;

        const numericOldPrice = product.oldPrice
          ? typeof product.oldPrice === "string"
            ? parseFloat(product.oldPrice.replace(/[^\d]/g, "")) || null
            : product.oldPrice
          : null;

        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.id === compositeId);

        let newItems: CartItem[];
        if (existingIndex > -1) {
          newItems = [...currentItems];
          newItems[existingIndex].quantity += quantity;
        } else {
          newItems = [
            ...currentItems,
            {
              id: compositeId,
              productId: product.id,
              name: product.name,
              price: numericPrice,
              oldPrice: numericOldPrice,
              image: product.image,
              quantity,
              size,
              color,
              sku: product.sku,
            },
          ];
        }

        set({ items: newItems });
        toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`, {
          icon: "🛍️",
          duration: 2500,
        });
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
        toast("Đã xoá sản phẩm khỏi giỏ", { icon: "🗑️" });
      },

      updateQuantity: (id: string, delta: number) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null),
        }));
      },

      setQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "fashion_cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

