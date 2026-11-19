"use client";

import { Button } from "@/components/ui/button"; // was missing
import RemoveFromCart from "@/components/RemoveFromCart"; // was missing
import { useCartStore } from "@/store"; // was "@/store"
import type { Product } from "@/typings/searchTypings";

type CartProduct = Pick<Product, "product_id" | "title" | "url" | "image" | "price" | "currency"> & {
  images?: string[];
};

function AddToCart({ product }: { product: CartProduct }) {
  // Select values separately. The array version can cause an infinite loop in Zustand 5
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);

  // The shape the cart stores (the same type the search results use)
  const productKey = product.url ?? product.product_id ?? product.title;
  const cartItem: Product = {
    product_id: productKey,
    url: product.url,
    title: product.title,
    image: product.image ?? product.images?.[0],
    price: product.price,
    currency: product.currency,
  };

  console.log(cart);

  // meta.sku doesn't exist in your data, so match on the product url
  const howManyInCart = cart.filter(
    (item) => (item.product_id ?? item.url ?? item.title) === productKey
  ).length;

  console.log("How many in cart: ", howManyInCart);
  const handleAdd = () => {
    console.log("Adding to cart", product);
    addToCart(cartItem);
  };

  if (howManyInCart > 0) {
    return (
      <div className="flex space-x-5 items-center">
        <RemoveFromCart product={cartItem} />
        <span>{howManyInCart}</span>
        <Button className="bg-walmart hover:bg-walmart/50" onClick={handleAdd}>
          +
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      className="bg-walmart hover:bg-walmart/50"
      onClick={handleAdd}
    >
      Add to Cart
    </Button>
  );
}

export default AddToCart;