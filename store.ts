import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Product } from "@/typings/searchTypings";

interface CartState {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
}

// Scraped products don't have meta.sku, so match on product_id, then url
const keyOf = (p: Product) => p.product_id ?? p.url ?? p.title;

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],

        addToCart: (product) => {
          set((state) => ({
            cart: [...state.cart, product],
          }));
        },

        removeFromCart: (product) => {
          const productToRemove = get().cart.findIndex(
            (p) => keyOf(p) === keyOf(product)
          );

          // Without this, splice(-1, 1) would remove the last item
          if (productToRemove === -1) return;

          set((state) => {
            const newCart = [...state.cart];

            newCart.splice(productToRemove, 1);
            return { cart: newCart };
          });
        },
      }),
      {
        name: "shopping-cart-storage",
      }
    )
  )
);