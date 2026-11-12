import { create } from "zustand";

interface UIStore {
  isCartDrawerOpen: boolean;
  isSearchModalOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartDrawerOpen: false,
  isSearchModalOpen: false,

  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),
}));

