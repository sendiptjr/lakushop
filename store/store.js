// store.js

import { create } from 'zustand'

const useStore = create((set) => ({
  cartItems: 0,
  favProducts: [],
  toggleFavProduct: (id) => set((state) => {
    const isProductFavorited = state.favProducts.includes(id);

    if (isProductFavorited) {
      // Remove the product ID if it's already favorited
      const updatedFavProducts = state.favProducts.filter((productId) => productId !== id);
      return { favProducts: updatedFavProducts };
    } else {
      // Add the product ID if it's not favorited yet
      return { favProducts: [...state.favProducts, id] };
    }
  }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  set: (password) => set((state) => ({ user: { ...state.user, password } })),
  user: {
    email: '',
    password: '',
    setEmail: (email) => set((state) => ({ user: { ...state.user, email } })),
    setPassword: (password) => set((state) => ({ user: { ...state.user, password } })),
  },
}));

export default useStore;
